import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
      },
      {
        path: "reports",
        name: "Reports",
        component: () => import("@/views/reports/ReportsView.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/management/UsersView.vue"),
      },
      {
        path: "items",
        name: "Items",
        component: () => import("@/views/management/ItemsView.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth !== false,
  );

  // Initialize auth state on first load if token exists but no user
  if (authStore.token && !authStore.user) {
    authStore.initializeAuth();
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && authStore.isAuthenticated) {
    // Redirect to home if trying to access login while authenticated
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
