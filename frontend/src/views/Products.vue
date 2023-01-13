<template>
  <v-container id="products" fluid product="section">
    <base-material-card color="#0088ff" class="px-5 py-3">
      <template v-slot:heading>
        <v-row justify="space-between">
          <v-col cols="6" style="font-size: 20px; font-weight: bold">
            Produtos cadastrados
          </v-col>
          <v-spacer></v-spacer>
          <v-row style="align-items: center">
            <v-btn color="#a0a0a0" @click="showModal = true"
              >Criar Produto</v-btn
            >
            <v-btn
              color="#a0a0a0"
              style="margin-left: 15px"
              @click="
                generalReport = true;
                showFilter = true;
              "
              >Gerar relatório</v-btn
            >
          </v-row>
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
              <td>{{ item.productCode }}</td>
              <td>{{ item.category.name }}</td>
              <td>R${{ item.value }}</td>
              <td>{{ item.pay == true ? "Pago" : "Em aberto" }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      v-if="item.pay == false"
                      style="cursor: pointer"
                      @click="pay(item._id)"
                      >mdi-currency-usd</v-icon
                    >
                  </template>
                  <span>Pagar produto</span>
                </v-tooltip>

                <v-icon style="cursor: pointer" @click="deleteProduct(item._id)"
                  >mdi-delete</v-icon
                >
                <v-icon
                  style="cursor: pointer; margin-left: 5px"
                  @click="
                    showEditModal = true;
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
    <create-modal :showModal="showModal" @changeState="changeModalState" />
    <edit-modal
      :showEditModal="showEditModal"
      :productToEdit="productToEdit"
      @changeState="changeEditModalState"
    />
    <filter-modal
      :showFilter="showFilter"
      @changeState="changeFilterModalState"
    />
  </v-container>
</template>

<script>
//Vue:
import Vue from "vue";
import Swal from "sweetalert2";

// Modal:
import CreateModal from "./components/products-components/CreateModal.vue";
import EditModal from "./components/products-components/EditModal.vue";
import FilterModal from "./components/filter-components/FIlter.vue";

// Service:
import productsService from "../services/productsService";
import reportService from "../services/reportService";
//PDF:
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default {
  name: "Products",
  components: {
    CreateModal,
    EditModal,
    FilterModal,
  },
  data() {
    return {
      generalReport: false,
      showFilter: false,
      sortDesc: true,
      showModal: false,
      showEditModal: false,
      productToEdit: {},
      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name",
        },
        { text: "Código", value: "productCode" },
        { text: "Categoria", value: "category" },
        { text: "Valor", value: "value" },
        { text: "Status", value: "pay" },
        { text: "Ações", value: "" },
      ],
      items: undefined,
    };
  },
  methods: {
    changeModalState(state) {
      this.showModal = state;
      this.getAllProducts();
    },
    changeEditModalState(state) {
      this.showEditModal = state;
      this.getAllProducts();
    },
    changeFilterModalState(state) {
      this.showFilter = state;
    },
    editInfo(product) {
      this.productToEdit = JSON.parse(JSON.stringify(product));
    },
    deleteProduct(id) {
      Swal.fire({
        text: "Você tem certeza que deseja deletar este Produto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "rgb(92, 92, 92)",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          productsService
            .delete(id)
            .then((response) => {
              this.getAllProducts();
              Swal.fire("Deletado!", "", "success");
            })
            .catch((error) => {
              Vue.toasted.error(error.response.data.message, {
                icon: {
                  name: "exclamation",
                },
                duration: "7000",
                position: "bottom-right",
              });
              console.log(error);
            });
        }
      });
    },
    pay(id) {
      Swal.fire({
        text: "Você tem certeza que deseja pagar este Produto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "success",
        cancelButtonColor: "rgb(92, 92, 92)",
        confirmButtonText: "Pagar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          productsService
            .pay(id)
            .then((response) => {
              this.getAllProducts();
              Swal.fire("Produto pago!", "", "success");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    getAllProducts() {
      productsService
        .getAll()
        .then((response) => {
          this.items = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  created() {
    this.getAllProducts();
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
