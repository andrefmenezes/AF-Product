<template>
  <v-row justify="center">
    <v-dialog v-model="showFilter" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Gerar relatório</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <label for="initialDate">Data inicial</label>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filter.initialDate"
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filter.initialDate"
                    @input="menu = false"
                    locale="pt-br"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <label for="finalDate">Data Final</label>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filter.finalDate"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filter.finalDate"
                    @input="menu2 = false"
                    locale="pt-br"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <label for="truckPlate">Categoria</label>
                <v-autocomplete
                  v-model="filter.category"
                  :items="categories"
                  item-text="name"
                  color="white"
                  label="Categoria"
                  return-object
                  single-line
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <label for="truckPlate">Status</label>
                <v-autocomplete
                  v-model="filter.status"
                  :items="status"
                  item-text="name"
                  color="white"
                  label="Status"
                  single-line
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="changeState(false)">
            Fechar
          </v-btn>
          <v-btn color="blue darken-1" text @click="generateReportCustom()">
            Gerar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import reportService from "../../../services/reportService";
import categoryService from "../../../services/categoryService";
import moment from "moment";
import Vue from "vue";
//PDF:
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default {
  name: "filter-modal",
  props: ["showFilter"],
  data() {
    return {
      filter: {
        initialDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        finalDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      },
      categories: [],
      status: ["Pago", "Em aberto"],
      menu: false,
      modal: false,
      menu2: false,
    };
  },
  methods: {
    changeState(state) {
      this.filter = {
        initialDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        finalDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      };
      this.$emit("changeState", state);
    },
    generateReportCustom() {
      reportService
        .generateReport(this.filter)
        .then((response) => {
          let reportInfo = response;
          let reportTotalEnvents = response.length;
          this.parseEventReportToPdf(reportInfo, reportTotalEnvents);
          this.generalReport = false;
        })
        .catch((error) => {
          console.log(error);
          Vue.toasted.error("Não há dados para esse relatório", {
            icon: {
              name: "exclamation",
            },
            duration: "7000",
            position: "bottom-right",
          });
          this.generalReport = false;
        });
    },
    parseEventReportToPdf(reportInfo, reportTotalInfo) {
      var doc = new jsPDF();
      let report = [];
      let dateString = new Date();

      doc.setProperties({
        title: "Relatório",
        subject: "Report information",
        author: "AF",
        keywords: "generated, report, AF",
        creator: "AF",
      });
      doc.addImage("img/logo2.png", "PNG", 45, 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(105, 47, `Total de Registros: ${reportTotalInfo}`);
      doc.text(25, 47, "RELATÓRIO DE PRODUTOS");
      doc.setFontSize(10);
      doc.text(25, 52, `Data de expedição: ${dateString.toLocaleString()}`);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setFontSize(9);
      reportInfo.forEach((element) => {
        element.createdAt = moment(element.createdAt).format("DD/MM/YYYY");
        report.push([
          element.name,
          element.productCode,
          element.category.name,
          `R$${element.value}`,
          element.pay == true ? "Pago" : "Em aberto",
          element.createdAt,
        ]);
      });
      doc.autoTable({
        headStyles: { fillColor: [54, 192, 198] },
        margin: { top: 10, right: 2, left: 2 },
        startY: 60,
        head: [
          ["Nome", "Código", "Categoria", "Valor", "Status", "Data de criação"],
        ],
        body: report,
      });
      doc.save("Relatorio-de-produtos.pdf");
    },
    getAllTransporters() {
      categoryService
        .getAll()
        .then((response) => {
          this.categories = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getAllTransporters();
  },
};
</script>

<style scoped>
.custom-placeholer-color input,
.custom-label-color input {
  color: red !important;
}
</style>
