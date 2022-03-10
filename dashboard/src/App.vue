<template>
  <div>
    <div v-if="!isLogin">
      <sidebar-menu :menu="menu" collapsed @update:collapsed="onToggleCollapse"/>
    </div>
    <div class="home-dashboard">
      <RouterView />
    </div>
  </div>
</template>

<script>
  import { SidebarMenu } from 'vue-sidebar-menu'
  import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

  export default {
    name: 'app',
    components: {
        SidebarMenu
    },
    data(){
      return{
        username: '',
        password: '',
        menu: [
          {
            header: 'Main Navigation',
            hiddenOnCollapse: true
          },
          {
            href: '/dashboard',
            title: 'Home',
            icon: {
              element: 'font-awesome-icon',
              attributes: {
                icon: 'house-laptop'
              }
            }
          },
          {
            href: '/dashboard/clients',
            title: 'Clients',
            icon: {
              element: 'font-awesome-icon',
              attributes: {
                icon: 'users'
              }
            }
          },
          {
            href: '/dashboard/rental',
            title: 'Rental',
            icon: {
              element: 'font-awesome-icon',
              attributes: {
                icon: 'file-invoice-dollar'
              }
            }
          },
          {
            href: '/dashboard/inventory',
            title: 'Inventory',
            icon: {
              element: 'font-awesome-icon',
              attributes: {
                icon: 'blender'
              }
            },
            child: [
                {
                    href: '/dashboard/inventory/category',
                    title: 'Category',
                    icon: {
                      element: 'font-awesome-icon',
                      attributes: {
                        icon: 'boxes-stacked'
                      }
                    },
                }
            ]
          },
          {
            href: '/dashboard/employees',
            title: 'Employees',
            icon: {
              element: 'font-awesome-icon',
              attributes: {
                icon: 'briefcase'
              }
            }
          },
        ]
      }
    },
    methods: {
      onToggleCollapse(collapsed) {
        if (collapsed) {
          document.getElementsByClassName('home-dashboard')[0].style.paddingLeft = '65px';
        } else {
          document.getElementsByClassName('home-dashboard')[0].style.paddingLeft = '290px';
        }
      }
    },
    computed: {
      isLogin() {
          return this.$route.name == 'login'
      }
    }
  };
</script>

<style>
@import '@/assets/base.css';

.vsm--scroll-overflow, .vsm--scroll {
  position: unset!important;
}
.home-dashboard {
  transition: padding-left 0.3s ease;
  min-height: 100vh;
  padding: 2rem 0 2rem 65px;
  width: 100%;
  background: #031f1c;
  color: white;
}
.update-button, .update-button:active, .update-button:focus, .update-button:hover {
  background: #06514c;
  box-shadow: #06514c 0 10px 20px -10px;
  border-radius: 999px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Inter,sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}
</style>