from dapr.clients import DaprClient
import json


def publish_event(event_data: dict):
    """
    Publish an event to the task-events topic via Dapr.
    
    Args:
        event_data (dict): The event data to publish
    """
    with DaprClient() as client:
        try:
            # Publish to the kafka-pubsub component on the task-events topic
            client.publish_event(
                pubsub_name='kafka-pubsub',
                topic_name='task-events',
                data=json.dumps(event_data),
                data_content_type='application/json'
            )
        except Exception as e:
            # Log the error but don't raise it to ensure API requests still succeed
            print(f"Dapr event publishing failed: {str(e)}")
            # In a production environment, you might want to use a proper logger
            # logger.error(f"Dapr event publishing failed: {str(e)}")