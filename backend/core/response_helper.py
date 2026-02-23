from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder # <--- Import ini adalah kunci

def success_response(
    data=None,
    message: str = "Success",
    status_code: int = status.HTTP_200_OK,
):
    """
    Mengirimkan response sukses yang sudah di-serialize otomatis
    menggunakan jsonable_encoder bawaan FastAPI.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            # jsonable_encoder akan menangani ORM, Pydantic, list, dll secara mendalam (deeply)
            "data": jsonable_encoder(data),
            "message": message,
            "statusCode": status_code,
        },
    )