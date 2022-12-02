import { instance } from "./request";

export type ProfileRes = {
  profile: Profile;
};

export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export function getProfile(username: string) {
  return instance.get<ProfileRes>(`/profiles/${username}`);
}

export function followUser(username: string) {
  return instance.post<ProfileRes>(`/profiles/${username}/follow`);
}

export function unfollowUser(username: string) {
  return instance.delete<ProfileRes>(`/profiles/${username}/follow`);
}
