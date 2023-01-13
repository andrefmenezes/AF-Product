<template>
  <v-row justify="center">
    <v-dialog v-model="showEditCategoryModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edição de categoria</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <label for="code">Código da categoria *</label>
                <v-text-field
                  name="code"
                  type="text"
                  required
                  v-model="category.code"
                  >></v-text-field
                >
              </v-col>
              <v-col cols="12">
                <label for="name">Nome da categoria *</label>
                <v-text-field
                  name="name"
                  type="text"
                  required
                  v-model="category.name"
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
          <v-btn color="blue darken-1" text @click="editCategory(category)">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import categoryService from "../../../services/categoryService";
import Vue from "vue";
export default {
  name: "edit-category-modal",
  props: {
    showEditCategoryModal: undefined,
    categoryToEdit: undefined,
  },
  data() {
    return {
      category: {},
    };
  },
  methods: {
    changeState(state) {     
      this.category = {};
      this.$emit("changeState", state);
    
    },
    editCategory(category) {
      let body = {
        updateCategoryData: {
          _id: category._id,
          code: category.code,
          name: category.name,
        },
      };
      categoryService
        .edit(body)
        .then((response) => {
          Vue.toasted.success("Categoria editada!", {
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
  watch: {
    categoryToEdit() {
      this.category = this.categoryToEdit;
    },
  },
 
};
</script>

<style scoped>
.custom-placeholer-color input,
.custom-label-color input {
  color: red !important;
}
</style>
