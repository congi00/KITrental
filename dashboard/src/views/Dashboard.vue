<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import Charts from "../components/LineChartWidget.vue";

export default {
    components: {
        SidebarMenu, Charts
    },
    data() {
      return {
        menu: [
          {
            header: 'Main Navigation',
            hiddenOnCollapse: true
          },
          {
            href: '/dashboard/clients',
            title: 'Clients',
            icon: 'fa fa-user'
          },
          {
            href: '/dashboard/rental',
            title: 'Rental',
            icon: 'fa fa-chart-area',
          },
          {
            href: '/dashboard/inventory',
            title: 'Inventory',
            icon: 'fa fa-chart-area',
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
    <sidebar-menu :menu="menu" />
    <div class="home-dashboard">
      <h1>Clients</h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-dashboard {
  width: 100%;
  height: 100vh;
  padding: 5rem;
  background: #031f1c;
  color: white;
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
</style>