

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import WeatherLeftSection from "@/components/WeatherLeftSection";
import WeatherRightSection from "@/components/WeatherRightSection";
import { WeatherData } from "@/types/weather";

// 🌀 Full-screen circular loader
function Loader() {
  return (
    <div className="min-h-screen bg-[#0E0E13] flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}

function WeatherCityContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // show loader initially

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await axios.get<WeatherData>(
          `/api/weather/city?city=${encodeURIComponent(city)}`
        );
        if ((res.data as any).error) {
          console.log("res.data.error", (res.data as any).error);
          alert("City not found!");
        } else {
          setData(res.data);
          console.log("Weather data:", res.data);
        }
      } catch (err) {
        console.error("API error:", err);
        alert("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Show circular loader while data is being fetched
  if (loading) {
    return <Loader />;
  }

  // Show main weather page after data is loaded
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white p-3 md:p-5 flex justify-center">
      <div className="w-full max-w-[1500px] flex flex-col lg:flex-row gap-2 md:gap-4">
        {/* LEFT SECTION */}
        <WeatherLeftSection weatherData={data} loading={loading} />

        {/* RIGHT SECTION */}
        <WeatherRightSection weatherData={data} loading={loading} />
      </div>
    </div>
  );
}

export default function WeatherCityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E0E13] flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
        </div>
      }
    >
      <WeatherCityContent />
    </Suspense>
  );
}
