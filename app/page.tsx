"use client";

import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { createClient } from "@prismicio/client";
import { GeocodingResult, HomeSlicePrismic } from "@/types/weather";
import mainBackground from "../assets/main_background.png";
import smallBackground from "../assets/small_size_background.png";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [city, setCity] = useState<string>("");
  const [homeSlicePrismic, setHomeSlicePrismic] =
    useState<HomeSlicePrismic | null>(null);

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
      setLoading(true);

      const res = await axios.get(`/api/weather/city?city=${city}`);
      if (res.data.error) {
        alert("City not found!");
      } else {
        router.push(`/WeatherCity?city=${encodeURIComponent(city)}`);
      }
    } catch (err) {
      alert("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHome = async (): Promise<void> => {
      try {
        const client = createClient("weather-app-nextjs");
        const homeDataPrismic = await client.getSingle("home_page");
        if (
          homeDataPrismic.data.slices &&
          homeDataPrismic.data.slices.length > 0
        ) {
          const primaryData = homeDataPrismic.data.slices[0]?.primary;
          if (primaryData) {
            const slice = primaryData as HomeSlicePrismic;
            setHomeSlicePrismic(slice);
          }
        }
      } catch (err) {
        alert(err);
      }
    };

    fetchHome();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#131319] relative overflow-x-hidden text-white">
      {/* Desktop Background Image */}
      <div className="max-sm:hidden absolute inset-0 z-0">
        <Image
          src={mainBackground}
          alt="Background"
          fill
          priority
          quality={100}
          className="w-full h-full"
        />
      </div>

      {/* Mobile Background Image */}
      <div className="sm:hidden absolute inset-0 z-0">
        <Image
          src={smallBackground}
          alt="Background"
          fill
          priority
          quality={100}
          className="w-full h-full"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex items-center justify-center mt-12">
          <h3 className="text-[#BFBFD4] font-nunito font-bold text-[21.65px]">
            {homeSlicePrismic?.logo ? (
              <img
                src={homeSlicePrismic.logo.url}
                alt={homeSlicePrismic.logo.alt || "Logo"}
                width={homeSlicePrismic.logo.dimensions.width / 5}
                height={homeSlicePrismic.logo.dimensions.height / 5}
              />
            ) : (
              ""
            )}
          </h3>
        </div>

        <div className="flex flex-col items-center mt-[160px] max-sm:mt-[193px]">
          <h1
            className="
            w-[450px] max-sm:w-[311px]
            font-nunito font-bold
            text-[32px] max-sm:text-[20px]
            text-center
          "
          >
            <span className="text-[#FAFAFA]">
              {homeSlicePrismic?.heading?.[0]?.text?.split(" ")[0]}
            </span>
            <span> </span>
            <span className="text-[#FAFAFA] md:text-[#8FB2F5]">
              {homeSlicePrismic?.heading?.[0]?.text
                ?.split(" ")
                .slice(1)
                .join(" ")}
            </span>
          </h1>

          <p
            className="
            mt-[8px]
            w-[450px] max-sm:w-[311px]
            text-center
            font-nunito font-normal
            text-[20px] max-sm:text-[14px]
            text-[#BFBFD4]
          "
          >
            {homeSlicePrismic?.subtitle?.[0]?.text}
          </p>

          <div className="relative mt-[56px]">
            <input
              type="text"
              placeholder={homeSlicePrismic?.search_placeholder}
              className="
              w-[500px] max-sm:w-[300px]
              h-[56px] 
              border border-black
              hover:border-[#86548dff]
              px-[20px] pr-[50px]
              placeholder:text-[#FAFAFA] placeholder:text-[16px] font-nunito
              bg-[#1E1E29] outline-none mb-[8px]
            "
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

            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div>
            {suggestions.map((item: GeocodingResult, index: number) => (
              <div
                key={index}
                className="
                    w-[500px] max-sm:w-[300px]
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
        </div>
      </div>
    </div>
  );
}
