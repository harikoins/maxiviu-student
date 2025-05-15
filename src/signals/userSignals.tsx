import { signal } from "@preact/signals-react";

export interface UserType {
  username: string;
  email: string;
  accessToken: string;
  id: number;
  studentid: number;
}

const storedUser = localStorage.getItem("komaxiviustudent");
export const userSignal = signal<UserType | null>(
  storedUser ? JSON.parse(storedUser) : null
);

export const setUser = (user: UserType) => {
  userSignal.value = user;
  localStorage.setItem("komaxiviustudent", JSON.stringify(user));
};

export const clearUser = () => {
  userSignal.value = null;
  localStorage.removeItem("komaxiviustudent");
};
