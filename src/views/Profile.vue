<template>

  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">
          <div v-if="profileStore.profile" class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profileStore.profile.image" class="user-img" />
            <h4>{{ profileStore.profile.username }}</h4>
            <p>{{ profileStore.profile.bio }}
            </p>

            <router-link v-if="userStore.user && userStore.user.username === profileStore.profile.username"
              to="/settings" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i>
              Edit Profile Settings
            </router-link>
            <template v-else>
              <button v-if="!profileStore.profile.following" class="btn btn-sm btn-outline-secondary action-btn"
                :disabled="profileStore.followLoading"
                @click="profileStore.followUser(profileStore.profile?.username as string)">
                <i class="ion-plus-round"></i>
                &nbsp;
                Follow {{ profileStore.profile.username }}
              </button>
              <button v-else class="btn btn-sm action-btn btn-secondary" :disabled="profileStore.followLoading"
                @click="profileStore.unfollowUser(profileStore.profile?.username as string)">
                <i class="ion-plus-round"></i>
                &nbsp;
                Unfollow {{ profileStore.profile.username }}
              </button>
            </template>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-for="tab in articleStore.profileTabs" class="nav-item">
                <span @click="articleStore.changeProfileTab(tab)"
                  :class="{ active: articleStore.profileTab === tab, disabled: articleStore.articlesLoading }"
                  class="nav-link">{{
                      tab
                  }}</span>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-if="articleStore.articlesLoading">
            loading articles...</div>

          <div class="article-preview" v-else-if="articleStore.articles.length === 0">
            No articles are here... yet.</div>

          <div v-for="article in articleStore.articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <router-link :to="`/profile/${article.author.username}`">
                <img :src="article.author.image" />
              </router-link>
              <div class="info">
                <router-link :to="`/profile/${article.author.username}`" class="author">{{ article.author.username }}
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

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import dayjs from 'dayjs'
import { useProfileStore } from '../stores/profile';
import { useUserStore } from '../stores/user';
import { useArticleStore } from '../stores/article';
import { useEventListener } from '../hooks/evnet';
import { onBeforeRouteLeave } from 'vue-router';

const props = defineProps({
  username: String
})

const profileStore = useProfileStore()
const userStore = useUserStore()
const articleStore = useArticleStore()

onMounted(async () => {
  if (props.username) {
    await profileStore.getProfile(props.username)
    articleStore.changeProfileTab('My Articles')
  }
})

watch(props, async () => {
  if (props.username) {
    await profileStore.getProfile(props.username)
    articleStore.changeProfileTab('My Articles')
  }
})

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
  articleStore.clearProfileTab();
})
</script>