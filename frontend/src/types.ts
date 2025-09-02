export interface TravelRecord {
  id: number;
  title: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  visit_date: string;
  rating: number;
  category: string;
  notes?: string;
  image_filename?: string;
  created_at: string;
  updated_at: string;
}

export interface TravelRecordCreate {
  title: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  visit_date: string;
  rating: number;
  category: string;
  notes?: string;
}

export interface TravelRecordList {
  records: TravelRecord[];
  total: number;
  page: number;
  per_page: number;
}