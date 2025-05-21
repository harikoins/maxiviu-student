import axios from "../config/axiosInstance";

export interface softSkillType {
  id: number;
  student_id: number;
  skill: string;
  trainingattended: string;
  evaluationstatus: string;
  mockinterview: string;
  bestscore: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getSoftSkillsPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<softSkillType>> => {
  const res = await axios.get(
    `/softskills?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createSoftSkill = async (
  data: FormData
): Promise<softSkillType> => {
  const res = await axios.post("/softskills", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkSoftSkill = async (data: {
  softSkillDatas: Omit<softSkillType, "id">[];
  student_id: number;
}): Promise<{ success: boolean; data: softSkillType[] }> => {
  const res = await axios.post("/softskills/bulk-create", data);
  return res.data;
};

export const updateSoftSkill = async (
  id: number,
  data: Omit<softSkillType, "id">
): Promise<softSkillType> => {
  const res = await axios.put(`/softskills/${id}`, data);
  return res.data;
};

export const deleteSoftSkill = async (id: number): Promise<void> => {
  await axios.delete(`/softskills/${id}`);
};

export const getSoftSkill = async (id: number): Promise<softSkillType> => {
  const res = await axios.get(`/softskills/${id}`);
  return res.data;
};
