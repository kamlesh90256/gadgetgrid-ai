from fastapi import APIRouter, UploadFile, File
import os
import shutil
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

UPLOAD_FOLDER = "images"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"

    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "image_url": f"/images/{filename}"
    }