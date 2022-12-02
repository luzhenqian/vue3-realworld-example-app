<template>

  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture"
                  :disabled="userStore.updateLoading" v-model="userStore.editUser.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name"
                  :disabled="userStore.updateLoading" v-model="userStore.editUser.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"
                  :disabled="userStore.updateLoading" v-model="userStore.editUser.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email"
                  :disabled="userStore.updateLoading" v-model="userStore.editUser.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password"
                  :disabled="userStore.updateLoading" v-model="userStore.editUser.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click="updateUser"
                :disabled="userStore.updateLoading">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore()
watchEffect(() => {
  userStore.syncEditUser()
})

const updateUser = (e: Event) => {
  e.preventDefault();
  userStore.updateUser();
}

</script>