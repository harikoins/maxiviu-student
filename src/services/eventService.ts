import axios from "../config/axiosInstance";

export interface eventType {
  id: number;
  student_id: number;
  college_id: number;
  department_id: number;
  name: string;
  emode: string;
  elink: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
}
interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getEvents = async (
  student_id: number,
  college_id: number,
  department_id: number
): Promise<PaginatedResponse<eventType>> => {
  const res = await axios.get("/events", {
    params: {
      student_id,
      college_id,
      department_id,
    },
  });
  return {
    items: res.data.data,
    total: res.data.total,
  };
};

export const createEvent = async (data: FormData): Promise<eventType> => {
  const res = await axios.post("/events", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateEvent = async (
  id: number,
  data: Omit<eventType, "id">
): Promise<eventType> => {
  const res = await axios.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await axios.delete(`/events/${id}`);
};

export const getEvent = async (id: number): Promise<eventType> => {
  const res = await axios.get(`/events/${id}`);
  return res.data;
};
