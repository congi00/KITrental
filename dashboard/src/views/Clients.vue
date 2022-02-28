<script>
import LineChartWidget from "../components/LineChartWidget.vue";
import BarChartWidget from "../components/BarChartWidget.vue";
import PieChartWidget from "../components/PieChartWidget.vue";
import DoughnutChartWidget from "../components/DoughnutChartWidget.vue";

export default {
    components: {
        LineChartWidget, BarChartWidget, PieChartWidget, DoughnutChartWidget
    },
    data() {
      return {
        col : '',
        fields: [
            {
                name: 'Charts',
                value: {}
            }
        ],
      }
    },
    setup() {

    },
}
</script>

<template>
  <div class="dashboard-wrapper">
    <LineChartWidget col="clients" />
    <BarChartWidget col="clients" />
    <PieChartWidget col="clients" />
    <DoughnutChartWidget col="clients" />
  </div>
</template>

<style lang="scss">
.home-dashboard {
  .dashboard-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    h1 {
      font-size: 2.5vw;
      margin-bottom: 2rem;
    }
    p {
      font-size: 1.5vw;
      margin-bottom: 1rem;
    }
    h1, p {
      display: block;
    }
  }
}
.charts-wrapper {
  max-width: 50vw;
  max-height: 50vh;
  margin: 1rem;
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
</style>