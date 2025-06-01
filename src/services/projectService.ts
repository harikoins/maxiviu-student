import axios from "../config/axiosInstance";

export interface projectType {
  id: number;
  student_id: number;
  name: string;
  techskill: string;
  status: string;
  duration: string;
  sourcecodelink: string;
  filename: string;
  projectPath: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getProjectsPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<projectType>> => {
  const res = await axios.get(
    `/projects?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createProject = async (data: FormData): Promise<projectType> => {
  const res = await axios.post("/projects", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkProject = async (
  formData: FormData,
  uploadPath: string
): Promise<{ success: boolean; data: projectType[] }> => {
  const res = await axios.post("/projects/bulk-create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-path": uploadPath,
    },
  });
  return res.data;
};

export const updateProject = async (
  id: number,
  data: Omit<projectType, "id">
): Promise<projectType> => {
  const res = await axios.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await axios.delete(`/projects/${id}`);
};

export const getProject = async (id: number): Promise<projectType> => {
  const res = await axios.get(`/projects/${id}`);
  return res.data;
};
