import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import { routes } from "./routes";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const needAuthPaths = ["editor", "settings"];

router.beforeEach((to, from) => {
  NProgress.start();

  const userStore = useUserStore();
  if (!userStore.isLogin) {
    const canNotJump = needAuthPaths.some((path) => {
      return to.path.includes(path);
    });
    if (canNotJump) {
      return {
        name: "Login",
      };
    }
  }

  return true;
});

router.afterEach((to) => {
  NProgress.done();
});
