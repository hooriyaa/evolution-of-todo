from datetime import datetime, timezone
from typing import Optional

def convert_to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Simply add timezone info to a naive datetime without changing the time value.
    This prevents any time shifting during storage.
    """
    if dt is None:
        return None

    # If datetime is naive (no timezone info), just add UTC timezone info without changing the time
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    else:
        # If it already has timezone info, convert to UTC
        return dt.astimezone(timezone.utc)

def convert_from_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Return the datetime as-is, assuming it's already in the correct timezone.
    """
    if dt is None:
        return None

    # Just return the datetime as-is
    return dt