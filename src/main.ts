import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";
import router from "./router";
import { store } from "./store";

const fb = require("./plugins/firebase");

Vue.config.productionTip = false;

let app;

fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      vuetify,
      render: h => h(App)
    });
  }
});
