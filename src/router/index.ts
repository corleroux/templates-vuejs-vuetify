import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";
import Dashboard from "@/components/Dashboard.vue";
import Settings from "@/components/Settings.vue";
import Access from "@/components/Access.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/access"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/access",
    name: "Access",
    component: Access,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
