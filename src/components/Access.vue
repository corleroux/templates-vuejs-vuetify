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
    <v-form ref="form">
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
            <v-text-field
              v-model="lead.customer.name"
              label="Firstname"
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.surname"
              label="Surname"
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.idnumber"
              label="ID Number"
            ></v-text-field>
            <v-text-field
              v-model="lead.customer.contactnumber"
              label="Contact Number"
            ></v-text-field>
            <v-checkbox
              v-model="lead.property.hasBankAccount"
              label="Does the client have a personal bank account?"
            ></v-checkbox>

            <v-btn text color="secondary">Save for later</v-btn>
            <v-btn color="primary" @click="e1 = 2">Continue</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-text-field
              v-model="lead.address.suburb"
              label="Suburb"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.area"
              label="Area"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.province"
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
            <v-btn text color="secondary">Save for later</v-btn>
            <v-btn color="primary" @click="e1 = 3">Continue</v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
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
              label="-----"
              required
              >What type of roof does the propery have?</v-select
            >
            <v-select
              v-model="lead.property.roofType"
              item-text="text"
              item-value="value"
              :items="roofTypeOptions"
              label="-----"
              required
            ></v-select>

            <v-textarea
              v-model="lead.property.propertyDescription"
              name="propertyDescription"
              label="Describe the property in less than 2000 words"
            ></v-textarea>

            <v-btn color="primary" @click.prevent="submitToStore">Submit</v-btn>
            <v-btn text color="secondary">Save for later</v-btn>
            <v-btn text @click="e1 = 2">Back</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-form>
  </div>
</template>

<script>
const fb = require("../plugins/firebase.ts");
export default {
  data() {
    return {
      e1: 0,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      customerTypeKnown: false,
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
  methods: {
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
      var userId = this.$store.currentUser.uid;
      fb.leadsCollection
        .doc(theUser.uid)
        .set({
          lead: this.lead
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped></style>
