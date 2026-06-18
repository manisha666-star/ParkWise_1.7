from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.config import supabase

router = APIRouter(tags=["Contact"])

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("/contact")
async def create_contact(data: ContactMessage):

    if len(data.name.strip()) < 2:
        return {
            "success": False,
            "message": "Invalid name"
        }

    if len(data.subject.strip()) < 3:
        return {
            "success": False,
            "message": "Invalid subject"
        }

    if len(data.message.strip()) < 10:
        return {
            "success": False,
            "message": "Message too short"
        }

    try:
        supabase.table("contact_messages").insert({
            "name": data.name,
            "email": data.email,
            "subject": data.subject,
            "message": data.message
        }).execute()

        return {
            "success": True,
            "message": "Message saved successfully"
        }

    except Exception as e:
        print("CONTACT ERROR:", e)

        return {
            "success": False,
            "message": str(e)
        }