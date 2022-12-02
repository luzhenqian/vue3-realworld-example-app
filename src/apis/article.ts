import { instance } from "./request";
import { Author } from "./user";

export type ListArticlesParams = {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
};

export type FeedArticlesParams = {
  limit?: number;
  offset?: number;
};

export type ListArticlesRes = {
  articles: ListArticles;
  articlesCount: number;
};

export type ListArticles = Article[];

export type ArticleRes = {
  article: Article;
};

export type Article = {
  author: Author;
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  slug: string;
  tagList: string[];
  title: string;
  updatedAt: string;
};

export type PublishArticle = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type PublishArticleParams = {
  article: PublishArticle;
};

export function listArticles(params: ListArticlesParams = {}) {
  return instance.get<ListArticlesRes>(`/articles`, {
    params,
  });
}

export function feedArticles(params: FeedArticlesParams = {}) {
  return instance.get<ListArticlesRes>(`/articles/feed`, {
    params,
  });
}

export function getArticle(slug: string) {
  return instance.get<ArticleRes>(`/articles/${slug}`);
}

export function favoriteArticle(slug: string) {
  return instance.post<ArticleRes>(`/articles/${slug}/favorite`);
}

export function unfavoriteArticle(slug: string) {
  return instance.delete<ArticleRes>(`/articles/${slug}/favorite`);
}

export function createArticle(article: PublishArticleParams) {
  return instance.post<ArticleRes>(`/articles`, article);
}

export function deleteArticle(slug: string) {
  return instance.delete<ArticleRes>(`/articles/${slug}`);
}

export function updateArticle(slug: string, article: PublishArticleParams) {
  return instance.put<ArticleRes>(`/articles/${slug}`, article);
}
