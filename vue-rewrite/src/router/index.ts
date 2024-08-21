import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import MainMenu from "../views/MainMenu.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/",
    component: MainMenu,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

