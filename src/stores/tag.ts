import { defineStore } from "pinia";
import { getTags } from "../apis/tag";

export const useTagStore = defineStore<
  "tag",
  { tags: string[]; loading: boolean },
  any,
  {
    getTags(): void;
  }
>({
  id: "tag",
  state: () => ({
    tags: [],
    loading: false,
  }),
  actions: {
    async getTags() {
      this.loading = true;
      const res = await getTags();
      this.tags = res.tags;
      this.loading = false;
    },
  },
});
