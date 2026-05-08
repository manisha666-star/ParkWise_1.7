from fastapi import FastAPI
from app.api import nearby_parking, list_available_parking_spots, fastapi_facility_ID, insert_monitor_job
from app.auth.routes import signup, login, get_profile, premium_feature,upgrade_subscription  # import functions
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from fastapi_utils.tasks import repeat_every
from app.api.cron_send_email import cron_send_email
from app.api.cron_cleanup import delete_inactive_jobs
from fastapi.middleware.cors import CORSMiddleware

bearer_scheme = HTTPBearer()

app = FastAPI(
    title="ParkWise API",
    version="1.0.0",
    openapi_tags=[{"name": "default", "description": "All API endpoints"}]
    )

# Serve files in /static at /static route
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount API route groups
app.include_router(nearby_parking.router)
app.include_router(list_available_parking_spots.router)
app.include_router(fastapi_facility_ID.router)
app.include_router(insert_monitor_job.router)

# Explicit auth routes
app.add_api_route("/signup", signup, methods=["POST"])
app.add_api_route("/login", login, methods=["POST"])
app.add_api_route("/profile", get_profile, methods=["GET"])
app.add_api_route("/premium-feature", premium_feature, methods=["GET"])
app.add_api_route("/upgrade-subscription", upgrade_subscription, methods=["POST"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to ParkWise API "}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="ParkWise API ",
        version="1.0.0",
        description="Smart Parking + Auth API",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.on_event("startup")
@repeat_every(seconds=3600)  # every 5 minutes
def run_monitor_job():
    
    cron_send_email()
    

@app.on_event("startup")
@repeat_every(seconds=3600)  # Every 1 hour
def schedule_cleanup_task():
    delete_inactive_jobs()

