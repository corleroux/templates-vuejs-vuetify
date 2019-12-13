<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar light color="primary">
            <v-toolbar-title>Signup Form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                name="name"
                label="Name"
                type="text"
                v-model="signupForm.name"
                required
              ></v-text-field>
              <v-text-field
                name="surname"
                label="Surname"
                type="text"
                v-model="signupForm.surname"
                required
              ></v-text-field>
              <v-text-field
                name="email"
                label="Email"
                type="email"
                v-model="signupForm.email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                required
                v-model="signupForm.password"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                name="password2"
                label="Confirm Password"
                id="password2"
                type="password2"
                required
                v-model="signupForm.password2"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" :disabled="!valid" @click="signup"
              >Signup</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
const fb = require("../plugins/firebase.ts");
export default {
  name: "Signup",
  data() {
    return {
      valid: false,
      signupForm: {
        name: "",
        surname: "",
        email: "",
        password: "",
        password2: ""
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Password must be greater than 6 characters"
      ]
    };
  },
  methods: {
    signup() {
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          var theUser = user.user;
          // create user obj
          fb.usersCollection
            .doc(theUser.uid)
            .set({
              name: this.signupForm.name,
              surname: this.signupForm.surname,
              email: this.signupForm.email
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.$router.push("/dashboard");
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleForm() {
      this.showSignupForm = !this.showSignupForm;
    },
    flip(par) {
      this.formEl.item = par;
      //console.log(this.formEl.item);
    }
  }
};
</script>
