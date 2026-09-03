import logging
import sys

def setup_logging():
    # Setup structured JSON logging for enterprise observability
    # For a real enterprise app, we'd use 'python-json-logger' or 'loguru'.
    # Here we set up a robust formatter for stdout.
    logger = logging.getLogger("app")
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    
    # Format includes timestamp, level, module, and message
    formatter = logging.Formatter(
        '{"time": "%(asctime)s", "level": "%(levelname)s", "module": "%(module)s", "message": "%(message)s"}'
    )
    handler.setFormatter(formatter)
    
    # Prevent adding multiple handlers if setup is called multiple times
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
