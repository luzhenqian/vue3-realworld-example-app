<template>

  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">

          <ul class="error-messages">
            <li v-for="error in articleStore.publishArticleErrorsMessage">{{ error }}</li>
          </ul>

          <form v-if="!route.params.slug">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="articleStore.publishArticle.title" type="text" class="form-control form-control-lg"
                  placeholder="Article Title" :disabled="articleStore.publishArticleLoading">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="articleStore.publishArticle.description" type="text" class="form-control"
                  placeholder="What's this article about?" :disabled="articleStore.publishArticleLoading">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="articleStore.publishArticle.body" class="form-control" rows="8"
                  placeholder="Write your article (in markdown)"
                  :disabled="articleStore.publishArticleLoading"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" @keyup.enter="articleStore.addTag"
                  :disabled="articleStore.publishArticleLoading">
                <div class="tag-list">
                  <span v-for="tag in articleStore.publishArticle.tagList" class="tag-default tag-pill">
                    <i class="ion-close-round" @click="articleStore.removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="articleStore.createArticle"
                :disabled="articleStore.publishArticleLoading">
                Publish Article
              </button>
            </fieldset>
          </form>

          <form v-else>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="articleStore.publishArticle.title" type="text" class="form-control form-control-lg"
                  placeholder="Article Title" :disabled="articleStore.publishArticleLoading">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="articleStore.publishArticle.description" type="text" class="form-control"
                  placeholder="What's this article about?" :disabled="articleStore.publishArticleLoading">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="articleStore.publishArticle.body" class="form-control" rows="8"
                  placeholder="Write your article (in markdown)"
                  :disabled="articleStore.publishArticleLoading"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" @keyup.enter="articleStore.addTag"
                  :disabled="articleStore.publishArticleLoading">
                <div class="tag-list">
                  <span v-for="tag in articleStore.publishArticle.tagList" class="tag-default tag-pill">
                    <i class="ion-close-round" @click="articleStore.removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button"
                @click="articleStore.editArticleStepTwo(route.params.slug as string)"
                :disabled="articleStore.publishArticleLoading">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useArticleStore } from '../stores/article';

const articleStore = useArticleStore()
const route = useRoute()

onBeforeRouteLeave(() => {
  const articleStore = useArticleStore();
  articleStore.resetEditArticle();
})

onMounted(() => {
  if (route.params.slug) {
    if (!!!articleStore.publishArticle.title) {
      articleStore.getEditArticle(route.params.slug as string)
    }
  }
})
</script>