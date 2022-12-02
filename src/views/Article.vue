<template>
  <div class="article-page" v-if="articleStore.article">

    <div class="banner">
      <div class="container">

        <h1>{{ articleStore.article?.title }}</h1>

        <div class="article-meta">
          <router-link :to="`/profile/${articleStore.article?.author.username}`">
            <img :src="articleStore.article?.author.image" />
          </router-link>
          <div class="info">
            <router-link :to="`/profile/${articleStore.article?.author.username}`" class="author">
              {{ articleStore.article?.author.username }}
            </router-link>
            <span class="date">{{ dayjs(articleStore.article?.updatedAt).format('MMMM D, YYYY') }}</span>
          </div>
          <template v-if="articleStore.article.author.username === userStore.user.username">
            <button @click="articleStore.editArticleStepOne(articleStore.article!.slug)"
              class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i>
              &nbsp;
              Edit Article
            </button>
            &nbsp;
            <button class="btn btn-sm btn-outline-danger" :disabled="articleStore.deleteArticleLoading"
              @click="articleStore.deleteArticle">
              <i class="ion-trash-a"></i>
              &nbsp;
              Delete Article
            </button>
          </template>
          <template v-else>
            <button v-if="!articleStore.article?.author.following" class="btn btn-sm btn-outline-secondary"
              :disabled="articleStore.followUserLoading" @click="articleStore.followUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ articleStore.article?.author.username }}
            </button>
            <button v-else class="btn btn-sm action-btn btn-secondary" :disabled="articleStore.followUserLoading"
              @click="articleStore.unfollowUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              Unfollow {{ articleStore.article?.author.username }}
            </button>
            &nbsp;&nbsp;
            <button v-if="!articleStore.article?.favorited" @click="articleStore.favoriteArticle"
              :disabled="articleStore.favoriteArticleLoading" class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{ articleStore.article?.favoritesCount }})</span>
            </button>
            <button v-else @click="articleStore.unfavoriteArticle" :disabled="articleStore.favoriteArticleLoading"
              class="btn btn-sm btn-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Unfavorite Post <span class="counter">({{ articleStore.article?.favoritesCount }})</span>
            </button>
          </template>
        </div>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <Markdown :source="articleStore.article?.body" />
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <a href="profile.html"><img :src="articleStore.article?.author.image" /></a>
          <div class="info">
            <a href="" class="author">{{ articleStore.article?.author.username }}</a>
            <span class="date">{{ dayjs(articleStore.article?.updatedAt).format('MMMM D, YYYY') }}</span>
          </div>

          <template v-if="articleStore.article.author.username === userStore.user.username">
            <button @click="articleStore.editArticleStepOne(articleStore.article!.slug)"
              class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i>
              &nbsp;
              Edit Article
            </button>
            &nbsp;
            <button class="btn btn-sm btn-outline-danger" :disabled="articleStore.deleteArticleLoading"
              @click="articleStore.deleteArticle">
              <i class="ion-trash-a"></i>
              &nbsp;
              Delete Article
            </button>
          </template>
          <template v-else>
            <button v-if="!articleStore.article?.author.following" class="btn btn-sm btn-outline-secondary"
              :disabled="articleStore.followUserLoading" @click="articleStore.followUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ articleStore.article?.author.username }}
            </button>
            <button v-else class="btn btn-sm action-btn btn-secondary" :disabled="articleStore.followUserLoading"
              @click="articleStore.unfollowUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              Unfollow {{ articleStore.article?.author.username }}
            </button>
            &nbsp;&nbsp;
            <button v-if="!articleStore.article?.favorited" @click="articleStore.favoriteArticle"
              :disabled="articleStore.favoriteArticleLoading" class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{ articleStore.article?.favoritesCount }})</span>
            </button>
            <button v-else @click="articleStore.unfavoriteArticle" :disabled="articleStore.favoriteArticleLoading"
              class="btn btn-sm btn-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Unfavorite Post <span class="counter">({{ articleStore.article?.favoritesCount }})</span>
            </button>
          </template>
        </div>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <form class="card comment-form">
            <div class="card-block">
              <textarea v-model="comment" :disabled="commentStore.addCommentLoading" class="form-control"
                placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img :src="userStore.user.image" class="comment-author-img" />
              <button :disabled="commentStore.addCommentLoading" class="btn btn-sm btn-primary" @click="addComment">
                Post Comment
              </button>
            </div>
          </form>

          <div v-for="comment in commentStore.comments" :key="comment.id" class="card">
            <div class="card-block">
              <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
              <router-link :to="`/profile/${comment.author.username}`" class="comment-author">
                <img :src="comment.author.image" :alt="comment.author.username" class="comment-author-img" />
              </router-link>
              &nbsp;
              <router-link :to="`/profile/${comment.author.username}`" class="comment-author">
                {{ comment.author.username }}
              </router-link>
              <span class="date-posted">{{ dayjs(comment.updatedAt).format('MMMM D, YYYY') }}</span>
              <span v-if="comment.author.username === userStore.user.username" class="mod-options"
                @click="deleteComment(comment.id)">
                <i class="ion-trash-a"></i>
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useArticleStore } from '../stores/article';
import { useCommentStore } from '../stores/comment';
import { useUserStore } from '../stores/user';
import dayjs from 'dayjs'
import 'highlight.js/styles/monokai.css';
// @ts-ignore
import Markdown from 'vue3-markdown-it';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  }
})

const comment = ref('')

const articleStore = useArticleStore()
const commentStore = useCommentStore()
const userStore = useUserStore()

const addComment = async (e: Event) => {
  e.preventDefault();
  if (articleStore.article?.slug) {
    await commentStore.addComment(articleStore.article.slug, comment.value)
    comment.value = ''
  }
}

const deleteComment = async (id: number) => {
  if (commentStore.deleteCommentLoading) {
    return
  }
  if (articleStore.article?.slug) {
    await commentStore.deleteComment(articleStore.article.slug, id)
  }
}

articleStore.getArticle(props.slug)
</script>