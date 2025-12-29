import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class TodoAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai"
        )

        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task to the user's list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "The ID of the user"},
                            "title": {"type": "string", "description": "The task title"},
                            "description": {"type": "string", "description": "Optional task description"},
                            "due_date": {"type": "string", "description": "Optional due date in ISO format (YYYY-MM-DDTHH:MM:SS) or natural language (e.g., 'tomorrow at 5pm', 'next Monday')"},
                            "category": {"type": "string", "description": "Optional category for the task (e.g., 'Urgent', 'Work', 'Personal', 'Design', etc.)"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "The ID of the user"},
                            "completed": {"type": "boolean", "description": "Filter by completion status (optional)"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task by ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "The ID of the task to delete"},
                            "user_id": {"type": "integer", "description": "The ID of the user"}
                        },
                        "required": ["task_id", "user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as completed by title",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "The title of the task to mark as completed"},
                            "user_id": {"type": "integer", "description": "The ID of the user"}
                        },
                        "required": ["title", "user_id"]
                    }
                }
            }
        ]

    async def process_message(self, messages: list, user_id: int, session):
        """Process a message with the AI agent"""
        # Add tools to the request
        try:
            # Verify API key is available
            if not self.client.api_key:
                raise Exception("API key is not configured properly")

            # Add system message to provide user context to the LLM
            system_message = {
                "role": "system",
                "content": f"""You are an AI Task Assistant.
Current User ID: {user_id}

# RULES
- **Tool Usage:** ALWAYS use `user_id={user_id}`.
- **Extraction:** Look for `title`, `description`, `due_date`, and `category` (e.g., 'Urgent', 'Personal').
- **Complete Tasks:** You can now mark tasks as complete using the `complete_task` tool. If a user says 'I did the laundry', infer that the 'Laundry' task should be marked complete.

# GUIDANCE & EXAMPLES
- If the user says "add task" generically or seems confused, **YOU MUST SHOW THIS EXAMPLE**:
  "Sure! You can add a task with all details like this:
  👉 'Add a task [Title], desc: [Description], due: [Date/Time], category: [Urgent/Work]'"

- Example Input: "Add a task 'Submit Report' desc: 'Finalize finance' due: tomorrow at 10 AM category: Urgent"
"""
            }

            # Insert the system message at the beginning of the messages list
            formatted_messages = [system_message] + messages

            response = await self.client.chat.completions.create(
                model="gemini-2.5-flash",
                messages=formatted_messages,
                tools=self.tools,
                tool_choice="auto"  
            )

            response_message = response.choices[0].message
            tool_calls = response_message.tool_calls

            if tool_calls:
                # Execute the tools
                from ..tools.tools import add_task, list_tasks, delete_task, complete_task

                for tool_call in tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)

                    # Add user_id to function args if not present
                    if "user_id" not in function_args:
                        function_args["user_id"] = user_id

                    if function_name == "add_task":
                        result = add_task(session, **function_args)
                        # Format due date for display
                        due_date_str = result.due_date.strftime('%Y-%m-%d %H:%M') if result.due_date else 'Not set'
                        description_str = result.description if result.description else 'Not provided'
                        category_str = result.category if result.category else 'None'
                        return f"Task '{result.title}' added! Category: {category_str} | Due: {due_date_str} | Desc: {description_str}"
                    elif function_name == "list_tasks":
                        tasks = list_tasks(session, **function_args)
                        if tasks:
                            task_list = []
                            for task in tasks:
                                # Format due date for display
                                due_date_str = task.due_date.strftime('%Y-%m-%d %H:%M') if task.due_date else 'Not set'
                                description_str = task.description if task.description else 'Not provided'
                                task_info = f"- ID: {task.id} | Title: {task.title} | Status: {'completed' if task.completed else 'pending'} | Due: {due_date_str} | Desc: {description_str}"
                                task_list.append(task_info)
                            return f"Your tasks:\n" + "\n".join(task_list)
                        else:
                            return "You have no tasks."
                    elif function_name == "delete_task":
                        success = delete_task(session, **function_args)
                        if success:
                            return "Task deleted successfully."
                        else:
                            return "Could not delete the task. It may not exist or you may not have permission."
                    elif function_name == "complete_task":
                        result = complete_task(session, **function_args)
                        return result

            # Handle case where there's no tool call but we need to return content
            if response_message and hasattr(response_message, 'content') and response_message.content:
                return response_message.content
            else:
                return "I processed your request but don't have a specific response."

        except Exception as e:
            print(f"Error in AI agent processing: {e}")
            return f"Sorry, I encountered an error processing your request: {str(e)}. Please check that your API key is valid and that the service is accessible."