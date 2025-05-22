import axios from "../config/axiosInstance";
import type { softSkillType } from "./softskillsService";
import type { technicalSkillType } from "./technicalskillService";
import type { internshipType } from "./internshipService";
import type { certificationType } from "./certificationService";

interface userType {
  id: number;
  email: string;
  name: string;
}

interface DepartmentType {
  id: number;
  name: string;
}

interface DegreeType {
  id: number;
  name: string;
}

interface CourseType {
  id: number;
  name: string;
}

interface DocumentType {
  id: number;
  name: string;
  documentpath: string;
  type: string;
  filename: string;
}

export interface studentType {
  // items:studentType;
  id: number;
  firstname: string;
  lastname: string;
  headline: string;
  email: string;
  website: string;
  join_year: string;
  complete_year: string;
  mygoal?: string; // Made optional
  mystory?: string; // Made optional
  myachievement?: string; // Made optional
  profile_linkedin?: string;
  profile_behance?: string;
  profile_card?: string;
  profile_github?: string;
  profile_reddit?: string;
  dob?: string;
  pphoneno?: string;
  sphoneno?: string;
  college_id: number;
  user_id: number;
  department_id: number;
  degree_id: number;
  city_id: number;
  state_id: number;
  country_id: number;
  course_id: number;
  status: number;
  user: userType;
  department: DepartmentType;
  degree: DegreeType;
  course: CourseType;
  documents: DocumentType[];
  internships: internshipType[];
  softskills: softSkillType[];
  technicalskills: technicalSkillType[];
  certificates: certificationType[];
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getstudentPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<studentType>> => {
  const res = await axios.get(
    `/students?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createstudent = async (
  data: Omit<studentType, "id">
): Promise<studentType> => {
  const res = await axios.post("/students", data);
  return res.data;
};

export const updatestudent = async (
  id: number,
  data: Omit<studentType, "id">
): Promise<studentType> => {
  const res = await axios.put(`/students/${id}`, data);
  return res.data;
};

export const deletestudent = async (id: number): Promise<void> => {
  await axios.delete(`/students/${id}`);
};

export const getstudent = async (id: number): Promise<studentType> => {
  const res = await axios.get(`/students/${id}`);
  return res.data;
};
