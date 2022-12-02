<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">conduit</router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <router-link class="nav-link" :class="{ active: route.path === '/' }" to="/">Home</router-link>
        </li>
        <template v-if="userStore.isLogin">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: route.path.includes('/editor') }" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: route.path.includes('/settings') }" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item avatar">
            <router-link class="nav-link" :to="`/profile/${userStore.user.username}`">
              <img class="user-pic" :src="userStore.user.image" :alt="userStore.user.username" />&nbsp;{{
                  userStore.user.username
              }}
            </router-link>
            <div class="menu">
              <span @click="userStore.signOut">logout</span>
            </div>
          </li>
        </template>
        <template v-else-if="!userStore.loading">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Sign up</router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user';

const route = useRoute()

const userStore = useUserStore();
userStore.getUser()
</script>

<style>
.menu {
  display: none;
  box-shadow: 10px 0px 10px rgb(0 0 0 / 10%);
  border-radius: 4px;
  padding: 6px 8px;
  position: absolute;
  background-color: white;
  cursor: pointer;
}

.avatar:hover .menu {
  display: flex;
}
</style>