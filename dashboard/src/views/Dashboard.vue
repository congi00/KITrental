<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import Charts from "./Charts.vue";

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
    <sidebar-menu :menu="menu" />
    <Charts />
</template>