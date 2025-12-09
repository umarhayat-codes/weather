"use client"
import React, { useEffect, useState } from "react";
import { createClient } from "@prismicio/client";
import Image from 'next/image';
import { WeatherData } from "@/types/weather";

interface Props {
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function WeatherLeftSection({ weatherData, loading }: Props) {
  const [searchBar, setSearchBar] = useState<any>(null);


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
        
        const searchBarSlice = slices.find((s: any) => s.slice_type === "search_bar");
        setSearchBar(searchBarSlice);
      } catch (err) {
        console.log("Error fetching Prismic content:", err);
      }
    };

    fetchPrismicContent();
  }, []);

  return (

    <div className="flex flex-col gap-2 md:gap-4 flex-1">
      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-[#1E1E29] rounded-lg flex items-center justify-center">
          {searchBar?.primary?.icon?.url && (
            <img 
              src={searchBar.primary.icon.url}
              alt={searchBar.primary.icon.alt || "icon"}
              className="w-7 h-7 object-contain"
            />
          )}
        </div>

        <input
          type="text"
          placeholder={searchBar?.primary?.placeholder}
          className="flex-1 h-14 rounded-lg bg-[#1E1E29] px-5 text-white placeholder-white/50 outline-none"
        />
      </div>
      {/* Gradient Box */}
      <div className="relative  rounded-xl h-[408px] md:h-[550px] p-8 flex flex-col bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }}>
        <div className="flex justify-between items-center">
          <h1 className="font-nunito font-bold text-xl">
            {weatherData?.city}, {weatherData?.country}
          </h1>
          <p className="text-white font-bold text-xl">{weatherData?.time}</p>
        </div>

        <p className="font-nunito text-[12px] mt-[2px] md:mt-[8px] text-[#FAFAFA] md:text-[16px]">{weatherData?.day}, { weatherData?.month} { weatherData?.date}, { weatherData?.year}</p>

        {/* Bottom-left temperature */}
        <p className="absolute bottom-18 md:bottom-11 left-8 text-white font-nunito font-extrabold text-[48px] leading-[48px] md:text-[96px] md:leading-[96px] m-0">
          
          {weatherData?.feels_like ? Math.round(weatherData.feels_like) : '--'}ºC
        </p>

        <div className="absolute bottom-4 left-8 text-white font-nunito text-[16px] md:text-[20px] leading-[20px] flex flex-col md:flex-row lg:flex-row gap-1">
          {/* Max / Min (Bold) */}
          <span className="font-bold"> {weatherData?.temp_max ? Math.round(weatherData.temp_max) : '--'} / {weatherData?.temp_min ? Math.round(weatherData.temp_min) : '--'}ºC  </span>
          <span className="px-3 hidden md:inline">-</span>
          {/* Status Text (Regular) */}
          <span className="font-normal lg:ml-2">{weatherData?.today_condition}</span>
        </div>

        {/* Bottom-right image */}
        <div className="absolute bottom-0 right-0 w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
          <Image
            src={icon}
            alt="weather"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
    
  );
}