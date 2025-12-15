"use client";
import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { createClient } from "@prismicio/client";
import Image from "next/image";
import {
  WeatherData,
  SearchBarSliceData,
  PrismicSlice,
  GeocodingResult,
} from "@/types/weather";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";

interface Props {
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function WeatherLeftSection({ weatherData, loading }: Props) {
  const [searchBar, setSearchBar] = useState<SearchBarSliceData | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [city, setCity] = useState<string>("");
  const router = useRouter();

  const searchRelatedCities = async (value: string): Promise<void> => {
    setCity(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res: AxiosResponse<GeocodingResult[]> = await axios.get(
        `/api/weather/search?query=${value}`
      );
      setSuggestions(res.data || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSearch = async (): Promise<void> => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    try {
      setSearchLoading(true);

      const res = await axios.get(`/api/weather/city?city=${city}`);
      if (res.data.error) {
        alert("City not found!");
      } else {
        router.push(`/WeatherCity?city=${encodeURIComponent(city)}`);
      }
    } catch (err) {
      alert("Error fetching weather data");
    } finally {
      setSearchLoading(false);
    }
  };

  const weatherImages: { [key: string]: { bg: string; icon: string } } = {
    clear: {
      bg: "/asset/clear_day.png",
      icon: "/asset/clear_day_icon.png",
    },
    clouds: {
      bg: "/asset/cloudy_day.png",
      icon: "/asset/cloudy_icon.png",
    },
    rain: {
      bg: "/asset/rain_day.png",
      icon: "/asset/rain_day_icon.png",
    },
    haze: {
      bg: "/asset/haze_day.png",
      icon: "/asset/haze_day_icon.png",
    },
    storm: {
      bg: "/asset/haze_day.png",
      icon: "/asset/haze_day_icon.png",
    },
    smoke: {
      bg: "/asset/haze_day.png",
      icon: "/asset/haze_day_icon.png",
    },
  };

  const condition = weatherData?.today_condition?.toLowerCase() || "clear";
  const { bg, icon } = weatherImages[condition] || weatherImages["clear"];

  useEffect(() => {
    const fetchPrismicContent = async () => {
      try {
        const client = createClient("weather-app-nextjs");
        const weatherDetail = await client.getSingle("weather_detail_page");
        const slices = weatherDetail.data.slices;

        const searchBarSlice = slices.find(
          (s: PrismicSlice) => s.slice_type === "search_bar"
        ) as SearchBarSliceData | undefined;
        setSearchBar(searchBarSlice || null);
      } catch (err) {
        alert(err);
      }
    };

    fetchPrismicContent();
  }, []);

  return (
    <div className="flex flex-col gap-2 md:gap-4 flex-1">
      {/* Search Input - Highest z-index */}
      <div className="relative z-30 flex items-center gap-3">
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer w-14 h-14 bg-[#1E1E29] rounded-lg flex items-center justify-center"
        >
          {searchBar?.primary?.icon?.url && (
            <img
              src={searchBar.primary.icon.url}
              alt={searchBar.primary.icon.alt || "icon"}
              className="w-7 h-7 object-contain"
            />
          )}
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder={searchBar?.primary?.placeholder}
            className="w-full h-14 rounded-lg bg-[#1E1E29] px-5 pr-12 text-white placeholder-white/50 outline-none"
            value={city}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              searchRelatedCities(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          {searchLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Container for Gradient Box and Suggestions */}
      <div className="relative">
        {/* Gradient Box - Background layer (z-10) */}
        <div
          className="relative z-10 rounded-xl h-[408px] md:h-[560px] p-8 flex flex-col bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="flex justify-between items-center">
            <h1 className="font-nunito font-bold text-xl text-[#FAFAFA]">
              {weatherData?.city}, {weatherData?.country}
            </h1>
            <p className="font-nunito font-bold text-xl text-[#FAFAFA]">
              {weatherData?.time}
            </p>
          </div>

          <p className="font-nunito text-[12px] mt-[2px] md:mt-[8px] text-[#FAFAFA] md:text-[16px]">
            {weatherData?.day}, {weatherData?.month} {weatherData?.date},{" "}
            {weatherData?.year}
          </p>

          {/* Bottom-left temperature */}
          <p className="absolute bottom-18 md:bottom-11 left-8 text-white font-nunito font-extrabold text-[48px] leading-[48px] md:text-[96px] md:leading-[96px] m-0">
            {weatherData?.feels_like
              ? Math.round(weatherData.feels_like)
              : "--"}
            ºC
          </p>

          <div className="absolute bottom-4 left-8 text-white font-nunito font-bold text-[16px] md:text-[20px] leading-[20px] flex flex-col md:flex-row lg:flex-row gap-1">
            {/* Max / Min (Bold) */}
            <span className="font-bold">
              {" "}
              {weatherData?.temp_max
                ? Math.round(weatherData.temp_max)
                : "--"}{" "}
              /{" "}
              {weatherData?.temp_min ? Math.round(weatherData.temp_min) : "--"}
              ºC{" "}
            </span>
            <span className="px-3 hidden md:inline">-</span>
            {/* Status Text (Regular) */}
            <span className="font-nunito font-weight-400 text-[14px] md:text-[20px] lg:ml-2">
              {weatherData?.today_condition}
            </span>
          </div>

          {/* Bottom-right image */}
          <div className="absolute bottom-0 right-0 w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
            <Image src={icon} alt="weather" fill className="object-contain" />
          </div>
        </div>

        {/* Suggestions Dropdown - Overlay layer (z-20) */}
        {suggestions.length > 0 && (
          <div className="absolute top-0 left-[68px] right-0 z-20 ">
            {suggestions.map((item: GeocodingResult, index: number) => (
              <div
                key={index}
                className="
                  h-[54px]
                  px-[20px]
                  border border-black
                  hover:border-[#86548dff]
                  flex items-center
                  cursor-pointer
                  bg-[#3B3B54]
                  "
                onClick={async () => {
                  const selected = `${item.name}, ${item.country}`;
                  setCity(selected);
                  setSuggestions([]);

                  setTimeout(() => {
                    handleSearch();
                  }, 100);
                }}
              >
                <span className="font-nunito text-[#FAFAFA] text-[16px]">
                  {item.name},
                </span>

                {item.state && (
                  <span className="font-nunito ml-1 text-[#FAFAFA] text-[16px]">
                    ({item.state})
                  </span>
                )}

                <span className="font-nunito ml-1 text-[#FAFAFA] text-[16px]">
                  - {item.country}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
