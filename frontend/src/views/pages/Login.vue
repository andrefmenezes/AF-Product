<template>
  <v-container
    fluid
    tag="section"
    style="background-color: #31adb3; height: 100%"
  >
    <div id="login" tag="section" grid-list-md text-xs-center>
      <v-row align="center" justify="center">
        <v-col cols="8" sm="4" md="6">
          <v-card class="elevation-12 text-center" md="6">
            <v-row align="center" justify="center">
              <v-col>
                <h4
                  style="
                    color: #31adb3;
                    font-size: 20px;
                    height: 35px;
                    padding-top: 10px;
                  "
                >
                  Login
                </h4>
                <v-card-text>
                  <v-form @submit.prevent="login">
                    <v-text-field
                      label="Usuário"
                      name="login"
                      prepend-icon="person"
                      type="text"
                      v-model="username"
                    />

                    <v-text-field
                      id="password"
                      label="Senha"
                      name="password"
                      prepend-icon="lock"
                      type="password"
                      v-model="senha"
                    />
                    <v-btn
                      type="submit"
                      style="margin-bottom: 25px"
                      color="#31adb3"
                      >Entrar</v-btn
                    >
                  </v-form>
                </v-card-text>
              </v-col>
              <v-col>
                <v-avatar color="#D3D3D3	" size="180">
                  <v-img
                    contain
                    :src="require('../../assets/logo.png')"
                    style="border-radius: 10px"
                  >
                  </v-img>
                </v-avatar>
                <a  @click="showModal = true" class="register"
                  >Registre-se</a
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <register-modal :showModal="showModal" @changeState="changeModalState" />
  </v-container>
</template>

<script>
import RegisterModal from "../components/register-components/RegisterModal.vue";
export default {
  components: {
    RegisterModal,
  },
  data() {
    return {
      showModal: false,
      username: "",
      senha: "",
    };
  },
  methods: {
    changeModalState(state) {
      this.showModal = state;     
    },
    login() {
      try {
        this.$store.dispatch("login", {
        username: this.username,
        password: this.senha,
      });
      } catch (error) {
        console.log('www')
        console.log('error',error)
      }
     
    },
  },

  //
};
</script>
<style>
#login {
  margin-top: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 8px;
}
</style>
