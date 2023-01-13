<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="15" sm="8" lg="4">
        <base-material-stats-card
          color="info"
          icon="mdi-archive-outline"
          title="Total"
          v-model="qtdTotal"
          sub-text="Quantidade de produtos."
        />
      </v-col>

      <v-col cols="15" sm="8" lg="4">
        <base-material-stats-card
          color="success"
          icon="mdi-archive-check-outline"
          title="Pagos"
          v-model="qtdPago"
          sub-text="Quantidade de produtos pagos."
        />
      </v-col>

      <v-col cols="15" sm="8" lg="4">
        <base-material-stats-card
          color="red"
          icon="mdi-archive-remove-outline"
          title="Em aberto"
          v-model="qtdEmAberto"
          sub-text="Quantidade de produtos em aberto."
        />
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="totalChart.data"
          :options="totalChart.options"
          color="info"
          type="Line"
          hover-reveal
          v-if="tst"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Valor total de produtos mês a mês.
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Grafico mensal do valor total de produtos.
          </p>
        </base-material-chart-card>
      </v-col>
      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="payChart.data"
          :options="payChart.options"
          :responsive-options="payChart.responsiveOptions"
          color="success"
          hover-reveal
          type="Bar"
          v-if="tst"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Pagos mês a mês.
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Grafico mensal dos produtos pagos.
          </p>
        </base-material-chart-card>
      </v-col>
      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="noPayChart.data"
          :options="noPayChart.options"
          :responsive-options="noPayChart.responsiveOptions"
          color="red"
          hover-reveal
          type="Bar"
          v-if="tst"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Em aberto mês a mês.
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Grafico mensal dos produtos em aberto.
          </p>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" md="12">
        <apexchart
          type="line"
          height="250"
          :options="compMensalOptions"
          :series="compMensal"
          align="center"
        >
        </apexchart>
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Comparação entre as categorias
            </div>
          </template>
          <v-card-text>
            <v-data-table :headers="headers" :items="categories" />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card :color="getTab(tabs)" class="px-5 py-3">
          <template v-slot:heading>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <!-- <span
                class="subheading font-weight-light mx-3"
                style="align-self: center"
                >Tasks:</span
              > -->
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-check </v-icon>
                Pagos
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-close </v-icon>
                Em aberto
              </v-tab>
              <!-- <v-tab>
                <v-icon class="mr-2"> mdi-cloud </v-icon>
                Server
              </v-tab> -->
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs" class="transparent">
            <v-tab-item v-for="n in 3" :key="n">
              <v-card-text>
                <template>
                  <v-row align="center">
                    <v-card-text>
                      <v-data-table
                        :headers="headersTab"
                        :items="productState[tabs]"
                      />
                    </v-card-text>
                  </v-row>
                </template>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Vue from "vue";
import productsService from "../services/productsService";
Vue.use(VueApexCharts);
export default {
  name: "Dash",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      tst: false,
      qtdTotal: "",
      qtdEmAberto: "",
      qtdPago: "",
      compMensal: [
        {
          name: "Pagos",
          type: "column",
          data: [],
        },
        {
          name: "Em aberto",
          type: "column",
          data: [],
        },
        {
          name: "Total",
          type: "line",
          data: [],
        },
      ],

      totalChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [[]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      payChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [[]],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      noPayChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [[]],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      headers: [
        {
          sortable: false,
          text: "Name",
          value: "name",
        },
        {
          sortable: false,
          text: "Pagos",
          value: "pagos",
          align: "center",
        },
        {
          sortable: false,
          text: "Em aberto",
          value: "emAberto",
          align: "center",
        },
      ],
      categories: [],
      headersTab: [
        {
          sortable: false,
          text: "Produto",
          value: "value",
        },
        {
          sortable: false,
          text: "Categoria",
          value: "text",
          align: "center",
        },
      ],
      tabs: 0,
      productState: {},
      list: {
        0: false,
        1: false,
        2: false,
      },
      compMensalOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            export: {
              csv: {
                filename: "Pagos X Em aberto",
                columnDelimiter: ",",
                headerCategory: "Meses",
                headerValue: "value",
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString();
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
          colors: ["#4caf50", "#F44336", "#00cae3"],
        },
        legend: {
          labels: {
            colors: ["#4caf50", "#F44336", "#00cae3"],
            useSeriesColors: false,
          },
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            fillColors: ["#4caf50", "#F44336", "#00cae3"],
            radius: 12,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0,
          },
        },
        markers: {
          size: 0,
          colors: ["#4caf50", "#F44336", "#00cae3"],
          strokeColors: ["#4caf50", "#F44336", "#00cae3"],
        },
        title: {
          text: "Pagos X Em aberto (mês atual)",
          align: "center",
        },

        xaxis: {
          categories: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
          ],
        },
        fill: {
          opacity: 1,
          colors: ["#4caf50", "#F44336"],
        },
        responsive: [
          {
            breakpoint: undefined,
            options: {},
          },
        ],
        yaxis: {},
        tooltip: {
          custom: undefined,
          marker: {
            show: true,
            fillColors: ["#4caf50", "#F44336", "#00cae3"],
          },
          y: {
            formatter: (val) => "R$ " + val,
          },
        },
      },
    };
  },

  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    getTab(tab) {
      if (tab == 0) {
        return "success";
      } else {
        return "red";
      }
    },
    getAll() {
      productsService.getDash().then((response) => {
        this.data = response;
        this.qtdTotal = String(this.data.total);
        this.qtdEmAberto = String(this.data.qtdEmAberto);
        this.qtdPago = String(this.data.qtdPagos);
        this.updateChart(
          this.data.mensalPay,
          this.data.mensalNoPay,
          this.data.mensalTotal
        );
        this.productState = {
          0: this.data.productsPay,
          1: this.data.productsNoPay,
        };
        this.categories = this.data.category;
        this.totalChart.data.series[0] = this.data.monthByMonthTotal;
        this.totalChart.data.series[0] = this.totalChart.data.series[0].map(
          (el) => (el == null ? 0 : el)
        );
        this.payChart.data.series[0] = this.data.monthByMonthPay;
        this.payChart.data.series[0] = this.payChart.data.series[0].map((el) =>
          el == null ? 0 : el
        );
        this.noPayChart.data.series[0] = this.data.monthByMonthNoPay;
        this.noPayChart.data.series[0] = this.noPayChart.data.series[0].map(
          (el) => (el == null ? 0 : el)
        );
        this.tst = true;
      });
    },
    updateChart(pagos, emAberto, total) {
      this.compMensal = [
        {
          name: "Pagos",
          type: "column",
          data: pagos,
        },
        {
          name: "Em aberto",
          type: "column",
          data: emAberto,
        },
        {
          name: "Total",
          type: "line",
          data: total,
        },
      ];
    },
  },
  created() {
    this.getAll();
  },
};
</script>
