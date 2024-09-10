import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import MainMenu from "@/views/MainMenu.vue"

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
        name: "Home",
      },
      {
        path: "calendar",
        component: () => import("@/views/Calendar.vue"),
        name: "Calendar",
      },
      {
        path: "symptoms",
        component: () => import("@/views/SymptomsList.vue"),
        name: "Symptoms",
      },
      {
        path: "help",
        component: () => import("@/views/Help.vue"),
        name: "Help",
      },
      {
        path: "settings",
        component: () => import("@/views/Settings.vue"),
        name: "Settings",
      },
      {
        path: "/notes",
        component: () => import("@/views/NotesList.vue"),
        name: "Notes",
      },
      {
        path: "/meds",
        component: () => import("@/views/MedList.vue"),
        name: "Meds",
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
