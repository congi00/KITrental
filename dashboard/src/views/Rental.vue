<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import LineChartWidget from "../components/LineChartWidget.vue";
import BarChartWidget from "../components/BarChartWidget.vue";
import PieChartWidget from "../components/PieChartWidget.vue";
import DoughnutChartWidget from "../components/DoughnutChartWidget.vue";

export default {
    components: {
        SidebarMenu, LineChartWidget, BarChartWidget, PieChartWidget, DoughnutChartWidget
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
        menu: [
          {
            header: 'Main Navigation',
            hiddenOnCollapse: true
          },
          {
            href: '/clients',
            title: 'Clients',
            icon: 'fa fa-user'
          },
          {
            href: '/rental',
            title: 'Rental',
            icon: 'fa fa-chart-area',
          },
          {
            href: '/inventory',
            title: 'Inventory',
            icon: 'fa fa-chart-area',
            child: [
                {
                    href: '/inventory/category',
                    title: 'Category'
                }
            ]
          },
        ]
      }
    },
    setup() {

    },
}
</script>

<template>
  <div>
    <sidebar-menu :menu="menu" collapsed/>
    <div class="home-dashboard">
        <LineChartWidget col="rental" />
        <BarChartWidget col="rental" />
        <PieChartWidget col="rental" />
        <DoughnutChartWidget col="rental" />
    </div>
  </div>
</template>

<style lang="scss">
.home-dashboard {
  width: 100%;
  padding: 2rem;
  background: #031f1c;
  color: white;
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
</style>