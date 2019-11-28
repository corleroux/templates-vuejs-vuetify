import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "#FFEB3B",
        accent: "#FF4081",
        secondary: "#ffe18d",
        success: "#4CAF50",
        info: "#2196F3",
        warning: "#FB8C00",
        error: "#FF5252"
      },
      light: {
        primary: "#FFEB3B",
        accent: "#F44336",
        secondary: "#000000",
        success: "#4CAF50",
        info: "#2196F3",
        warning: "#FB8C00",
        error: "#FF5252"
      }
    }
  }
});
