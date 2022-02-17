<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import Charts from "../components/Charts.vue";

export default {
    components: {
        SidebarMenu, Charts
    },
    data() {
      return {
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
        <Charts />
        <Charts />
        <Charts />
        <Charts />
        <!-- <div class="row " style="height: 50%">
            <div class="col">
                <Charts />
            </div>
            <div class="col">
                <Charts />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <Charts />
            </div>
            <div class="col">
                <Charts />
            </div>
        </div>-->
    </div>
  </div>
</template>

<style lang="scss">
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