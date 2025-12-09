import { NextResponse } from "next/server";
import axios from "axios";
import { NextRequest } from "next/server";
import { NextDaysTemperature } from "@/types/weather";

// Helper → most frequent weather
function getDominantWeather(arr: string[]): string {
  const freq: Record<string, number> = {};
  arr.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  
  let max = 0;
  let dominant = arr[0];
  
  for (const key in freq) {
    if (freq[key] > max) {
      max = freq[key];
      dominant = key;
    }
  }
  return dominant;
}

export async function GET(req: NextRequest) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (!city)
      return NextResponse.json({ error: "City is required" }, { status: 400 });

    // Step 1 → Geocoding
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (!geoRes.data.length)
      return NextResponse.json({ error: "City not found" });

    const { lat, lon, name, country } = geoRes.data[0];

    // Step 2 → Current weather
    const currentRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params: { lat, lon, units: "metric", appid: API_KEY } }
    );
    const current = currentRes.data;

    // Step 3 → Forecast 3-hourly
    const forecastRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      { params: { lat, lon, units: "metric", appid: API_KEY } }
    );
    const forecast = forecastRes.data;

    // Step 4 → UV Index
    let uv_index: number | string = "N/A";
    try {
      const uvRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/uvi",
        { params: { lat, lon, appid: API_KEY } }
      );
      uv_index = uvRes.data.value;
    } catch {
      uv_index = "N/A";
    }

    // Extract current day/time
    const now = new Date(current.dt * 1000);
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const timeNow = now.toLocaleTimeString("en-US", { hour12: false });

   


    // Step 5 → Format next 5 days (exclude today)
const todayDateStr = now.toISOString().split("T")[0]; // e.g., "2025-11-19"
const allDates: NextDaysTemperature = {};

// Collect all dates from forecast
forecast.list.forEach((item: any) => {
  const dateTxt = item.dt_txt.split(" ")[0];
  if (dateTxt === todayDateStr) return; // skip today

  const day = new Date(dateTxt).toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (!allDates[dateTxt]) {
    allDates[dateTxt] = {
      day,
      min: item.main.temp_min,
      max: item.main.temp_max,
      conditions: [item.weather[0].main],
    };
  } else {
    allDates[dateTxt].min = Math.min(allDates[dateTxt].min, item.main.temp_min);
    allDates[dateTxt].max = Math.max(allDates[dateTxt].max, item.main.temp_max);
    allDates[dateTxt].conditions.push(item.weather[0].main);
  }
});



const nowDateObj = new Date(current.dt * 1000);

const month = nowDateObj.toLocaleString("en-US", { month: "long" });
const date = nowDateObj.getDate();
const year = nowDateObj.getFullYear();


// Only take next 5 days
const nextDays: NextDaysTemperature = Object.fromEntries(Object.entries(allDates).slice(0, 5));

const today_condition =
  current.weather?.[0]?.main;


    return NextResponse.json({
      city: name,
      country,
      day: dayName,
      time: timeNow,
      month,
      date,
      year,
      feels_like: current.main.feels_like,
      humidity: current.main.humidity,
      wind_speed: current.wind.speed,
      rain_probability: current.rain?.["1h"] || 0,
      temp_min: current.main.temp_min,
      temp_max: current.main.temp_max,
      today_condition,
      uv_index,
      next_days_temperature: nextDays,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
