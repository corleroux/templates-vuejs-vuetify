<template>
  <div>
    <v-app-bar color="white" dark elevate-on-scroll>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>
        <v-img src="../assets/web-logo.png" style="height: inherit;"></v-img>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  name: "AppNavigation",
  data: () => ({
    collapseOnScroll: true
  })
};
</script>

<style scoped>
</style>