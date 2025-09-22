import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/principal",
    name: "principal",
    component: () => import("@/views/PrincipalView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth);
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (requiresAuth && !isLoggedIn) {
    next({ name: "login" });
  } else if (to.name === "login" && isLoggedIn) {
    next({ name: "principal" });
  } else {
    next();
  }
});

export default router;
