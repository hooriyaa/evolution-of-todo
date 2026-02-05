from datetime import datetime, timedelta, timezone
from typing import Optional

def convert_to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Convert a datetime from Pakistan Standard Time (PST = UTC+5) to UTC.
    When the frontend sends a time, it's in local time (PST), so we need to convert it to UTC for storage.
    """
    if dt is None:
        return None

    # If datetime is naive (no timezone info), assume it's in Pakistan Standard Time (PST = UTC+5)
    if dt.tzinfo is None:
        # Convert Pakistan Standard Time (PST = UTC+5) to UTC by subtracting 5 hours
        utc_time = dt - timedelta(hours=5)
        return utc_time.replace(tzinfo=timezone.utc)
    else:
        # If it already has timezone info, convert to UTC
        return dt.astimezone(timezone.utc)

def convert_from_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Convert a datetime from UTC to Pakistan Standard Time (PST = UTC+5).
    This is for display purposes when sending data back to the frontend.
    """
    if dt is None:
        return None

    # If datetime is naive, assume it's in UTC
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    # Convert from UTC to Pakistan Standard Time (PST = UTC+5) by adding 5 hours
    pakistan_time = dt + timedelta(hours=5)
    return pakistan_time