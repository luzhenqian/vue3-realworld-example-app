import { defineStore } from "pinia";
import {
  followUser as followUserApi,
  Profile,
  unfollowUser as unfollowUserApi,
  getProfile as getProfileApi,
} from "../apis/profile";

export const useProfileStore = defineStore<
  "profile",
  {
    profile: Profile | void;
    followLoading: boolean;
  },
  any,
  {
    clearProfile(): void;
    getProfile(username: string): Promise<void>;
    followUser(username: string): Promise<void>;
    unfollowUser(username: string): Promise<void>;
    jumpProfile(username: string): Promise<void>;
  }
>({
  id: "profile",
  state: () => ({
    article: void 0,
    profile: void 0,
    followLoading: false,
  }),
  actions: {
    clearProfile() {
      this.profile = void 0;
    },
    async getProfile(username: string) {
      if (this.profile) {
        if (this.profile.username === username) {
          return;
        }
      }
      this.clearProfile();
      const res = await getProfileApi(username);
      this.profile = res.profile;
    },
    async followUser(username: string) {
      this.followLoading = true;
      const res = await followUserApi(username);
      if (this.profile) {
        this.profile.following = true;
      }
      this.followLoading = false;
    },
    async unfollowUser(username: string) {
      this.followLoading = true;
      const res = await unfollowUserApi(username);
      if (this.profile) {
        this.profile.following = false;
      }
      this.followLoading = false;
    },
    async jumpProfile(username: string) {
      await this.getProfile(username);
      this.router.push(`/profile/${username}`);
    },
  },
});
