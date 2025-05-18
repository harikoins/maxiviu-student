// src/services/userService.ts
import { userDatas } from "../stores/userStore";
import { getstudent } from "./studentService";

export const fetchUserData = async (userid: number) => {
  try {
    const response = await getstudent(userid);
    console.log(response,"response")
    if (response) {
      userDatas.value = response;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
