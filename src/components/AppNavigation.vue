<template>
  <span>
    <v-toolbar app light>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title></v-toolbar-title>
      <v-btn text class="hidden-sm-and-down" to="/">Home</v-btn>
      <v-spacer></v-spacer>
      <v-btn text v-if="!currentUser" to="/login">Login</v-btn>
      <v-btn text v-if="currentUser" @click="logout">Logout</v-btn>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" light disable-resize-watcher>
      <v-list>
        <template v-for="(item, index) in items">
          <v-list-tile :key="index">
            <v-list-tile-content>
              {{ item.title }}
            </v-list-tile-content>
          </v-list-tile>
          <v-divider :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
  </span>
</template>
<script>
const fb = require("../plugins/firebase.ts");
import { mapState } from "vuex";
export default {
  name: "AppNavigation",
  data: () => ({
    drawer: false,
    items: [{ title: "Menu" }, { title: "Sign In" }, { title: "Join" }]
  }),
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style scoped></style>
