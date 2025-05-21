import axios from "../config/axiosInstance";

export interface certificationType {
  id: number;
  student_id: number;
  name: string;
  mode: string;
  filename: string;
  certificatePath: string;
  certifiedBy: string;
  description: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getCertificatesPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<certificationType>> => {
  const res = await axios.get(
    `/certificates?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createCertificate = async (
  data: FormData
): Promise<certificationType> => {
  const res = await axios.post("/certificates", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkCertificate = async (
  formData: FormData
): Promise<{ success: boolean; data: certificationType[] }> => {
  const res = await axios.post("/certificates/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateCertificate = async (
  id: number,
  data: Omit<certificationType, "id">
): Promise<certificationType> => {
  const res = await axios.put(`/certificates/${id}`, data);
  return res.data;
};

export const deleteCertificate = async (id: number): Promise<void> => {
  await axios.delete(`/certificates/${id}`);
};

export const getCertificate = async (
  id: number
): Promise<certificationType> => {
  const res = await axios.get(`/certificates/${id}`);
  return res.data;
};
