from fastapi import FastAPI, Body
from dapr.ext.fastapi import DaprApp
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
dapr_app = DaprApp(app)

# --- 1. Kafka Subscriber (Email Notification) ---
@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
def task_subscriber(event_data: dict = Body(...)):
    """
    Consumer for Task Events (Kafka).
    Simulates sending emails.
    """
    # Safely extract data
    data = event_data.get('data', {})

    # Handle stringified JSON if necessary (double serialization fix)
    if isinstance(data, str):
        import json
        try:
            data = json.loads(data)
        except:
            pass

    event_type = data.get('event_type', 'unknown')
    task_title = data.get('task_title', 'No Title')
    user_id = data.get('user_id', 'Unknown User')

    if event_type == 'created':
        logger.info(f"📧 RECEIVED EVENT: {event_type} for task '{task_title}'")
        logger.info(f"📧 SIMULATION: Sending email to User {user_id} regarding task '{task_title}'")
    else:
        logger.info(f"ℹ️ EVENT RECEIVED: {event_type}")

    return {"status": "success"}

# --- 2. Cron Job Handler (Recurring Tasks) ---
@app.post("/reminder-cron")
def cron_handler():
    """
    Triggered by Dapr Binding (Cron)
    """
    logger.info("⏰ CRON TRIGGER: Checking for recurring tasks and reminders...")
    return {"status": "success"}

# --- 3. OPTIONS Handler (Fix for 404s) ---
@app.options("/reminder-cron")
def cron_options():
    """
    Satisfy Dapr's pre-flight check
    """
    return {"status": "ok"}