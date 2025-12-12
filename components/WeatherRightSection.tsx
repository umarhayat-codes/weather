"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@prismicio/client";
import {
  WeatherData,
  WeatherDetailListSliceData,
  PrismicForecastIcons,
  PrismicSlice,
  WeatherForecastSliceData,
  PrismicWeatherItem,
} from "@/types/weather";

interface Props {
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function WeatherRightSection({ weatherData, loading }: Props) {
  const [detailListSlicePrismic, setDetailListSlicePrismic] =
    useState<WeatherDetailListSliceData | null>(null);
  const [forecastIcons, setForecastIcons] = useState<PrismicForecastIcons>([]);
  const [forecastSectionTitle, setForecastSectionTitle] = useState<string>("");

  useEffect(() => {
    const fetchPrismicContent = async () => {
      try {
        const client = createClient("weather-app-nextjs");
        const weatherDetail = await client.getSingle("weather_detail_page");
        const slices = weatherDetail.data.slices;

        // Weather Detail List slice
        const detailList = slices.find(
          (s: PrismicSlice) => s.slice_type === "weather_detail_list"
        ) as WeatherDetailListSliceData | undefined;
        setDetailListSlicePrismic(detailList || null);

        // Weather Forecast slice (for bottom cards icons)
        const forecast = slices.find(
          (s: PrismicSlice) => s.slice_type === "weather_forecast"
        ) as WeatherForecastSliceData | undefined;
        if (forecast) {
          const primary = forecast.primary;
          const forecastItems: PrismicForecastIcons = [
            primary?.rainy_weather, // Rain
            primary?.cloud_icon, // Clouds
            primary?.sunny_icon, // Clear / Sun
            primary?.sun_cloud_icon, // Partly cloudy
            primary?.cloud_storm_icon, // Thunderstorm / Storm
          ];
          setForecastIcons(forecastItems);
          setForecastSectionTitle(primary?.section_title || "");
        }
      } catch (err) {
        alert(err);
      }
    };

    fetchPrismicContent();
  }, []);

  const getPrismicIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return forecastIcons[2]?.url; // sunny_icon
      case "Clouds":
        return forecastIcons[1]?.url; // cloud_icon
      case "Rain":
        return forecastIcons[0]?.url; // rainy_weather
      case "Thunderstorm":
        return forecastIcons[4]?.url; // cloud_storm_icon
      case "Snow":
        return forecastIcons[2]?.url; // sunny_icon as fallback
      case "Partly Cloudy":
        return forecastIcons[3]?.url; // sun_cloud_icon
      default:
        return forecastIcons[1]?.url; // default to cloud_icon
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2 md:gap-4 lg:mt-0 ">
      {/* Top Box - Weather Rows (Prismic) */}
      <div className="bg-[#1E1E29] rounded-xl pt-4 pb-4 px-4 md:p-6 h-[350px] xlg:max-h-[calc(50vh-48px)] xlg:overflow-hidden">
        <p className="text-[#7F7F98] text-sm mb-4 hidden sm:block">
          {detailListSlicePrismic?.primary.section_title}
        </p>

        <div className="flex flex-col gap-3 xlg:gap-2">
          {detailListSlicePrismic?.primary?.weather_items?.map(
            (item: PrismicWeatherItem, idx: number) => {
              // Map API values based on label
              let value = "";
              switch (item.label) {
                case "Feels Like":
                  value = weatherData
                    ? `${Math.round(weatherData.feels_like)}°C`
                    : "—";
                  break;
                case "Probability of Rain":
                  value = weatherData
                    ? `${weatherData.rain_probability}%`
                    : "—";
                  break;
                case "Wind Speed":
                  value = weatherData ? `${weatherData.wind_speed} km/h` : "—";
                  break;
                case "Air Humidity":
                  value = weatherData ? `${weatherData.humidity}%` : "—";
                  break;
                case "UV Index":
                  value = weatherData ? `${weatherData.uv_index}` : "—";
                  break;
                default:
                  value = "—";
              }

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center pt-4 h-[56px] sm:h-[48px] pb-4 md:h-[48px] xlg:h-[12] border-b border-[#2A2A33]"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.icon.url}
                      alt={item.icon.alt || item.label}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                  <div className="text-white font-medium text-sm">{value}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Bottom Cards Box - Forecast */}
      <div className="bg-[#1E1E29] rounded-xl p-3 sm:p-6 xlg:h-[240px] overflow-hidden">
        {/* Title — hidden on small screens */}
        <p className="text-[#7F7F98] text-sm mb-4 hidden sm:block">
          {forecastSectionTitle}
        </p>

        <div className="flex justify-between gap-4">
          {weatherData &&
            Object.entries(weatherData.next_days_temperature).map(
              ([date, info], idx) => {
                const condition = info.conditions[0];

                return (
                  <div
                    key={idx}
                    className="flex-1 h-48 xlg:h-32 rounded-xl flex flex-col items-center pt-5"
                  >
                    <p className="font-nunito font-bold text-[14px] text-white text-center">
                      {/* Small screens → show first 3 letters */}
                      <span className="block sm:hidden">
                        {info.day.slice(0, 3)}
                      </span>

                      {/* Medium and above → show full day */}
                      <span className="hidden sm:block">{info.day}</span>
                    </p>

                    {/* Weather Icon */}
                    <div className="pt-4">
                      <img
                        src={getPrismicIcon(condition)}
                        alt={condition}
                        className="w-20 h-20 object-contain"
                      />
                    </div>

                    {/* Condition */}
                    <p className="font-nunito font-light text-[14px] text-white pt-[10px]">
                      {condition}
                    </p>

                    {/* Max & Min Temperature */}
                    <div className="flex flex-col sm:flex-row gap-2 items-center pt-[4px]">
                      <p className="font-nunito font-bold text-[14px] text-white">
                        {Math.round(info.max)}°C
                      </p>

                      <p className="font-nunito text-[14px] text-white">
                        {Math.round(info.min)}°C
                      </p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
}
