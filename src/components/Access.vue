<template xmlns:v-gmaps-searchbox="http://www.w3.org/1999/xhtml">
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
              v-model="lead.customer.forename"
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
            <span v-if="lead.customer.idtype == '2'">
              <v-menu
                v-model="birthdatemenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="lead.customer.birthdate"
                    label="Bithdate"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="lead.customer.birthdate"
                  @input="birthdatemenu = false"
                ></v-date-picker>
              </v-menu>
            </span>
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
            <input v-model="vm.searchPlace" v-gmaps-searchbox:location="vm" />
            <v-text-field
              v-model="vm.location.formatted_address"
            ></v-text-field>
            <!--
            <v-text-field
              v-model="lead.address.suburb"
              label="Suburb"
              :rules="nameRules"
            ></v-text-field>
            <v-text-field
              v-model="lead.address.area"
              :rules="nameRules"
              label="City"
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
            -->
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
              v-model="lead.property.walltype"
              item-text="text"
              item-value="value"
              :items="wallTypeOptions"
              label="Wall Type"
              :rules="[v => !!v || 'Wall Type is required']"
              required
              >What type of roof does the propery have?</v-select
            >
            <v-select
              v-model="lead.property.rooftype"
              item-text="text"
              item-value="value"
              :items="roofTypeOptions"
              label="Roof Type"
              :rules="[v => !!v || 'Roof Type is required']"
              required
            ></v-select>

            <span v-if="!lead.property.isMainDwelling">
              <v-textarea
                v-model="lead.property.propertyDescription"
                name="propertyDescription"
                label="Describe the property in less than 2000 words"
              ></v-textarea>
            </span>
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
      birthdatemenu: false,
      nameRules: [v => !!v || "This field is required"],
      myaddress: {},
      vm: {
        searchPlace: "",
        location: {
          formatted_address: ""
        }
      },
      lead: {
        readyForProcessing: "",
        timestamp: "",
        customer: {
          idnumber: "",
          forename: "",

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
          streetnumber: "",
          streetname: ""
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
        {
          value: "I",
          text: "SA ID"
        },
        {
          value: "P",
          text: "Passport"
        }
      ],
      roofTypeOptions: [
        {
          value: "ASBESTOS",
          text: "Asbestos"
        },
        {
          value: "CONCRETE",
          text: "Concrete"
        },
        {
          value: "IRON/ZINC",
          text: "Corrugated Iron / Zinc"
        },
        {
          value: "SHINGLES",
          text: "Shingles"
        },
        {
          value: "SLATE",
          text: "Slate"
        },
        {
          value: "THATCH_TRE",
          text: "Thatch treated"
        },
        {
          value: "TILES",
          text: "Tiles"
        },
        {
          value: "WOOD",
          text: "Wood"
        }
      ],
      wallTypeOptions: [
        {
          value: "ASBESTOS",
          text: "Asbestos"
        },
        {
          value: "BRICK_CONC",
          text: "Brick / Concrete"
        },
        {
          value: "PREFAB",
          text: "Prefab"
        },
        {
          value: "WOOD",
          text: "Wood"
        }
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
    formatAddress(ggl_address) {
      var address_components = ggl_address.address_components;
      var ShouldBeComponent = {
        streetnumber: ["street_number"],
        //postal_code: ["postal_code"],
        streetname: ["street_address", "route"],
        province: [
          "administrative_area_level_1",
          "administrative_area_level_2",
          "administrative_area_level_3",
          "administrative_area_level_4",
          "administrative_area_level_5"
        ],
        suburb: [
          "sublocality",
          "sublocality_level_1",
          "sublocality_level_2",
          "sublocality_level_3",
          "sublocality_level_4"
        ],
        area: ["locality"]
        //country: ["country"]
      };

      var address = {
        latitude: 0,
        longitude: 0,
        suburb: "",
        area: "",
        province: "",
        streetnumber: "",
        streetname: ""
      };
      address_components.forEach(component => {
        for (var shouldBe in ShouldBeComponent) {
          if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
            if (shouldBe === "country") {
              address[shouldBe] = component.short_name;
            } else {
              address[shouldBe] = component.long_name;
            }
          }
        }
      });
      address.latitude = ggl_address.geometry.location.lat();
      address.longitude = ggl_address.geometry.location.lng();
      this.lead.address = address;
    },
    submitToStore() {
      this.formatAddress(this.vm.location);
      //var userId = this.$store.currentUser.uid;
      fb.leadsCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          userName: this.userProfile.name + " " + this.userProfile.surname,
          userEmail: this.userProfile.email,
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
