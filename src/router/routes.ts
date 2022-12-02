import { RouteRecordRaw } from "vue-router";

export const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    component: () => import("../components/Layout/index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("../views/Settings.vue"),
      },
      {
        path: "/editor",
        name: "Editor",
        component: () => import("../views/Editor.vue"),
      },
      {
        path: "/editor/:slug",
        name: "EditorWithSlug",
        component: () => import("../views/Editor.vue"),
      },
      {
        path: "/article/:slug",
        name: "Article",
        props: true,
        component: () => import("../views/Article.vue"),
      },
      {
        path: "/profile/:username",
        name: "Profile",
        props: true,
        component: () => import("../views/Profile.vue"),
      },
      {
        path: "/profile/:username/favorites",
        name: "ProfileFavorites",
        component: () => import("../views/Profile.vue"),
      },
    ],
  },
];
