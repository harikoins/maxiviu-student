import axios from "../config/axiosInstance";

export interface technicalSkillType {
  id: number;
  student_id: number;
  skill: string;
  expertiselevel: string;
  evaluationstatus: string;
  noofprojects: string;
  mockinterview: string;
  bestscore: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getTechnicalSkillsPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<technicalSkillType>> => {
  const res = await axios.get(
    `/technicalskill?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createTechnicalSkill = async (
  data: FormData
): Promise<technicalSkillType> => {
  const res = await axios.post("/technicalskill", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createBulkTechnicalSkill = async (data: {
  technicalSkillDatas: Omit<technicalSkillType, "id">[];
  student_id: number;
}): Promise<{ success: boolean; data: technicalSkillType[] }> => {
  const res = await axios.post("/technicalskills/bulk-create", data);
  return res.data;
};

export const updateTechnicalSkill = async (
  id: number,
  data: Omit<technicalSkillType, "id">
): Promise<technicalSkillType> => {
  const res = await axios.put(`/technicalskills/${id}`, data);
  return res.data;
};

export const deleteTechnicalSkill = async (id: number): Promise<void> => {
  await axios.delete(`/technicalskills/${id}`);
};

export const getTechnicalSkill = async (
  id: number
): Promise<technicalSkillType> => {
  const res = await axios.get(`/technicalskills/${id}`);
  return res.data;
};
