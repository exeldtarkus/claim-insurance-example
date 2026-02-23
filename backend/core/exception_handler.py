import traceback
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

from core.error_response import ErrorResponse
from core.config import settings


def http_exception_handler(request: Request, exc: HTTPException):
    payload = {
        "message": exc.detail,
        "statusCode": exc.status_code,
    }

    if settings.ENV == "development":
        payload["trace"] = traceback.format_exc()

    return JSONResponse(
        status_code=exc.status_code,
        content=payload
    )


def unhandled_exception_handler(request: Request, exc: Exception):
    payload = {
        "message": "Internal server error",
        "statusCode": 500,
    }

    if settings.ENV == "development":
        payload["trace"] = traceback.format_exc()

    return JSONResponse(
        status_code=500,
        content=payload
    )
