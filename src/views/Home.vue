<template>

  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-for="tab in articleStore.tabs" class="nav-item">
                <span @click="articleStore.changeTab(tab)"
                  :class="{ active: articleStore.tab === tab, disabled: articleStore.articlesLoading }"
                  class="nav-link">{{
                      tab
                  }}</span>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-if="articleStore.articles.length === 0 && !articleStore.articlesLoading">No
            articles are here... yet.</div>

          <div class="article-preview" v-if="articleStore.articlesLoading">
            loading articles...</div>

          <div v-for="article in articleStore.articles" class="article-preview">
            <div class="article-meta">
              <span @click="profileStore.jumpProfile(article.author.username)">
                <img :src="article.author.image" />
              </span>
              <div class="info">
                <router-link class="author" :to="`/profile/${article.author.username}`">
                  {{ article.author.username }}
                </router-link>

                <span class="date">{{ dayjs(article.updatedAt).format('MMMM D, YYYY') }}</span>
              </div>
              <button v-if="!article.favorited" class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="articleStore.favoriteArticle(article.slug)">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
              <button v-else class="btn btn-primary btn-sm pull-xs-right"
                @click="articleStore.unfavoriteArticle(article.slug)">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <router-link :to="`/article/${article.slug}`" class="preview-link">
              <h1 class="article-title">{{ article.title }}</h1>
              <p class="description">{{ article.description }}</p>
              <span>Read more...</span>
            </router-link>
          </div>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div v-if="tagStore.loading">
              tags loading...</div>

            <div class="tag-list" v-else>
              <span v-for="tag in tagStore.tags" @click="articleStore.changeTag(tag)" class="tag-pill tag-default">{{
                  tag
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useEventListener } from '../hooks/evnet';
import { useArticleStore } from '../stores/article';
import { useTagStore } from '../stores/tag';
import dayjs from 'dayjs'
import { useProfileStore } from '../stores/profile';

const articleStore = useArticleStore()

const router = useRouter()

onMounted(() => {
  articleStore.reset()
  articleStore.setTab('Global Feed')
  if (!router.currentRoute.value.query.tag) {
    articleStore.getArticles()
    return
  }
})

const tagStore = useTagStore()
const profileStore = useProfileStore()

tagStore.getTags()

const onScroll = async (e: Event) => {
  if (articleStore.articlesLoading) {
    return
  }

  if (articleStore.articles.length === articleStore.articlesCount) {
    return
  }

  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = document.scrollingElement?.scrollTop || 0
  const scrollHeight = document.scrollingElement?.scrollHeight || 0

  if (scrollHeight - 100 < clientHeight + scrollTop) {
    articleStore.getArticles()
  }
}

useEventListener(document as any, 'scroll', onScroll)

onBeforeRouteLeave(() => {
  const articleStore = useArticleStore();
  articleStore.clearArticles();
  articleStore.clearTab();
})
</script>

<style>
.article-title,
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.description {
  display: inline-block;
  width: 100%;
}
</style>