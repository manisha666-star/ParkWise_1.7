from app.services import forecast_service
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()


class ForecastItem(BaseModel):
    datetime: str
    predicted_available_spots: int


class FacilityForecastResponse(BaseModel):
    facility_id: str
    current_available_spots: int
    forecast_next_24h: List[ForecastItem]


@router.get("/forecast", response_model=FacilityForecastResponse)
def get_forecast(facility_id: str, start_date: str):
    df = forecast_service.fetch_parking_data(facility_id, start_date, direction="gte")
    forecast = forecast_service.forecast_24h(df)
    current, future_list = forecast_service.get_forecast_data(df, forecast)
    return FacilityForecastResponse(
        facility_id=facility_id,
        current_available_spots=current,
        forecast_next_24h=future_list
    )


@router.get("/forecast-parking")
def get_forecast_plot(facilityid: str, start_date: str):
    try:
        start_dt = datetime.fromisoformat(start_date)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format.")

    df = forecast_service.fetch_parking_data(facilityid, start_date, direction="lte")
    forecast = forecast_service.forecast_24h(df)
    buf = forecast_service.plot_forecast(forecast, start_dt)
    return StreamingResponse(buf, media_type="image/png")
