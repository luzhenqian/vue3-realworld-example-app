import { instance } from "./request";

export interface User {
  username: string;
  email: string;
  password: string;
}

export function registration(user: User) {
  return instance.post("/users", {
    user,
  });
}

export interface LoginUser {
  email: string;
  password: string;
}

export type GetCurrentUserRes = {
  user: Author;
};

export type Author = {
  bio: null | string;
  following: boolean;
  image: string;
  username: string;
  token?: string;
  email: string;
};

export type EditUser = {
  username: string;
  bio?: string;
  image?: string;
  email: string;
  password?: string;
};

export type UpdateUserParams = {
  user: EditUser;
};

export function authentication(user: LoginUser) {
  return instance.post<GetCurrentUserRes>("/users/login", {
    user,
  });
}

export function getCurrentUser() {
  return instance.get<GetCurrentUserRes>("/user");
}

export function updateUser(user: UpdateUserParams) {
  return instance.put<GetCurrentUserRes>("/user", user);
}
