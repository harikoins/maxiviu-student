import axios from "../config/axiosInstance";

export interface ActivityType {
  id: number;
  student_id: number;
  category: string;
  skill: string;
  description: string;
  achievement: string;
  filename:string;
  filePath:string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getExtracurricularActivityPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<ActivityType>> => {
  const res = await axios.get(
    `/extracurricularactivities?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createExtracurricularActivity = async (
  data: FormData
): Promise<ActivityType> => {
  const res = await axios.post("/extracurricularactivities", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkExtracurricularActivity = async (
  formData: FormData,
  uploadPath: string
): Promise<{ success: boolean; data: ActivityType[] }> => {
  const res = await axios.post("/extracurricularactivities/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-path": uploadPath,
    },
  });
  return res.data;
};

export const updateExtracurricularActivity = async (
  id: number,
  data: Omit<ActivityType, "id">
): Promise<ActivityType> => {
  const res = await axios.put(`/extracurricularactivities/${id}`, data);
  return res.data;
};

export const deleteExtracurricularActivity = async (id: number): Promise<void> => {
  await axios.delete(`/extracurricularactivities/${id}`);
};

export const getExtracurricularActivity = async (
  id: number
): Promise<ActivityType> => {
  const res = await axios.get(`/extracurricularactivities/${id}`);
  return res.data;
};
