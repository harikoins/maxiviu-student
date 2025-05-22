import axios from "../config/axiosInstance";

export interface userType {
  id: number;
  name: string;
  usertype_id: string;
  username: string;
  email: string;
  studentid: number;
  isCreated: boolean;
  accessToken:string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getUserPage = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResponse<userType>> => {
  const res = await axios.get(
    `/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createUser = async (
  data: Omit<userType, "id">
): Promise<userType> => {
  const res = await axios.post("/users", data);
  return res.data;
};

export const loginUser = async (
  data: Omit<userType, "id">
): Promise<userType> => {
  const res = await axios.post("/users/auth/login", data);
  return res.data;
};

export const createSignedupUser = async (
  data: Omit<userType, "id">
): Promise<userType> => {
  const res = await axios.post("/signedupuser", data);
  return res.data;
};

export const updateUser = async (
  id: number,
  data: Omit<userType, "id">
): Promise<userType> => {
  const res = await axios.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`/users/${id}`);
};
