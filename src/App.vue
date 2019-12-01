<template>
  <v-app>
    <app-navigation></app-navigation>

    <v-content transition="slide-x-transition" class="light">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { mapState } from "vuex";
import AppNavigation from "./components/AppNavigation.vue";
export default {
  components: { AppNavigation },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style></style>
