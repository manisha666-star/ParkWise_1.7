# app/auth/routes.py

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from supabase import create_client, Client
from app.core.config import supabase
from gotrue.errors import AuthApiError 
from fastapi.security import HTTPBearer
from fastapi import Security

router = APIRouter()
bearer_scheme = HTTPBearer()

# ---------------- Models ----------------

class SignupRequest(BaseModel):
    email: str
    password: str
    subscription: str  # 'free' or 'premium'

class LoginRequest(BaseModel):
    email: str
    password: str

# ---------------- Helpers ----------------

def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    token = token.replace("Bearer ", "")
    try:
        user = supabase.auth.get_user(token).user
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------------- Routes ----------------




@router.post("/signup")
def signup(data: SignupRequest):
    try:
        auth_res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })

        if auth_res is None or auth_res.user is None:
           raise HTTPException(status_code=400, detail="Signup failed")

        # optional: print the whole response for debugging
        print(" Supabase signup response:", auth_res)
        supabase.table("users").upsert({
            "id": auth_res.user.id,
            "email": data.email,
            "subscription": data.subscription
        }, on_conflict="email").execute()

        return {"message": "Signup successful."}
    except Exception as e:
        print(" Signup error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(data: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password(
            {"email": data.email, "password": data.password}
        )
        # If we get here, the call succeeded; any bad‑password case would
        # already have raised AuthApiError
        if res.user is None or res.session is None:
            # Extremely defensive – shouldn't normally happen
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Fetch subscription from users table
        profile = supabase.table("users").select("subscription").eq("email", data.email).execute()
        subscription = "free"  # default
        if profile.data and profile.data[0]:
            subscription = profile.data[0]["subscription"]

        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "user_email": res.user.email,
            "subscription": subscription
        }

    except AuthApiError as e:                    # bad password, unknown user, etc.
        # Supabase gives a clean message (e.g. "Invalid login credentials")
        raise HTTPException(status_code=401, detail=e.message)

    except Exception as e:                       # network issues, etc.
        print(" Login error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/profile", tags=["default"])
def get_profile(
    user=Depends(get_current_user),
    token=Security(bearer_scheme)  #  Enables Swagger auth button
):
    profile = supabase.table("users").select("*").eq("id", user.id).execute()
    if profile.data:
        return profile.data[0]
    raise HTTPException(status_code=404, detail="User profile not found")

@router.get("/premium-feature")
def premium_feature(user = Depends(get_current_user)):
    profile = supabase.table("users").select("subscription").eq("email", user.email).execute()
    if profile.data and profile.data[0]["subscription"] != "premium":
        raise HTTPException(status_code=403, detail="Upgrade to premium to access this feature.")
    return {"message": "Welcome, premium user!"}

@router.post("/upgrade-subscription")
def upgrade_subscription(user=Depends(get_current_user)):
    try:
        # Update the user's subscription to 'premium' in the users table
        update_res = supabase.table("users").update({"subscription": "premium"}).eq("id", user.id).execute()
        if update_res.data:
            return {"message": "Subscription upgraded to premium."}
        else:
            raise HTTPException(status_code=400, detail="Failed to upgrade subscription.")
    except Exception as e:
        print(" Upgrade subscription error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
