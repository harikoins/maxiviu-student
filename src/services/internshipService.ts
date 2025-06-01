import axios from "../config/axiosInstance";

export interface internshipType {
  id: number;
  student_id: number;
  role: string;
  type: string;
  organization: string;
  duration: string;
  status: string;
  filename: string;
  certificatePath: string;
  certificateFile: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getInternshipPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<internshipType>> => {
  const res = await axios.get(
    `/internships?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createInternship = async (
  data: FormData
): Promise<internshipType> => {
  const res = await axios.post("/internships", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkInternship = async (
  formData: FormData,
  uploadPath: string
): Promise<{ success: boolean; data: internshipType[] }> => {
  const res = await axios.post("/internships/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-path": uploadPath,
    },
  });
  return res.data;
};

export const updateInternship = async (
  id: number,
  data: Omit<internshipType, "id">
): Promise<internshipType> => {
  const res = await axios.put(`/internships/${id}`, data);
  return res.data;
};

export const deleteInternship = async (id: number): Promise<void> => {
  await axios.delete(`/internships/${id}`);
};

export const getInternship = async (id: number): Promise<internshipType> => {
  const res = await axios.get(`/internships/${id}`);
  return res.data;
};
