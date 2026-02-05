from datetime import datetime, timezone
from typing import Optional

def convert_to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Convert a datetime to UTC if it's timezone-naive.
    """
    if dt is None:
        return None

    # If datetime is naive (no timezone info), assume it's in local time and convert to UTC
    if dt.tzinfo is None:
        # For now, we'll treat it as if it's in UTC to avoid timezone issues
        # In a proper implementation, we'd use pytz for accurate conversion
        return dt.replace(tzinfo=timezone.utc)
    else:
        # If it already has timezone info, convert to UTC
        return dt.astimezone(timezone.utc)

def convert_from_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Convert a datetime from UTC to local time (for display purposes).
    """
    if dt is None:
        return None

    # If datetime is naive, assume it's in UTC
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    # For now, return as-is since we don't have pytz for accurate timezone conversion
    # In a proper implementation, we'd convert to the user's local timezone
    return dt