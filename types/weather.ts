// Weather API Type Definitions

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface NextDayForecast {
  day: string;
  min: number;
  max: number;
  conditions: string[];
}

export interface NextDaysTemperature {
  [date: string]: NextDayForecast;
}

export interface WeatherData {
  city: string;
  country: string;
  day: string;
  time: string;
  month: string;
  date: number;
  year: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  temp_min: number;
  temp_max: number;
  today_condition: string;
  uv_index: number | string;
  next_days_temperature: NextDaysTemperature;
}

export interface PrismicImageField {
  url: string;
  alt?: string | null;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface PrismicTextField {
  text: string;
}

export interface HomeSlicePrismic {
  logo?: PrismicImageField;
  heading?: PrismicTextField[];
  subtitle?: PrismicTextField[];
  search_placeholder?: string;
}

// Prismic Slice Type Definitions

export interface PrismicSlice {
  slice_type: string;
  primary?: unknown;
  items?: unknown[];
}

export interface SearchBarSliceData {
  slice_type: "search_bar";
  primary: {
    icon: PrismicImageField;
    placeholder: string;
  };
}

export interface PrismicWeatherItem {
  label: string;
  value: string;
  unit: string;
  icon: PrismicImageField;
}

export interface WeatherDetailListSliceData {
  slice_type: "weather_detail_list";
  primary: {
    section_title: string;
    weather_items: PrismicWeatherItem[];
  };
}

export interface WeatherForecastSliceData {
  slice_type: "weather_forecast";
  primary: {
    section_title: string;
    rainy_weather: PrismicImageField;
    cloud_icon: PrismicImageField;
    sunny_icon: PrismicImageField;
    sun_cloud_icon: PrismicImageField;
    cloud_storm_icon: PrismicImageField;
  };
}

export type PrismicForecastIcons = (PrismicImageField | undefined)[];

// OpenWeather API Type Definitions

export interface OpenWeatherWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface OpenWeatherForecastItem {
  dt: number;
  main: OpenWeatherMain;
  weather: OpenWeatherWeather[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

// Prismic Configuration Types

export interface PrismicRoute {
  type: string;
  path: string;
  resolvers?: Record<string, string>;
}

// API Response Types

export interface WeatherAPIResponse {
  data?: WeatherData;
  error?: string;
}
