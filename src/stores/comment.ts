import { defineStore } from "pinia";
import {
  addCommentsToAnArticle,
  Comments,
  deleteComment as deleteCommentApi,
  getCommentsFromAnArticle,
} from "../apis/comment";

export const useCommentStore = defineStore<
  "comment",
  {
    comments: Comments;
    addCommentLoading: boolean;
    deleteCommentLoading: boolean;
  },
  any,
  {
    getComment(slug: string): Promise<void>;
    addComment(slug: string, content: string): Promise<void>;
    deleteComment(slug: string, id: number): Promise<void>;
  }
>({
  id: "comment",
  state: () => ({
    comments: [],
    addCommentLoading: false,
    deleteCommentLoading: false,
  }),
  actions: {
    async getComment(slug: string) {
      const res = await getCommentsFromAnArticle(slug);
      this.comments = res.comments;
    },
    async addComment(slug: string, content: string) {
      this.addCommentLoading = true;
      const res = await addCommentsToAnArticle(slug, {
        comment: {
          body: content,
        },
      });
      this.comments.push(res.comment);
      this.addCommentLoading = false;
    },
    async deleteComment(slug: string, id: number) {
      this.deleteCommentLoading = true;
      await deleteCommentApi(slug, id);
      const delIdx = this.comments.findIndex((comment) => comment.id === id);
      this.comments.splice(delIdx, 1);
      this.deleteCommentLoading = false;
    },
  },
});
