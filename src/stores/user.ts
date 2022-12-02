import { defineStore } from "pinia";
import {
  authentication,
  Author,
  getCurrentUser,
  LoginUser,
  EditUser,
  updateUser as updateUserApi,
} from "../apis/user";
import { useArticleStore } from "./article";

export const useUserStore = defineStore<
  "user",
  {
    user: Author;
    isLogin: boolean;
    loading: boolean;
    editUser: EditUser;

    updateLoading: boolean;
  },
  any,
  {
    getUser(): void;
    login(user: LoginUser): Promise<boolean>;
    signOut(): void;
    syncEditUser(): void;
    updateUser(): Promise<void>;
  }
>({
  id: "user",
  persist: true,
  state: () => ({
    user: {
      bio: null,
      following: false,
      image: "",
      username: "",
      email: "",
    },
    isLogin: false,
    loading: false,

    editUser: {
      email: "",
      username: "",
      bio: "",
      image: "",
      password: "",
    },

    updateLoading: false,
  }),
  actions: {
    async login(user: LoginUser) {
      this.loading = true;
      try {
        const data = await authentication(user);
        localStorage.setItem("token", data.user.token as string);
        delete data.user.token;
        this.user = data.user;
        this.isLogin = true;
        this.router.push("/");
        const articleStore = useArticleStore();
        articleStore.reset();
        return true;
      } catch (err) {
        return false;
      } finally {
        this.loading = false;
      }
    },
    async getUser() {
      this.loading = true;
      try {
        if (localStorage.getItem("token")) {
          const data = await getCurrentUser();
          this.user = data.user;
          this.isLogin = true;
        }
      } finally {
        this.loading = false;
      }
    },
    signOut() {
      localStorage.removeItem("token");
      this.isLogin = false;
    },
    syncEditUser() {
      const userStore = useUserStore();
      if (!!!userStore.user) {
        return;
      }
      this.editUser = {
        username: this.user.username,
        email: this.user.email,
        bio: this.user.bio || "",
        image: this.user.image,
        password: "",
      };
    },
    async updateUser() {
      this.updateLoading = true;
      try {
        const res = await updateUserApi({
          user: this.editUser,
        });
        this.user = res.user;
        localStorage.setItem("token", res.user.token as string);
        this.router.push(`/profile/${res.user.username}`);
      } finally {
        this.updateLoading = false;
      }
    },
  },
});
