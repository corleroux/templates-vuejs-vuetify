<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <v-container fill-height v-if="showLoginForm">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar light color="primary">
              <v-toolbar-title>Login Form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  name="email"
                  label="Email"
                  type="email"
                  v-model="loginForm.email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  required
                  v-model="loginForm.password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-form>
              <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                  <p>{{ errorMsg }}</p>
                </div>
              </transition>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="toggleForm">Signup</v-btn>
              <v-btn text @click="togglePasswordReset">Forgot Password</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="secondary" :disabled="!valid" @click="login"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fill-height v-if="!showLoginForm && !showForgotPassword">
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
              <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                  <p>{{ errorMsg }}</p>
                </div>
              </transition>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="toggleForm">Login</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="secondary" :disabled="!valid" @click="signup"
                >Signup</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fill-height v-if="showForgotPassword">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar light color="primary">
              <v-toolbar-title>Reset password</v-toolbar-title>
            </v-toolbar>
            <v-card-text v-if="!passwordResetSuccess">
              <p>We will send you an email to reset your password</p>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  name="email"
                  label="Email"
                  type="email"
                  v-model="passwordForm.email"
                  :rules="emailRules"
                  required
                ></v-text-field>
              </v-form>
              <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                  <p>{{ errorMsg }}</p>
                </div>
              </transition>
            </v-card-text>
            <v-card-text v-else>
              <h1>Email Sent</h1>
              <p>Check your email for a link to reset your password</p>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="toggleForm">Login</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="secondary" :disabled="!valid" @click="resetPassword"
                >Reset Password</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
const fb = require("../plugins/firebase.ts");
export default {
  name: "Signin",
  data() {
    return {
      showLoginForm: true,
      showForgotPassword: false,
      performingRequest: false,
      passwordResetSuccess: false,
      errorMsg: "",
      valid: false,
      email: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Password must be greater than 6 characters"
      ],
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        surname: "",
        email: "",
        password: "",
        password2: ""
      },
      passwordForm: {
        email: ""
      }
    };
  },
  methods: {
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.$router.push("/dashboard");
          this.performingRequest = false;
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    signup() {
      this.performingRequest = true;
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
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    resetPassword() {
      this.performingRequest = true;

      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
      this.showForgotPassword = false;
      this.errorMsg = "";
    },
    togglePasswordReset() {
      this.showForgotPassword = !this.showForgotPassword;
      this.showLoginForm = false;
      this.errorMsg = "";
    },

    flip(par) {
      this.formEl.item = par;
      //console.log(this.formEl.item);
    }
  }
};
</script>
