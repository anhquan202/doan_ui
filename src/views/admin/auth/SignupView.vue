<script setup lang="ts">
import { ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from "yup"
import signupService from '@/services/admin/auth/signupService'
import { localStorageHelper } from '@/helpers/localstorageHelper'
type Form = {
	first_name: string
	last_name: string
	phone: string
	address: string
	gender: string
	date_of_birth: string
	email: string
	password: string
	password_confirmation: string
}

const submitted = ref(false)

const errorApi = ref<Record<string, string[]>>({})

const schema = yup.object({
	first_name: yup.string().required("Họ là bắt buộc"),
	last_name: yup.string().required("Tên là bắt buộc"),
	phone: yup.string().required("Số điện thoại là bắt buộc"),
	address: yup.string().required("Địa chỉ là bắt buộc"),
	gender: yup.string().required("Giới tính là bắt buộc"),
	date_of_birth: yup.date().required("Ngày sinh là bắt buộc"),
	password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
	password_confirmation: yup.string()
		.oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
		.required('Xác nhận mật khẩu là bắt buộc'),
})

async function onSubmit(values: any) {
	submitted.value = false
	errorApi.value = {}

	const payload = { ...values }

	try {
		const response = await signupService.signup(payload)
		localStorageHelper.setToken(response.token)
	} catch (failure: any) {
		console.log('❌ Signup failed:', failure.errors)
		errorApi.value = failure.errors
	} finally {
		submitted.value = false
	}
}
</script>

<template>
	<div
		class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-2xl w-full">
			<div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-200">
				<div class="text-center mb-8">
					<h2 class="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản</h2>
					<p class="text-slate-600">Vui lòng nhập thông tin để đăng ký tài khoản mới</p>
				</div>
				<div v-if="errorApi" class="text-red-600 text-sm space-y-1">
					<div v-for="(messages, field) in errorApi" :key="field">
						{{ messages.join(', ') }}
					</div>
				</div>
				<Form :validation-schema="schema" @submit="onSubmit" v-slot="{ errors: veeErrors, values }" class="space-y-6">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="first_name" class="block text-sm font-semibold text-slate-700">
								Họ <span class="text-red-500">*</span>
							</label>
							<Field id="first_name" name="first_name" v-slot="{ field }">
								<input v-bind="field" type="text" autocomplete="given-name" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.first_name
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="Nhập họ của bạn" />
							</Field>
							<ErrorMessage name="first_name" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>

						<div class="space-y-2">
							<label for="last_name" class="block text-sm font-semibold text-slate-700">
								Tên <span class="text-red-500">*</span>
							</label>
							<Field id="last_name" name="last_name" v-slot="{ field }">
								<input v-bind="field" type="text" autocomplete="family-name" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.last_name
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="Nhập tên của bạn" />
							</Field>
							<ErrorMessage name="last_name" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>
					</div>

					<div class="space-y-2">
						<label for="phone" class="block text-sm font-semibold text-slate-700">
							Số điện thoại <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							</div>
							<Field id="phone" name="phone" v-slot="{ field }">
								<input v-bind="field" type="tel" autocomplete="tel" :class="[
									'block w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.phone
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="0123 456 789" />
							</Field>
						</div>
						<ErrorMessage name="phone" v-slot="{ message }">
							<p class="text-sm text-red-600 flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd" />
								</svg>
								{{ message }}
							</p>
						</ErrorMessage>
					</div>

					<div class="space-y-2">
						<label for="address" class="block text-sm font-semibold text-slate-700">
							Địa chỉ
						</label>
						<Field id="address" name="address" v-slot="{ field }">
							<textarea v-bind="field" rows="3" :class="[
								'block w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none',
								veeErrors.address
									? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
									: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
								'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
							]" placeholder="Nhập địa chỉ của bạn"></textarea>
						</Field>
						<ErrorMessage name="address" v-slot="{ message }">
							<p class="text-sm text-red-600 flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd" />
								</svg>
								{{ message }}
							</p>
						</ErrorMessage>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="gender" class="block text-sm font-semibold text-slate-700">
								Giới tính <span class="text-red-500">*</span>
							</label>
							<Field id="gender" name="gender" v-slot="{ field }">
								<select v-bind="field" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200 appearance-none bg-white',
									veeErrors.gender
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900'
								]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem;">
									<option value="">Chọn giới tính</option>
									<option value="male">Nam</option>
									<option value="female">Nữ</option>
									<option value="other">Khác</option>
								</select>
							</Field>
							<ErrorMessage name="gender" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>

						<div class="space-y-2">
							<label for="date_of_birth" class="block text-sm font-semibold text-slate-700">
								Ngày sinh <span class="text-red-500">*</span>
							</label>
							<Field id="date_of_birth" name="date_of_birth" v-slot="{ field }">
								<input v-bind="field" type="date" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.date_of_birth
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900'
								]" />
							</Field>
							<ErrorMessage name="date_of_birth" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>
					</div>

					<div class="space-y-2">
						<label for="email" class="block text-sm font-semibold text-slate-700">
							Email <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
								</svg>
							</div>
							<Field id="email" name="email" v-slot="{ field }">
								<input v-bind="field" type="email" autocomplete="email" :class="[
									'block w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.email
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="example@email.com" />
							</Field>
						</div>
						<ErrorMessage name="email" v-slot="{ message }">
							<p class="text-sm text-red-600 flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd" />
								</svg>
								{{ message }}
							</p>
						</ErrorMessage>
					</div>

					<!-- Password Fields -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="password" class="block text-sm font-semibold text-slate-700">
								Mật khẩu <span class="text-red-500">*</span>
							</label>
							<Field id="password" name="password" v-slot="{ field }">
								<input v-bind="field" type="password" autocomplete="new-password" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.password
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="••••••••" />
							</Field>
							<ErrorMessage name="password" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>

						<div class="space-y-2">
							<label for="password_confirmation" class="block text-sm font-semibold text-slate-700">
								Xác nhận mật khẩu <span class="text-red-500">*</span>
							</label>
							<Field id="password_confirmation" name="password_confirmation" v-slot="{ field }">
								<input v-bind="field" type="password" autocomplete="new-password" :class="[
									'block w-full px-4 py-3 rounded-lg border transition-all duration-200',
									veeErrors.password_confirmation
										? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
										: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
									'focus:ring-4 focus:outline-none text-slate-900 placeholder:text-slate-400'
								]" placeholder="••••••••" />
							</Field>
							<ErrorMessage name="password_confirmation" v-slot="{ message }">
								<p class="text-sm text-red-600 flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd" />
									</svg>
									{{ message }}
								</p>
							</ErrorMessage>
						</div>
					</div>

					<div class="pt-4">
						<button type="submit"
							class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Đăng ký tài khoản
						</button>
					</div>

					<div v-if="submitted" class="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
						<svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd" />
						</svg>
						<p class="text-sm font-medium text-green-800">Đã gửi thành công! Kiểm tra console để xem chi tiết.</p>
					</div>
				</Form>

				<div class="mt-6 text-center">
					<p class="text-sm text-slate-600">
						Đã có tài khoản?
						<a href="sign_in" class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
							Đăng nhập ngay
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
