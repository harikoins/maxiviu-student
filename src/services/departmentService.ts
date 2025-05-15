
import axios from '../config/axiosInstance';

export interface departmentType {
  id: number;
  name: string;
  description: string;
  value:string;
  Department_course ?: {
    id : number
  }
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getdepartmentPage = async (
  page = 1,
  limit = 10,
  search = ''
): Promise<PaginatedResponse<departmentType>> => {
  const res = await axios.get(`/departments?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return {
    items: res.data.data,
    total: res.data.total
  };
};

export const createdepartment = async (data: Omit<departmentType, 'id'>): Promise<departmentType> => {
  const res = await axios.post('/departments', data);
  return res.data;
};

export const updatedepartment = async (id: number, data: Omit<departmentType, 'id'>): Promise<departmentType> => {
  const res = await axios.put(`/departments/${id}`, data);
  return res.data;
};

export const deletedepartment = async (id: number): Promise<void> => {
  await axios.delete(`/departments/${id}`);
};
