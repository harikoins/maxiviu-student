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
    `/intenships?page=${page}&limit=${limit}&search=${encodeURIComponent(
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
  const res = await axios.post("/intenships", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// export const createBulkInternship = async (data: {
//   internshipDatas: Omit<internshipType, "id">[];
//   student_id: number;
// }): Promise<{ success: boolean; data: internshipType[] }> => {
//   const res = await axios.post("/intenships/bulk-create", data);
//   return res.data;
// };

export const createBulkInternship = async (
  formData: FormData
): Promise<{ success: boolean; data: internshipType[] }> => {
  const res = await axios.post("/intenships/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateInternship = async (
  id: number,
  data: Omit<internshipType, "id">
): Promise<internshipType> => {
  const res = await axios.put(`/intenships/${id}`, data);
  return res.data;
};

export const deleteInternship = async (id: number): Promise<void> => {
  await axios.delete(`/intenships/${id}`);
};

export const getInternship = async (id: number): Promise<internshipType> => {
  const res = await axios.get(`/intenships/${id}`);
  return res.data;
};
