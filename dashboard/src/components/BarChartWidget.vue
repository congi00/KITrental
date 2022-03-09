<template>
  <div class="charts-wrapper">
    <div class="chart-wrapper">
      <div class="col">
        <div style="display: flex; justify-content: center">
          
        </div>
        <BarChart ref="chartRef" :chartData="testData" :options="options" />
      </div>
      <div class="col col-chart">
        <div class="chart-form">
          <h2 class="form-title">Insert Data Below:</h2>
          <Form ref="formRef" v-model="form" :col="col" :chartType="chartType" />
          <button class="update-button" type="button" @click="updateData">Update Data</button>
          <h3  class="errorMsg" ref="errorMSG">Fields values missing!</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, ref } from "vue";
import { shuffle } from "lodash";
import { BarChart } from "vue-chart-3";
import Form from "./Form.vue";
import { Chart, registerables } from 'chart.js'
import moment from 'moment';
import { defineComponent } from 'vue'
import { useCookies } from "vue3-cookies";
import {calculateChartData} from '../scripts/calculateChartData'

Chart.register(...registerables)

export default defineComponent({
  name: "BarChartWidget",
  components: { BarChart, Form },
  props: ['col'],
  data() {
    return {
      form: {},
      chartType: 'Chart'
    }
  },
  mounted() {
  },
  setup() {
    const { cookies } = useCookies();

    const dataChart = ref([30, 40, 60, 70, 5]);
    var labelsChart = [];
    const chartRef = ref();

    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          display: false,
        },
        title: {
          display: true,
          text: 'Bar Chart',
        },
      },
    });

    const testData = computed(() => ({
      labels: labelsChart,
      datasets: [
        {
          data: dataChart.value,
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    }));

    function setData(d, l) {
      dataChart.value = d
      labelsChart = l
    }

    return { testData, setData, chartRef, options, cookies };
  },
  methods: {
    async updateData(e) {
      /* IMPORT FORM DATA from Form Sub-Component */
      const formData = this.form
      var queryType = this.form.choice
      var colData = "rental" // !!!HARD-CODED!!!
      var record = formData.record        // id with format: {recordName} id={recordID}
      var rangeDate = formData.date
      var rangeDate = rangeDate.map(x => new Date(x))
      if (!this.col || (!record&& !(this.col == "rental" || this.col == 'inventory/category')) || !rangeDate || !queryType) {
        this.$refs.errorMSG.style.display ="block";
        return;
      } else {
        this.$refs.errorMSG.style.display ="none";
      }
      if (record && record.includes('id=')) {
        var index = record.indexOf("id=") + 3
        record = record.substring(index);
      }

      /* QUERY FOR RETRIEVING DATA from the db */
      var _params = record
      var endpoint = ""
      if (this.col === 'clients') {
        endpoint = "/api/rental/client/"
      } if (this.col === 'rental') {
        endpoint = "/api/rental/"
        _params = ''
      } if (this.col === 'inventory') {
        endpoint = "/api/rental/rentalByProductId/"
      } if (this.col === 'inventory/category') {
        endpoint = "/api/rental/rentalByProductsIds/"
        await this.axios.get("/api/inventory/productsByCategoryName/" + formData.category)
                .then(async (res) => {
                    var products = res.data.products
                    console.log(products)
                    if (formData.choice !== 'products') {
                      var prodsId = []
                      products.forEach(prod => {
                        prodsId.push(prod._id)
                      })
                      _params = prodsId.toString()
                    } else {
                      const resultObj = await calculateChartData(products, rangeDate, {colToCount: 'products'}, this.col)
                      this.setData(resultObj.data, resultObj.labels)
                    }
                    
                })    
                .catch((errors) => {
                    console.log(errors);
                })  
      }
      
      if (formData.choice !== 'products') {
        // Retrieve rental
        this.axios.get(endpoint + _params, {headers: {'auth': this.cookies.get('auth')}})
          .then(async (res) => {
              var rental = res.data.rental
              console.log(rental)
              /* Only rental that fit within the picked date range (check based on *start_date*) */
              const resultObj = await calculateChartData(rental, rangeDate, {fieldToCountOn: this.form.choice}, this.col)
              this.setData(resultObj.data, resultObj.labels)
          })    
          .catch((errors) => {
              console.log(errors);
          })  
      }        
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.dp__month_year_row {
    position: unset; // CSS fix for vue3-date-time-picker overlay
}

.col-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-title {
  color: #222;
  margin-bottom: 1.5rem;
}
</style>