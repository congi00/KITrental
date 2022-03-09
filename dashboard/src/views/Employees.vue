<template>
    <div class="dashboard-wrapper">
        <div class="container table-wrapper pt-5"> 
          <table class="table table-light table-hover tableDash">
            <thead>
              <tr class="table-light">
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr
               v-for='employee in employees' :key="employee.username">
                <td>{{employee.username}}</td>
                <td>{{employee.role}}</td>
              </tr>
            </tbody>
          </table>
          </div>
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

.tableDash{
  position:relative;
  left: 25vw;
  text-align: center;
}
</style>
<script>
import { useCookies } from "vue3-cookies";

export default{
  data() {
    return {
      employees: [],
    }
  },
  setup() {
    
  },
  methods:{
    showEmployees(){
      const { cookies } = useCookies();
      this.axios.get("/api/employees/",{headers: {'auth': cookies.get('auth')}})
        .then(async (res) => {
          res.data.employees.forEach((employee, i) => {
            this.employees.push(employee);
          })
        })
      }, 
       
  },
  beforeMount(){
    this.showEmployees()
  },
}
</script>
