interface userDetails {
  id: number;
  email: string;
  name: string;
}

export interface userDatas {
  firstname: string;
  lastname: string;
  headline: string;
  email: string;
  website: string;
  join_year: string;
  complete_year: string;
  mygoal: string;
  mystory: string;
  myachievement: string;
  profile_linkedin: string;
  profile_behance: string;
  profile_card: string;
  profile_github: string;
  pphoneno: string;
  sphoneno: string;
  college_id: number;
  user_id: number;
  department_id: number;
  degree_id: number;
  city_id: number;
  state_id: number;
  country_id: number;
  course_id: number;
  id: number;
  user: userDetails;
  department: {
    id: number;
    name: string;
  };
  degree: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
}
