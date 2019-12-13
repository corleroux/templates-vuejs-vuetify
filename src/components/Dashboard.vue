<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-card-text style="height: 300px;">
          <h1 class="title my-3">My Leads</h1>
          <div v-if="userLeads.length">
            <div
              v-for="(item, idx) in userLeads"
              class="subheading mb-2"
              :key="idx"
            >
              {{ item }}
              <span>{{ item.createdOn | formatDate }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-text style="height: 100px; position: relative">
          <v-btn to="/access" absolute light fab top right color="yellow">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../plugins/firebase.ts");
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "leads", "hiddenLeads"]),
    userLeads() {
      //console.log(this.$store.state.userLeads);
      return this.$store.state.userLeads;
    }
  },
  mounted() {
    this.getUserLeads();
  },
  methods: {
    getUserLeads() {
      this.$store.dispatch("getUserLeads");
    },
    showNewLeads() {
      let updatedLeadsArray = this.hiddenLeads.concat(this.leads);
      // clear hiddenPosts array and update posts array
      this.$store.commit("setHiddenLeads", null);
      this.$store.commit("setLeads", updatedLeadsArray);
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
};
</script>

<style scoped></style>
