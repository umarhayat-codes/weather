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
