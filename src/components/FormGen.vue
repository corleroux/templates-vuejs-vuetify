<template>
  <v-form v-model="formValid">
    <v-jsonschema-form
      v-if="schema"
      :schema="schema"
      :model="dataObject"
      :options="options"
      @error="showError"
      @change="showChange"
      @input="showInput"
    />
  </v-form>
</template>

<script>
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Draggable from "vuedraggable";
import axios from "axios";
import VueAxios from "vue-axios";
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";
import VJsonschemaForm from "@koumoul/vuetify-jsonschema-form";
import "@koumoul/vuetify-jsonschema-form/dist/main.css";
import { Sketch } from "vue-color";

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

Vue.component("swatches", Swatches);
Vue.component("draggable", Draggable);
Vue.component("color-picker", Sketch);

export default {
  components: { VJsonschemaForm },
  data() {
    return {
      schema: {
        $id: "https://example.com/person.schema.json",
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Person",
        description:
          "A few metadata about some person. Rendered as a form by [vuetify-jsonschema-form](https://github.com/koumoul-dev/vuetify-jsonschema-form).",
        type: "object",
        required: ["firstName", "lastName"],
        properties: {
          type: {
            type: "string",
            const: "person"
          },
          firstName: {
            type: "string",
            description:
              "\nThe person's first name.\n\nThis description can be a long text with markdown content.\n\n  - a list item\n  - another one\n  ",
            "x-class": "sm6 pr-4"
          },
          lastName: {
            type: "string",
            description: "The person's last name.",
            "x-class": "sm6"
          },
          password: {
            type: "string",
            "x-display": "password"
          },
          age: {
            description:
              "Age in years which must be equal to or greater than zero.",
            type: "integer",
            minimum: 0,
            maximum: 150
          },
          ageSlider: {
            description: "Same age, but in a slider.",
            type: "integer",
            "x-display": "slider",
            minimum: 0,
            maximum: 150
          },
          internalKey: {
            description:
              "A property managed only internally by programs and hidden from user",
            type: "string",
            "x-display": "hidden"
          },
          citizen: {
            description: "Is this person a citizen of this country.",
            type: "boolean"
          },
          description: {
            description: "A longer text for the description.",
            type: "string",
            maxLength: 2000
          },
          homepage: {
            description:
              "A long string also, but display is forced on single line",
            type: "string",
            maxLength: 2000,
            "x-display": "single-line"
          }
        }
      },
      dataObject: {},
      formValid: false,
      options: {
        debug: false,
        disableAll: false,
        autoFoldObjects: true
      }
    };
  },
  methods: {
    showError(err) {
      window.alert(err);
    },
    showChange(e) {
      console.log('"change" event', e);
    },
    showInput(e) {
      console.log('"input" event', e);
    }
  }
};
</script>
