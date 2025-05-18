import axios from "../config/axiosInstance";

export interface documentType {
  id: number;
  documentpath: string;
  student_id: number;
  type: string;
  filename: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getstudentPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<documentType>> => {
  const res = await axios.get(
    `/students?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createdocument = async (data: FormData): Promise<documentType> => {
  const res = await axios.post("/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatedocument = async (
  id: number,
  data: Omit<documentType, "id">
): Promise<documentType> => {
  const res = await axios.put(`/documents/${id}`, data);
  return res.data;
};

export const deletedocument = async (id: number): Promise<void> => {
  await axios.delete(`/documents/${id}`);
};

export const getdocument = async (id: number): Promise<documentType> => {
  const res = await axios.get(`/documents/${id}`);
  return res.data;
};
