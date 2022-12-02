import { createApp, markRaw } from "vue";
// @ts-ignore
import Markdown from "vue3-markdown-it";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { pinia } from "./stores";

const app = createApp(App);
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(Markdown);

app.use(router).use(pinia).mount("#app");
