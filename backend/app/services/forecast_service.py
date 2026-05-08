from prophet import Prophet
import pandas as pd
from app.core.config import supabase
from fastapi import HTTPException
from typing import List, Tuple
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib
import io

matplotlib.use("Agg")


def fetch_parking_data(facility_id: str, from_date: str, direction: str = "gte") -> pd.DataFrame:
    query = supabase.table("parking_event_aggressor").select("*").eq("facilityid", facility_id)
    
    if direction == "gte":
        query = query.gte("timestamp", from_date)
    else:
        query = query.lte("timestamp", from_date)
        
    response = query.order("timestamp", desc=False).execute()
    data = response.data
    if not data:
        raise HTTPException(status_code=404, detail=f"No data found for facility ID {facility_id}.")

    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.rename(columns={"timestamp": "ds", "counterfreeplaces": "y"})
    return df


def forecast_24h(df: pd.DataFrame) -> pd.DataFrame:
    model = Prophet()
    model.fit(df)
    future = model.make_future_dataframe(periods=24, freq='H')
    forecast = model.predict(future)
    return forecast


def get_forecast_data(df: pd.DataFrame, forecast: pd.DataFrame) -> Tuple[int, List[dict]]:
    forecast_future = forecast[forecast['ds'] > df['ds'].max()]
    latest_y = int(df.iloc[-1]['y'])

    forecast_list = [
        {
            "datetime": row['ds'].strftime("%Y-%m-%d %H:%M:%S"),
            "predicted_available_spots": int(round(row['yhat']))
        }
        for _, row in forecast_future.iterrows()
    ]

    return latest_y, forecast_list


def plot_forecast(forecast: pd.DataFrame, start_date: datetime) -> io.BytesIO:
    filtered = forecast[forecast['ds'] > start_date]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(filtered['ds'], filtered['yhat'], label='Forecasted Availability')
    ax.fill_between(filtered['ds'], filtered['yhat_lower'], filtered['yhat_upper'], alpha=0.3, color='skyblue')
    ax.set_xlabel("Date")
    ax.set_ylabel("Predicted Available Spots")
    ax.set_title("Parking Availability Forecast")
    ax.legend()
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d %H:%M'))
    fig.autofmt_xdate()
    plt.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return buf
