<template>
  <div>
    <v-row justify="center" v-show="!lead.customer.idtype">
      <v-btn color="primary" dark @click.stop="dialog = true"
        >Open Dialog</v-btn
      >
      <v-dialog v-model="dialog" max-width="350">
        <v-card>
          <v-card-title class="headline"></v-card-title>
          <v-card-text>
            Will this quote be for an SA Citizen or a Foreign National? Please
            select below:
            <v-select
              v-model="lead.customer.idtype"
              item-text="text"
              item-value="value"
              :items="idtypeOptions"
              label="-----"
              required
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-2" text @click="dialog = false"
              >Cancel</v-btn
            >
            <v-btn color="primary" text @click="dialog = false"
              >Get Started</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-stepper v-model="e1" v-show="lead.customer.idtype">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1"
          >Personal Details</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2"
          >Address Details</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step step="3">Building Details</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form ref="form1" v-model="valid" lazy-validation>
            <v-text-field
              v-model="lead.customer.name"
              label="Firstname"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.surname"
              label="Surname"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.idnumber"
              label="ID Number"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.contactnumber"
              label="Contact Number"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-checkbox
              v-model="lead.property.hasBankAccount"
              label="Does the client have a personal bank account?"
            ></v-checkbox>

            <!-- <v-btn text color="secondary">Save for later</v-btn> -->
            <v-btn color="primary" @click="validate1(2)">Continue</v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-form ref="form2" v-model="valid" lazy-validation>
            <v-text-field
              v-model="lead.address.suburb"
              label="Suburb"
              :rules="nameRules"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.area"
              :rules="nameRules"
              label="Area"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.province"
              :rules="nameRules"
              label="Province"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.streetname"
              label="StreetName"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.streetnumber"
              label="StreetNumber"
            ></v-text-field>
            <v-btn text @click="e1 = 1">Back</v-btn>
            <!-- <v-btn text color="secondary">Save for later</v-btn> -->
            <v-btn color="primary" @click="validate2(3)">Continue</v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-form ref="form3" v-model="valid" lazy-validation>
            <v-checkbox
              v-model="lead.property.isHomeOwner"
              label="Does the client own this property?"
            ></v-checkbox>

            <v-checkbox
              v-model="lead.property.isMainDwelling"
              label="Is this property the client's main residence?"
            ></v-checkbox>

            <v-select
              v-model="lead.property.wallType"
              item-text="text"
              item-value="value"
              :items="wallTypeOptions"
              label="Wall Type"
              :rules="[v => !!v || 'Wall Type is required']"
              required
              >What type of roof does the propery have?</v-select
            >
            <v-select
              v-model="lead.property.roofType"
              item-text="text"
              item-value="value"
              :items="roofTypeOptions"
              label="Roof Type"
              :rules="[v => !!v || 'Roof Type is required']"
              required
            ></v-select>

            <v-textarea
              v-model="lead.property.propertyDescription"
              name="propertyDescription"
              label="Describe the property in less than 2000 words"
            ></v-textarea>

            <v-btn text @click="e1 = 2">Back</v-btn>
            <v-btn color="primary" :disabled="!valid" @click="validate3(4)"
              >Submit</v-btn
            >
            <!-- <v-btn text color="secondary">Save for later</v-btn> -->
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapState } from "vuex";

const fb = require("../plugins/firebase.ts");

export default {
  data() {
    return {
      valid: true,
      e1: 0,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      customerTypeKnown: false,
      nameRules: [v => !!v || "This field is required"],
      lead: {
        readyForProcessing: "",
        timestamp: "",
        customer: {
          idnumber: "",
          firstname: "",

          surname: "",
          contactnumber: "",
          idtype: "",
          birthdate: "",
          hasBankAccount: ""
        },
        address: {
          latitude: "",
          longitude: "",
          suburb: "",
          area: "",
          province: "",
          streetNumber: "",
          streetName: ""
        },
        property: {
          isHomeOwner: "",
          rooftype: "",
          walltype: "",
          isMainDwelling: "",
          propertyDescription: ""
        }
      },
      idtypeOptions: [
        { value: 1, text: "SA Citizen" },
        { value: 2, text: "Foreign National" }
      ],
      roofTypeOptions: [
        { value: 1, text: "Roof One" },
        { value: 2, text: "Roof Two" }
      ],
      wallTypeOptions: [
        { value: 1, text: "Wall One" },
        { value: 2, text: "Wall Two" }
      ],
      e1: 1,
      steps: 2,
      vertical: false,
      altLabels: false,
      editable: true
    };
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  methods: {
    validate1(n) {
      if (this.$refs.form1.validate()) {
        this.snackbar = true;
        this.e1 = n;
      }
    },
    validate2(n) {
      if (this.$refs.form2.validate()) {
        this.snackbar = true;
        this.e1 = n;
      }
    },
    validate3(n) {
      if (this.$refs.form3.validate()) {
        this.snackbar = true;
        this.submitToStore();
      }
    },
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    submitToStore() {
      //var userId = this.$store.currentUser.uid;
      fb.leadsCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          userName: this.userProfile.name + " " + this.userProfile.surname,
          userEmail: this.userProfile.userEmail,
          lead: this.lead
        })
        .then(ref => {
          this.lead = {};
          this.$router.push("/dashboard");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped></style>
