<template>
  <v-container id="tags" fluid tag="section">
    <base-material-card color="#0088ff" class="px-5 py-3">
      <template v-slot:heading>
        <v-row justify="space-between">
          <v-col cols="6" style="font-size: 20px; font-weight: bold">
            Categorias cadastradas
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn color="#a0a0a0" @click="showCategoryModal = true"
              >Criar Categoria</v-btn
            >
          </v-col>
        </v-row>
      </template>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :sort-desc.sync="sortDesc"
          :items-per-page="10"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.code }}</td>
              <td>
                <v-icon
                  style="cursor: pointer"
                  @click="deleteCategory(item._id)"
                  >mdi-delete</v-icon
                >
                <v-icon
                  style="cursor: pointer; margin-left: 5px"
                  @click="
                    showEditCategoryModal = true;
                    editInfo(item);
                  "
                  >mdi-pencil</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </base-material-card>
    <!-- MODAL -->
    <create-category-modal
      :showCategoryModal="showCategoryModal"
      @changeState="changeModalState"
    />
    <edit-category-modal
      :showEditCategoryModal="showEditCategoryModal"
      :categoryToEdit="categoryToEdit"
      @changeState="changeEditModalState"
    />
  </v-container>
</template>

<script>
//Vue:
import Vue from "vue";
import Swal from "sweetalert2";
// Modal:
import CreateCategoryModal from "./components/category-components/CreateCategory.vue";
import EditCategoryModal from "./components/category-components/EditCategory.vue";

// Service:
import categoryService from "../services/categoryService";

export default {
  name: "Category",
  components: {
    CreateCategoryModal,
    EditCategoryModal,
  },
  data() {
    return {
      sortDesc: true,
      showCategoryModal: false,
      showEditCategoryModal: false,
      categoryToEdit: {},
      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name",
        },
        { text: "Código", value: "code" },
        { text: "Ações", value: "" },
      ],
      items: undefined,
    };
  },
  methods: {
    changeModalState(state, category) {
      this.showCategoryModal = state;
      this.getAllCategorys();
    },
    changeEditModalState(state) {
      this.showEditCategoryModal = state;
      this.getAllCategorys();
    },
    getAllCategorys() {
      categoryService
        .getAll()
        .then((response) => {
          this.items = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editInfo(category) {
      this.categoryToEdit = JSON.parse(JSON.stringify(category));
    },
    deleteCategory(id) {
      Swal.fire({
      text: "Você tem certeza que deseja deletar essa categoria ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "rgb(92, 92, 92)",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          categoryService
            .delete(id)
            .then((response) => {
              Swal.fire("Deletado!", "", "success");
              this.getAllCategorys();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
  },
  created() {
    this.getAllCategorys();
  },
};
</script>
<style>
.custom.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
  font-size: 12px !important;
}
.custom.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
  font-size: 12px !important;
}
</style>
