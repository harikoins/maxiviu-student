import axios from "../config/axiosInstance";

export interface courseType {
  id: number;
  name: string;
  description: string;
  department_id: number;
  department_courses ?: number
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getcoursePage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<courseType>> => {
  const res = await axios.get(
    `/courses?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createcourse = async (
  data: Omit<courseType, "id">
): Promise<courseType> => {
  const res = await axios.post("/courses", data);
  return res.data;
};

export const updatecourse = async (
  id: number,
  data: Omit<courseType, "id">
): Promise<courseType> => {
  const res = await axios.put(`/courses/${id}`, data);
  return res.data;
};

export const deletecourse = async (id: number): Promise<void> => {
  await axios.delete(`/courses/${id}`);
};
