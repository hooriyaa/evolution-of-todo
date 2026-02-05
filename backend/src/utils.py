from datetime import datetime
import pytz
from typing import Optional

def convert_to_utc(dt: Optional[datetime], source_timezone: str = 'Asia/Karachi') -> Optional[datetime]:
    """
    Convert a datetime from a source timezone to UTC.
    Default source timezone is Asia/Karachi (Pakistan Standard Time).
    """
    if dt is None:
        return None
    
    # If datetime is naive (no timezone info), assume it's in the source timezone
    if dt.tzinfo is None:
        local_tz = pytz.timezone(source_timezone)
        dt = local_tz.localize(dt)
    
    # Convert to UTC
    utc_dt = dt.astimezone(pytz.UTC)
    return utc_dt

def convert_from_utc(dt: Optional[datetime], target_timezone: str = 'Asia/Karachi') -> Optional[datetime]:
    """
    Convert a datetime from UTC to a target timezone.
    Default target timezone is Asia/Karachi (Pakistan Standard Time).
    """
    if dt is None:
        return None
    
    # If datetime is naive, assume it's in UTC
    if dt.tzinfo is None:
        dt = pytz.UTC.localize(dt)
    
    # Convert to target timezone
    target_tz = pytz.timezone(target_timezone)
    localized_dt = dt.astimezone(target_tz)
    return localized_dt