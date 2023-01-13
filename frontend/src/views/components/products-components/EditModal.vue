<template>
  <v-row justify="center">
    <v-dialog v-model="showEditModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edição do produto</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <label for="productCode">Código da produto *</label>
                <v-text-field
                  name="productCode"
                  type="text"
                  required
                  v-model="product.productCode"
                  >></v-text-field
                >
              </v-col>
              <v-col cols="12">
                <label for="name">Nome do Produto *</label>
                <v-text-field
                  name="name"
                  type="text"
                  required
                  v-model="product.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="colum">
                <label for="value">Valor do Produto *</label>
                <money
                  type="text"
                  id="valor"
                  v-model="product.value"
                  md-counter="false"
                  required
                  name="valor"
                  placeholder="Valor"
                  v-bind="money"
                ></money>
              </v-col>
              <v-col cols="12">
                <label for="category">Categoria *</label>
                <v-autocomplete
                  v-model="select"
                  :items="categories"
                  item-text="name"
                  color="white"
                  label="Categoria"
                  return-object
                  single-line
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <label for="status">Pago ? *</label>
                <v-checkbox
                  v-model="product.pay"
                  :color="getColor(product.pay)"
                >
                  <template v-slot:label>
                    <span class="check">
                      {{
                        product.pay == true
                          ? "Produto pago"
                          : "Produto em aberto"
                      }}
                    </span>
                  </template>
                </v-checkbox>
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
          <v-btn color="blue darken-1" text @click="editProduct(product)">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import productsService from "../../../services/productsService";
import categoryService from "../../../services/categoryService";
import Vue from "vue";
import { Money } from "v-money";
export default {
  name: "create-modal",
  props: {
    showEditModal: undefined,
    productToEdit: undefined,
  },
  components: { Money },
  data() {
    return {
      product: {},
      select: { name: "", _id: "" },
      categories: [],
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
    };
  },
  methods: {
    changeState(state) {
      this.product = {};
      this.$emit("changeState", state);
    },
    getAllCategories() {
      categoryService
        .getAll()
        .then((response) => {
          this.categories = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editProduct(product) {
      let body = {
        updateProductData: {
          _id: product._id,
          productCode: product.productCode,
          name: product.name,
          value: product.value,
          pay: product.pay,
          category: this.select,
        },
      };
      productsService
        .edit(body)
        .then((response) => {
          Vue.toasted.success("Produto editado!", {
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
    getColor(pay) {
      if (pay === true) {
        return "success";
      } else {
        return "";
      }
    },
  },
  created() {
    this.getAllCategories();
  },
  watch: {
    productToEdit() {
      this.product = this.productToEdit;
      this.select = this.product.category;
    },
  },
};
</script>

<style scoped>
.check {
  color: black !important;
}
.colum {
  display: flex;
  flex-direction: column;
}
</style>
