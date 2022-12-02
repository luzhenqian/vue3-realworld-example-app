<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>

          <ul class="error-messages">
            <li v-for="msg in errorsMessage">{{ msg }}</li>
          </ul>

          <form>
            <fieldset class="form-group">
              <input v-model="userFormData.username" class="form-control form-control-lg" type="text"
                placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="userFormData.email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="userFormData.password" class="form-control form-control-lg" type="password"
                placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" @click="signUp">
              Sign up
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { registration, User } from '../apis/user';
import Schema, { Rules } from 'async-validator'

const errorsMessage = reactive<string[]>([])

const descriptor: Rules = {
  username: {
    type: 'string',
    required: true,
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value.length >= 6 && value.length <= 24) {
          return resolve()
        }
        reject('username length must be 6-24 characters!')
      })
    }
  },
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

const userFormData = reactive<User>({
  username: '',
  email: '',
  password: ''
})

async function signUp(e: MouseEvent) {
  e.preventDefault();
  errorsMessage.length = 0
  try {
    const result = await validator.validate(userFormData)
    try {
      const data = await registration(result as User)
      return alert('register success!')
    } catch (e) {
      alert('register failed！')
    }
  } catch ({ errors, fields }: any) {
    Object.keys(fields as any).forEach(key => {
      errorsMessage.push((fields as any)[key][0].message)
    })
  }
}
</script>