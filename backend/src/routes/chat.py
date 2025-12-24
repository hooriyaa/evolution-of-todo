from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..models import Conversation, Message, User
from ..db import get_session
from ..auth import get_current_user
# Make sure this import matches your actual file name!
# If your file is 'chat_agent.py', change this to: from ..agents.chat_agent import TodoAgent
from ..agents.agent import TodoAgent
from typing import Optional
from pydantic import BaseModel
import logging

# Setup Logger
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

# Test endpoint to verify router is loaded
@router.get("/chat")
async def test():
    return {"message": "Chat router is working!"}

@router.post("/chat")
async def chat(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Get or Create Conversation
        if request.conversation_id:
            conversation = session.get(Conversation, request.conversation_id)
            # Verify that the conversation exists and belongs to the current user
            if not conversation:
                # Fallback: create new if ID provided but not found
                conversation = Conversation(user_id=current_user.id)
                session.add(conversation)
                session.commit()
                session.refresh(conversation)
            elif conversation.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Access denied: This conversation does not belong to you")
        else:
            conversation = Conversation(user_id=current_user.id) # Use authenticated user's ID
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # 2. Save User Message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        session.add(user_message)
        session.commit()

        # 3. Load History
        history_query = select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at)
        history = session.exec(history_query).all()
        
        # Format for AI
        messages = [{"role": msg.role, "content": msg.content} for msg in history]

        # 4. Call Agent
        try:
            agent = TodoAgent()
            # Pass session to agent so it can perform DB actions (Tools)
            response = await agent.process_message(messages, current_user.id, session)
        except Exception as agent_error:
            logger.error(f"Agent Error: {agent_error}")
            response = "Sorry, I'm having trouble processing that right now."

        # 5. Save AI Response
        ai_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=str(response)
        )
        session.add(ai_message)
        session.commit()

        return {
            "conversation_id": conversation.id,
            "response": response,
            "timestamp": ai_message.created_at.isoformat() if ai_message.created_at else ""
        }

    except HTTPException:
        # Re-raise HTTP exceptions (like 403) to preserve the status code
        raise
    except Exception as e:
        logger.error(f"Critical Error in Chat Endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))