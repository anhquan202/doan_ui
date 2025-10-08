import SignInView from "@/views/admin/auth/SignInView.vue"
import SignupView from "@/views/admin/auth/SignupView.vue"
const publicRoutes = [
  {
    path: "/sign_up",
    name: "sign up",
    meta: {
      requiresAuth: false
    },
    component: SignupView
  },
  {
    path: "/sign_in",
    name: "sign in",
    meta: {
      requiresAuth: false
    },
    component: SignInView
  }
]
export default publicRoutes