import { defineStore } from "pinia";
import Schema, { Rules } from "async-validator";
import {
  Article,
  getArticle as getArticleApi,
  favoriteArticle as favoriteArticleApi,
  unfavoriteArticle as unfavoriteArticleApi,
  ListArticles,
  listArticles,
  ListArticlesParams,
  feedArticles,
  PublishArticle,
  createArticle as createArticleApi,
  PublishArticleParams,
  deleteArticle as deleteArticleApi,
  updateArticle,
} from "../apis/article";
import { useCommentStore } from "./comment";
import { useProfileStore } from "./profile";
import { useUserStore } from "./user";

const descriptor: Rules = {
  title: {
    type: "string",
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value.length > 4 && value.length < 128) {
          return resolve();
        }
        reject("title length should be between 4-128 characters!");
      });
    },
  },
  description: {
    type: "string",
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value.length > 50 && value.length < 1024) {
          return resolve();
        }
        reject("description should be between 50-1024 characters");
      });
    },
  },
  body: {
    type: "string",
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value.length > 50 && value.length < 1024_00) {
          return resolve();
        }
        reject("body should be between 50-102400 characters");
      });
    },
  },
  tagList: {
    type: "array",
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        const result = value.some((tag: string) => tag.length > 50);
        if (result) {
          return reject("tag length should be 50 characters or less!");
        }
        resolve();
      });
    },
  },
};

export const useArticleStore = defineStore<
  "article",
  {
    articles: ListArticles;
    offset: number;
    articlesLoading: boolean;
    articlesCount: number;
    limit: number;
    tag: string;
    tabs: string[];
    tab: string;

    profileTabs: string[];
    profileTab: string;

    article: Article | void;
    followUserLoading: boolean;
    favoriteArticleLoading: boolean;

    publishArticleLoading: boolean;
    publishArticle: PublishArticle;
    publishArticleErrorsMessage: string[];

    deleteArticleLoading: boolean;
  },
  any,
  {
    getArticles(): Promise<void>;
    getFeedArticles(): Promise<void>;
    clearArticles(): void;
    changeTag(tag: string): void;
    changeTab(tab: string): void;
    changeProfileTab(tab: string): void;
    getArticle(slug: string): Promise<void>;
    followUser(): Promise<void>;
    unfollowUser(): Promise<void>;
    favoriteArticle(slug?: string): Promise<void>;
    unfavoriteArticle(slug?: string): Promise<void>;
    createArticle(): Promise<void>;
    addTag(e: InputEvent): void;
    removeTag(tagName: string): void;
    deleteArticle(slug: string): Promise<void>;
    editArticleStepOne(slug: string): void;
    editArticleStepTwo(slug: string): Promise<void>;
    getEditArticle(slug: string): Promise<void>;
    resetEditArticle(): void;
    reset(): void;
    clearProfileTab(): void;
    clearTab(): void;
    setTab(tab: string): void;
  }
>({
  id: "article",
  state: () => ({
    articles: [],
    offset: 0,
    articlesLoading: false,
    articlesCount: 0,
    limit: 20,
    tag: "",
    tabs: ["Your Feed", "Global Feed"],
    tab: "Global Feed",

    profileTabs: ["My Articles", "Favorited Articles"],
    profileTab: "My Articles",

    article: void 0,
    followUserLoading: false,
    favoriteArticleLoading: false,
    publishArticle: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
    publishArticleErrorsMessage: [],
    publishArticleLoading: false,
    deleteArticleLoading: false,
  }),
  actions: {
    async getArticles() {
      this.articlesLoading = true;
      const params: ListArticlesParams = {
        offset: this.offset,
        limit: this.limit,
      };
      if (this.tag !== "") {
        params.tag = this.tag;
      }
      if (this.profileTab === "My Articles") {
        const profileStore = useProfileStore();
        if (profileStore.profile) {
          params.author = profileStore.profile.username;
        }
      } else if (this.profileTab === "Favorited Articles") {
        const profileStore = useProfileStore();
        if (profileStore.profile) {
          params.favorited = profileStore.profile.username;
        }
      }
      const res = await listArticles(params);
      this.articles = [...this.articles, ...res.articles];
      this.articlesCount = res.articlesCount;
      this.articlesLoading = false;
      this.offset += this.limit;
    },
    async getFeedArticles() {
      this.articlesLoading = true;
      const params: ListArticlesParams = {
        offset: this.offset,
        limit: this.limit,
      };
      if (this.tag !== "") {
        params.tag = this.tag;
      }
      const res = await feedArticles(params);
      this.articles = [...this.articles, ...res.articles];
      this.articlesCount = res.articlesCount;
      this.articlesLoading = false;
      this.offset += this.limit;
    },
    async getArticle(slug: string) {
      const res = await getArticleApi(slug);
      const commentStore = useCommentStore();
      commentStore.getComment(slug);
      this.article = res.article;
    },
    clearArticles() {
      this.articles = [];
      this.offset = 0;
      this.articlesLoading = false;
    },
    clearProfileTab() {
      this.profileTab = "";
    },
    clearTab() {
      this.tab = "";
    },
    changeTab(tab: string) {
      if (this.articlesLoading) {
        return;
      }

      this.tab = tab;
      this.clearArticles();
      if (tab === "Global Feed") {
        this.getArticles();
        return;
      }
      this.getFeedArticles();
    },
    changeTag(tag: string) {
      if (this.articlesLoading) {
        return;
      }
      this.tag = tag;
      this.clearArticles();
      this.getArticles();
    },
    changeProfileTab(tab: string) {
      if (this.articlesLoading) {
        return;
      }
      this.clearArticles();
      this.profileTab = tab;
      this.getArticles();
    },
    async followUser() {
      this.followUserLoading = true;
      const profileStore = useProfileStore();
      await profileStore.followUser(this.article?.author.username as string);
      if (this.article) {
        this.article.author.following = true;
      }
      this.followUserLoading = false;
    },
    async unfollowUser() {
      this.followUserLoading = true;
      const profileStore = useProfileStore();
      await profileStore.unfollowUser(this.article?.author.username as string);
      if (this.article) {
        this.article.author.following = false;
      }
      this.followUserLoading = false;
    },
    async favoriteArticle(slug: string) {
      this.favoriteArticleLoading = true;
      await favoriteArticleApi(slug || (this.article?.slug as string));
      if (slug) {
        const article = this.articles.find((article) => article.slug === slug);
        if (article) {
          article.favorited = true;
          article.favoritesCount += 1;
        }
      }
      if (this.article) {
        this.article.favoritesCount += 1;
        this.article.favorited = true;
      }
      this.favoriteArticleLoading = false;
    },
    async unfavoriteArticle(slug: string) {
      this.favoriteArticleLoading = true;
      await unfavoriteArticleApi(slug || (this.article?.slug as string));
      if (slug) {
        const article = this.articles.find((article) => article.slug === slug);
        if (article) {
          article.favorited = false;
          article.favoritesCount -= 1;
        }
      }
      if (this.article) {
        this.article.favoritesCount -= 1;
        this.article.favorited = false;
      }
      this.favoriteArticleLoading = false;
    },
    async createArticle() {
      this.publishArticleLoading = true;
      this.publishArticleErrorsMessage.length = 0;
      const validator = new Schema(descriptor);

      try {
        const result = await validator.validate(this.publishArticle);
        try {
          const res = await createArticleApi({
            article: result,
          } as PublishArticleParams);
          this.article = res.article;
          this.router.push(`/article/${res.article.slug}`);
        } catch (err) {
          Object.keys((err as any).response.data.errors).forEach((errKey) => {
            this.publishArticleErrorsMessage.push(
              `${errKey}: ${(err as any).response.data.errors[errKey]}`
            );
          });
        }
      } catch (err: any) {
        const { errors, fields } = err;
        Object.keys(fields as any).forEach((key) => {
          this.publishArticleErrorsMessage.push(
            (fields as any)[key][0].message
          );
        });
      } finally {
        this.publishArticleLoading = false;
      }
    },
    addTag(e) {
      const value = (e?.target as any).value;
      if (!!!value || this.publishArticle.tagList.includes(value)) {
        return;
      }
      this.publishArticle.tagList.push(value);
      (e.target as any).value = "";
    },
    removeTag(tagName: string) {
      const idx = this.publishArticle.tagList.findIndex(
        (_tagName) => tagName === _tagName
      );
      if (idx > -1) {
        this.publishArticle.tagList.splice(idx, 1);
      }
    },
    async deleteArticle() {
      if (!this.article) {
        return;
      }
      this.deleteArticleLoading = true;
      await deleteArticleApi(this.article.slug);
      this.deleteArticleLoading = false;
      this.router.push("/");
    },
    editArticleStepOne(slug: string) {
      if (!!!this.article) {
        return;
      }

      this.publishArticle = {
        title: this.article.title,
        description: this.article.description,
        body: this.article.body,
        tagList: this.article.tagList,
      };

      this.router.push(`/editor/${slug}`);
    },
    async editArticleStepTwo(slug: string) {
      if (!!!this.publishArticle || !!!slug) {
        return;
      }
      try {
        const validator = new Schema(descriptor);

        try {
          await validator.validate(this.publishArticle);
          try {
            this.publishArticleLoading = true;
            const res = await updateArticle(slug, {
              article: this.publishArticle,
            });
            this.router.push(`/article/${res.article.slug}`);
          } catch (err) {
            console.log("err:", err);
            Object.keys((err as any).response.data.errors).forEach((errKey) => {
              this.publishArticleErrorsMessage.push(
                `${errKey}: ${(err as any).response.data.errors[errKey]}`
              );
            });
          }
        } catch ({ errors, fields }: any) {
          Object.keys(fields as any).forEach((key) => {
            this.publishArticleErrorsMessage.push(
              (fields as any)[key][0].message
            );
          });
        }
      } catch (err) {
        console.log(err, "err");
      }
    },
    async getEditArticle(slug: string) {
      const res = await getArticleApi(slug);
      this.publishArticle = res.article;
    },
    resetEditArticle() {
      this.publishArticle = {
        title: "",
        description: "",
        body: "",
        tagList: [],
      };
      this.publishArticleErrorsMessage = [];
      this.publishArticleLoading = false;
    },
    reset() {
      this.offset = 0;
      this.tag = "";
      this.articles = [];
      const user = useUserStore();
      if (!user.isLogin) {
        this.tabs = ["Global Feed"];
      } else {
        this.tabs = ["Your Feed", "Global Feed"];
      }
    },
    setTab(tab: string) {
      this.tab = tab;
    },
  },
});
