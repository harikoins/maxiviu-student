
import axios from '../config/axiosInstance';

export interface user{
  id: number, 
  username: string,
  email:string,
  usertype_id: number;
  name: string;
  mobile: string;
}

export interface collegeType {
  id: number;
  contact: string;
  address: string;
  user : user 
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getcollegePage = async (
  page = 1,
  limit = 10,
  search = ''
): Promise<PaginatedResponse<collegeType>> => {
  const res = await axios.get(`/colleges?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return {
    items: res.data.data,
    total: res.data.total
  };
};

export const createcollege = async (data: Omit<collegeType, 'id'>): Promise<collegeType> => {
  const res = await axios.post('/colleges', data);
  return res.data;
};

export const updatecollege = async (id: number, data: Omit<collegeType, 'id'>): Promise<collegeType> => {
  const res = await axios.put(`/colleges/${id}`, data);
  return res.data;
};

export const deletecollege = async (id: number): Promise<void> => {
  await axios.delete(`/colleges/${id}`);
};
