from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
import logging

logger = logging.getLogger(__name__)

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        
        # Simple logging for telemetry. In a real app, you might save to DB or external service like Datadog
        logger.info(
            f"API Call: {request.method} {request.url.path} "
            f"Status: {response.status_code} "
            f"Duration: {process_time:.4f}s"
        )
        
        response.headers["X-Process-Time"] = str(process_time)
        return response
