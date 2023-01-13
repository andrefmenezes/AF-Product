<template>
  <v-row justify="center">
    <v-dialog v-model="showModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Registre-se</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <label for="username">Nome *</label>
                <v-text-field
                  name="username"
                  type="text"
                  required
                  v-model="signupData.username"
                  >></v-text-field
                >
              </v-col>
              <v-col cols="12">
                <label for="email">Email</label>
                <v-text-field
                  name="email"
                  type="text"
                  required
                  v-model="signupData.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <label for="password">Senha</label>
                <v-text-field
                  name="password"
                  type="text"
                  required
                  v-model="signupData.password"
                ></v-text-field>
              </v-col>
              <small style="color: red" class="pl-3"
                >* Indica que o campo é obrigatório</small
              >
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="changeState(false)">
            Fechar
          </v-btn>
          <v-btn color="blue darken-1" text @click="register()">
            Registrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import userService from "../../../services/userService";
import Vue from "vue";
export default {
  name: "register-modal",
  props: ["showModal"],
  data() {
    return {
      signupData: {},
    };
  },
  methods: {
    changeState(state) {
      this.signupData = {};
      this.$emit("changeState", state);
    },
    register() {
      userService
        .create(this.signupData)
        .then((response) => {
          Vue.toasted.success("Usuário cadastrado!", {
            icon: {
              name: "exclamation",
            },
            duration: "7000",
            position: "bottom-right",
          });
          this.changeState(false);
        })
        .catch((error) => {
          Vue.toasted.error(error.response.data.message, {
            icon: {
              name: "exclamation",
            },
            duration: "7000",
            position: "bottom-right",
          });
        });
    },
  },
  created() {},
};
</script>

<style scoped>
.custom-placeholer-color input,
.custom-label-color input {
  color: red !important;
}
</style>
