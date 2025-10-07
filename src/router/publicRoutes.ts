import SignupView from "@/views/admin/auth/SignupView.vue"
const publicRoutes = [
  {
    path: "/sign_up",
    name: "sign up",
    meta: {
      requiresAuth: false
    },
    component: SignupView
  }
]
export default publicRoutes