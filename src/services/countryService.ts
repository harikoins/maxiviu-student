import axios from "../config/axiosInstance";

export interface countryType {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code : string;
  currency:string;
  states:stateType[];
  label:string;
  value:string;
}

export interface stateType {
  id:number;
  country_id:number;
  name:string;
  code:string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getCountryPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<countryType>> => {
  const res = await axios.get(
    `/countries?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createCountry = async (
  data: Omit<countryType, "id">
): Promise<countryType> => {
  const res = await axios.post("/countries", data);
  return res.data;
};

export const updateCountry = async (
  id: number,
  data: Omit<countryType, "id">
): Promise<countryType> => {
  const res = await axios.put(`/countries/${id}`, data);
  return res.data;
};

export const deleteCountry = async (id: number): Promise<void> => {
  await axios.delete(`/countries/${id}`);
};
