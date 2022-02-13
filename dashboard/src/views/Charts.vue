<template>
  <div class="charts-wrapper">
    <div class="chart-wrapper">
      <div class="col">
        <div style="display: flex; justify-content: center">
          
        </div>
        <ScatterChart ref="doughnutRef" :chartData="testData" :options="options" />
      </div>
      <div class="col">
        <div class="chart-form">
          <Form ref="formRef" v-model="form" />
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
import { ScatterChart } from "vue-chart-3";
import Form from "../components/Form.vue";
import { Chart, registerables } from 'chart.js'
import moment from 'moment';

Chart.register(...registerables)

export default {
  name: "App",
  components: { ScatterChart, Form },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
  },
  setup() {
    const dataChart = ref([30, 40, 60, 70, 5]);
    var labelsChart = [];
    const doughnutRef = ref();

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

    const MONTHS = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];

    const testData = computed(() => ({
      labels: labelsChart,
      datasets: [
        {
          data: dataChart.value,
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    }));

    function setData(d) {
      dataChart.value = d
      labelsChart = MONTHS
    }

    return { testData, setData, doughnutRef, options };
  },
  methods: {
    updateData(e) {
      /* IMPORT FORM DATA from Form Sub-Component */
      const formData = this.form
      var collection = formData.selected  // collection name
      var col = collection === "clients" ? "rental" : '' // !!!HARD-CODED!!!
      var record = formData.record        // id with format: {recordName} id={recordID}
      var rangeDate = formData.date
      var rangeDate = rangeDate.map(x => new Date(x))
      if (!collection || !record || !rangeDate) {
        this.$refs.errorMSG.style.display ="block";
        return;
      } else {
        this.$refs.errorMSG.style.display ="none";
      }
      if (record.includes('id=')) {
        var index = record.indexOf("id=") + 3
        record = record.substring(index)
      }

      /* QUERY FOR RETRIEVING DATA from the db */
      var q = {"client_id" : record} // !!!HARD-CODED!!!
      this.axios.get("api/" + col + "/", {params: q})
        .then((res) => {
            var rental = res.data.rental 
            console.log(rental)

            /* Only rental that fit within the picked date range (check based on *start_date*) */
            // const filteredByValue = Object.fromEntries(
            //   Object.entries(rental).filter(([key, value]) => new Date(value.start_date) >= rangeDate[0] && new Date(value.start_date) <= rangeDate[1] ) )
            this.countPerMonth(rental, rangeDate)
        })    
        .catch((errors) => {
            console.log(errors);
        })  
      var data = [0, 0, 1, 2, 3]
      this.setData(data)
    },
    countPerMonth(rental, range) {
      /* Initialization first range */
      var start_date = range[0]
      var end_date = new Date(range[0].getFullYear(), start_date.getMonth() + 1, 0); // This way you get the last day of the previous month
      var counter = []
      var start_m = moment(start_date)
      var end_m = moment(end_date)

      /* The range is smaller than one month */
      if (end_date > range[1]) return rental.length 

      do {
        const filteredByValue = Object.fromEntries(
              Object.entries(rental).filter(([key, value]) => new Date(value.start_date) >= start_date && new Date(value.start_date) <= end_date ) )

        counter.push(Object.keys(filteredByValue).length)

        /* Month Range Update */
        start_date = start_m.add(1, 'month').toDate()
        end_date   = end_m.add(1, 'month').toDate()
        if (end_date > range[1]) end_date = range[1]
      } while (start_date < range[1])

      console.log(counter)
      return counter
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.charts-wrapper {
  width: 100%;
  height: 100vh;
  padding: 5rem;
  display: flex; 
  justify-content: center;
  background: #031f1c;
  .chart-wrapper {
    background: white;
    display: flex;
    align-self: flex-start;
    max-width: 40vw;
    padding: 1.5rem;
    .chart-form {
      display: block;
      margin: auto;
      margin-top: 1rem;
      width: 80%;
      .update-button {
        margin-top: 1rem;
      }
      .errorMsg{
        color: red;
        font-size: 1vw;
        display: none;
        margin-top: 1rem;
      }
    }
  }
}
.dp__month_year_row {
    position: unset; // CSS fix for vue3-date-time-picker overlay
}
</style>