<script setup lang="ts">
import { ref } from 'vue'
import * as yup from "yup"
import { Field, Form, ErrorMessage } from 'vee-validate'
import { localStorageHelper } from '@/helpers/localstorageHelper'
import { useRouter } from 'vue-router'
import signinService from '@/services/admin/auth/signinService'
import router from '@/router'

type Form = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc')
})

const errorApi = ref("")

const handleSubmit = async (values: Form) => {
  try {
    const result = await signinService(values)
    localStorageHelper.setToken(result.token)
    router.push({ name: 'rooms' })
  } catch (error: any) {
    errorApi.value = error.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p class="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        <div v-if="errorApi" class="text-red-500 text-sm mt-2">{{ errorApi }}</div>

        <Form :validation-schema="schema" @submit="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Field name="email" v-slot="{ field }">
              <input v-bind="field" id="email" type="email" required placeholder="example@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
            </Field>
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <Field name="password" v-slot="{ field }">
              <input v-bind="field" id="password" type="password" required placeholder="••••••••"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
            </Field>
            <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
          </div>

          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Đăng nhập
          </button>
        </Form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Chưa có tài khoản?
            <a href="sign_up" class="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
