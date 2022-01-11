<template>
  <v-container fluid>
    <v-snackbar
      top
      right
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2000"
      >{{ snackbar.message }}</v-snackbar
    >
    <div class="div1 d-flex justify-center align-center flex-column">
      <h2>Login</h2>
      <div class="py-5" style="text-align: center">
        <v-text-field
          outlined
          class="input1"
          v-model="user.username"
          style="width: 400px; border-radius: 10px"
          placeholder="set username"
          label="set username"
          prepend-inner-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          outlined
          class="input1"
          v-model="user.password"
          style="width: 400px; border-radius: 10px"
          placeholder="set password"
          label="set password"
          prepend-inner-icon="mdi-lock"
          @keyup.enter="login"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          class="btn1"
          dark
          color="success"
          @click="login"
          :disabled="user.username.length < 1 || user.password.length < 1"
          >Login</v-btn
        >
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "login-page",
  data() {
    return {
      snackbar: {
        show: false,
        color: "",
        message: "",
      },
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("login", ["fetchLogin"]),
    async login() {
      try {
        await this.fetchLogin(this.user);
        this.$router.push("/");
      } catch (e) {
        this.snackbar.show = true;
        this.snackbar.color = "error";
        this.snackbar.message = "Parol yoki foydalanuvchi nomi xato";
        this.username = "";
        this.password = "";
      }
    },
  },
};
</script>
<style>
.div1 {
  padding: 20px 20px;
  box-shadow: 5px 5px 20px;
  min-width: 400px;
  max-width: 500px;
  margin: 30vh auto;
  border-radius: 10px;
}
.btn1 {
  width: 150px;
  /*float: right;*/
}
</style>