<template>
  <div class="auth-page">

    <Dialog :open="visible">
      <div class="tip">login failed!</div>
      <button class="btn btn-lg btn-primary tip-btn" @click="visible = false">ok</button>
    </Dialog>

    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link to="/register">Have an account?</router-link>
          </p>

          <ul class="error-messages">
            <li v-for="msg in errorsMessage">{{ msg }}</li>
          </ul>

          <form>
            <fieldset class="form-group">
              <input v-model="userFormData.email" class="form-control form-control-lg" type="text" placeholder="Email"
                :disabled="userStore.loading">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="userFormData.password" class="form-control form-control-lg" type="password"
                placeholder="Password" :disabled="userStore.loading">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" @click="signUp" :disabled="userStore.loading">
              Sign in
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { LoginUser } from '../apis/user';
import Schema, { Rules } from 'async-validator'
import { useUserStore } from '../stores/user';
import Dialog from '../components/Dialog/index.vue'

const errorsMessage = reactive<string[]>([])
const visible = ref(false)

const descriptor: Rules = {
  email: {
    type: 'string',
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g
        if (reg.test(value)) {
          return resolve()
        }
        reject('email invalid!')
      })
    }
  },
  password: {
    type: 'string',
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        const reg = /^[a-zA-Z0-9_]\w{5,17}$/g
        if (reg.test(value)) {
          return resolve()
        }
        reject('password must be within 6-18 characters and can only contain letters, numbers and underscores!')
      })
    }
  }
}

const validator = new Schema(descriptor)

const userFormData = reactive<LoginUser>({
  email: '',
  password: ''
})

const userStore = useUserStore()

async function signUp(e: MouseEvent) {
  e.preventDefault();
  errorsMessage.length = 0
  try {
    const result = await validator.validate(userFormData)
    visible.value = !(await userStore.login(result as LoginUser))
  } catch ({ errors, fields }: any) {
    Object.keys(fields as any).forEach(key => {
      errorsMessage.push((fields as any)[key][0].message)
    })
  }
}
</script>

<style>
.tip {
  margin-bottom: 24px;
  font-size: 24px;
  width: 200px;
  text-align: center;
}

.tip-btn {
  width: 100%;
}
</style>