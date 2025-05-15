
import axios from '../config/axiosInstance';
    
export interface degreeType {
  id: number;
  name: string;
  value:string;
  label: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getdegreePage = async (
  page = 1,
  limit = 10,
  search = ''
): Promise<PaginatedResponse<degreeType>> => {
  const res = await axios.get(`/degrees?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return {
    items: res.data.data,
    total: res.data.total
  };
};

export const createdegree = async (data: Omit<degreeType, 'id'>): Promise<degreeType> => {
  const res = await axios.post('/degrees', data);
  return res.data;
};

export const updatedegree = async (id: number, data: Omit<degreeType, 'id'>): Promise<degreeType> => {
  const res = await axios.put(`/degrees/${id}`, data);
  return res.data;
};

export const deletedegree = async (id: number): Promise<void> => {
  await axios.delete(`/degrees/${id}`);
};
