<template>
  <div class="charts-wrapper">
    <div class="chart-wrapper">
      <div class="col">
        <div style="display: flex; justify-content: center">
          
        </div>
        <DoughnutChart ref="chartRef" :chartData="testData" :options="options" />
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
import { DoughnutChart } from "vue-chart-3";
import Form from "./Form.vue";
import { Chart, registerables } from 'chart.js'
import moment from 'moment';
import { defineComponent } from 'vue'
import { useCookies } from "vue3-cookies";

Chart.register(...registerables)

export default defineComponent({
  name: "DoughnutChartWidget",
  components: { DoughnutChart, Form },
  props: ['col'],
  data() {
    return {
      form: {},
      chartType: 'Torta'
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
        },
        title: {
          display: true,
          text: 'Doughnut Chart',
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
      const CONDITIONS = [
          'New',
          'Perfect',
          'Good',
          'Broken'
        ];
      var conditions = []

      this.axios.get("../api/inventory/", { headers: {'auth': this.cookies.get('auth')}})
      .then((res) => {
          var inventoryP = res.data.products
          var stateNew=0;
          var statePerfect=0;
          var stateGood=0;
          var stateBroken=0;
          inventoryP.forEach(element => {
            switch(element.state){
              case "new":{
                stateNew ++;
                break;
              };
              case "perfect":{
                statePerfect++;
                break;
              };
              case "good":{
                stateGood++;
                break;
              };
              case "broken":{
                stateBroken++;
                break;
              };
              default:{
                break;
              }
            }
          });
          conditions = [stateNew, statePerfect, stateGood, stateBroken]
          this.setData(conditions, CONDITIONS)
        })    
        .catch((errors) => {
            console.log(errors);
        })
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