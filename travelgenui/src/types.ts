export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  geo: GeoPoint;
  price: string;
}

export interface DayPlan {
  day_number: number;
  date: string; // New field: "2026-08-12 (Wednesday)"
  theme: string;
  activities: Activity[];
}

export interface SafetyInfo {
  indian_embassy: string;
  emergency_numbers: string;
}

export interface MetaInfo {
  weather_summary: string;
  packing_list: string[];
  local_etiquette: string[];
  currency_rate: string;
  must_try_food: string[];
  language_tips: Record<string, string>;
  safety_info: SafetyInfo;
}

export interface Itinerary {
  trip_title: string;
  destination: string;
  duration: number;
  budget_tag: string;
  total_price: string;
  meta_info: MetaInfo;
  days: DayPlan[];
}