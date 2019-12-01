import Vue from "vue";
import Vuex from "vuex";
const fb = require("./plugins/firebase");

Vue.use(Vuex);
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit("setUserProfile", doc.data());
    });
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    userLeads: []
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setUserLeads", null);
    },

    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUserLeads({ state, commit }) {
      var citiesRef = fb.db
        .collection("leads")
        .where("userId", "==", store.state.currentUser.uid)
        .orderBy("createdOn", "desc")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            store.commit("setUserLeads", doc.data());
            console.log(doc.id, " => ", doc.data());
            console.log(store.state.currentUser.uid);
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
      return citiesRef;
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setUserLeads(state, payload) {
      state.userLeads.push(payload);
    }
  }
});
