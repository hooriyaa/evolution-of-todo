from datetime import datetime
from typing import Optional

def convert_to_utc(dt: Optional[datetime], source_timezone: str = 'UTC') -> Optional[datetime]:
    """
    Convert a datetime from a source timezone to UTC.
    Default source timezone is UTC (no conversion needed).
    """
    if dt is None:
        return None

    # Try to import pytz for proper timezone handling
    try:
        import pytz
        # If datetime is naive (no timezone info), assume it's in the source timezone
        if dt.tzinfo is None:
            local_tz = pytz.timezone(source_timezone)
            dt = local_tz.localize(dt)

        # Convert to UTC
        utc_dt = dt.astimezone(pytz.UTC)
        return utc_dt
    except ImportError:
        # If pytz is not available, return the datetime as-is
        return dt

def convert_from_utc(dt: Optional[datetime], target_timezone: str = 'UTC') -> Optional[datetime]:
    """
    Convert a datetime from UTC to a target timezone.
    Default target timezone is UTC (no conversion needed).
    """
    if dt is None:
        return None

    # Try to import pytz for proper timezone handling
    try:
        import pytz
        # If datetime is naive, assume it's in UTC
        if dt.tzinfo is None:
            dt = pytz.UTC.localize(dt)

        # Convert to target timezone
        target_tz = pytz.timezone(target_timezone)
        localized_dt = dt.astimezone(target_tz)
        return localized_dt
    except ImportError:
        # If pytz is not available, return the datetime as-is
        return dt