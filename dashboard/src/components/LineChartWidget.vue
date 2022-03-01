<template>
  <div class="charts-wrapper">
    <div class="chart-wrapper">
      <div class="col">
        <div style="display: flex; justify-content: center">
          
        </div>
        <LineChart ref="chartRef" :chartData="testData" :options="options" />
      </div>
      <div class="col col-chart">
        <div class="chart-form">
          <Form ref="formRef" v-model="form" :col="col" />
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
import { LineChart } from "vue-chart-3";
import Form from "./Form.vue";
import { Chart, registerables } from 'chart.js'
import moment from 'moment';
import { defineComponent } from 'vue'
import { useCookies } from "vue3-cookies";

Chart.register(...registerables)

export default defineComponent({
  name: "LineChartWidget",
  components: { LineChart, Form },
  props: ['col'],
  data() {
    return {
      form: {}
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
          text: 'Line Chart',
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
      } if (this.col === 'inventory') {
        
        console.log("ALERT");
        endpoint = "/api/rental/rentalByProductId/"
      } if (this.col === 'inventory/category') {
        endpoint = "/api/rental/rentalByProductsIds/"
        await this.axios.get("/api/inventory/productsByCategoryName/" + formData.category)
                .then((res) => {
                    var products = res.data.products
                    console.log(products)
                    if (formData.choice !== 'products') {
                      var prodsId = []
                      products.forEach(prod => {
                        prodsId.push(prod._id)
                      })
                      _params = prodsId.toString()
                    } else {
                      const resultObj = this.countPerMonth(products, rangeDate, {colToCount: 'products'})
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
          .then((res) => {
              var rental = res.data.rental
              console.log(rental)
              /* Only rental that fit within the picked date range (check based on *start_date*) */
              const resultObj = this.countPerMonth(rental, rangeDate, {fieldToCountOn: this.form.choice})
              this.setData(resultObj.data, resultObj.labels)
          })    
          .catch((errors) => {
              console.log(errors);
          })  
      }        
    },
    countPerMonth(rental, range, config) {
      /* Initialization first sub range (month) */
      var start_date = range[0]
      var end_date = new Date(range[0].getFullYear(), start_date.getMonth() + 1, 0); // This way you get the last day of the previous month
      var counter = []
      var months = []
      var start_m = moment(start_date)
      var end_m = moment(end_date)
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

        var incoming, filteredByValue;

      /* The range is smaller than one month */
      if (end_date > range[1]) return rental.length 

      /* Count how many records per month within the given range */
      do {
        incoming = 0;
        if (config.colToCount === 'products') {
          filteredByValue = Object.fromEntries(
            Object.entries(rental).filter(([key, value]) => new Date(value.creation_date) >= start_date && new Date(value.creation_date) <= end_date ) )
        } else {
          filteredByValue = Object.fromEntries(
            Object.entries(rental).filter(([key, value]) => new Date(value.start_date) >= start_date && new Date(value.start_date) <= end_date ) )
        }

        if(config.fieldToCountOn === "Incoming"){
          const IncomeOption = Object.keys(filteredByValue).map(x => {
            filteredByValue[x].price != undefined ? incoming+=filteredByValue[x].price : console.log(filteredByValue[x].price);
          })
          console.log(incoming);
          counter.push(incoming);
        }else if(config.fieldToCountOn === "Conditions"){
          this.axios.get("../api/inventory/", { headers: {'auth': this.cookies.get('auth')}})
          .then((res) => {
              var inventoryP = res.data
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
              console.log("ECC")
              console.log(rental)
              console.log("ECCO")
              /* Only rental that fit within the picked date range (check based on *start_date*) */
              const resultObj = this.countPerMonth(rental, rangeDate)
              this.setData(resultObj.data, resultObj.labels)
          })    
          .catch((errors) => {
              console.log(errors);
          })
        }else{
          // Standard counting by number of rental per month
          console.log("ECCO")
          console.log(Object.keys(filteredByValue))
          console.log(Object.keys(filteredByValue).length)
          counter.push(Object.keys(filteredByValue).length)
          console.log("ECCOLO")
          
        }
        
        months.push(MONTHS[start_date.getMonth()])

        /* Month Range Update */
        start_date = start_m.add(1, 'month').toDate()
        end_date   = end_m.add(1, 'month').toDate()
        if (end_date > range[1]) end_date = range[1]
      } while (start_date < range[1])

      return {data: counter, labels: months} 
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
</style>