import axios from "../config/axiosInstance";

interface userDetails {
  id: number;
  email: string;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Degree {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
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
  mygoal?: string;  // Made optional
  mystory?: string; // Made optional
  myachievement?: string; // Made optional
  profile_linkedin?: string;
  profile_behance?: string;
  profile_card?: string;
  profile_github?: string;
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
  user: userDetails;
  department: Department;
  degree: Degree;
  course: Course;
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
