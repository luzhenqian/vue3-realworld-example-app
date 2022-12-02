import { Profile } from "./profile";
import { instance } from "./request";

export type AddCommentsToAnArticleParam = {
  comment: {
    body: string;
  };
};

export type AddCommentsToAnArticleRes = {
  comment: Comment;
};

export type GetCommentsFromAnArticleRes = {
  comments: Comments;
};

export type Comments = Comment[];

export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
};

export function addCommentsToAnArticle(
  slug: string,
  param: AddCommentsToAnArticleParam
) {
  return instance.post<AddCommentsToAnArticleRes>(
    `/articles/${slug}/comments`,
    param
  );
}

export function getCommentsFromAnArticle(slug: string) {
  return instance.get<GetCommentsFromAnArticleRes>(
    `/articles/${slug}/comments`
  );
}

export function deleteComment(slug: string, id: number) {
  return instance.delete<any>(`/articles/${slug}/comments/${String(id)}`);
}
