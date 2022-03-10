<template>
    <div class="dashboard-wrapper-employees">
        <h1 class="section-name">Employees' Info</h1>
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
  .dashboard-wrapper-employees {
    display: flex;
    flex-wrap: wrap;
    .section-name {
      margin: .5rem 0 1rem 0;
      flex: 0 0 100%;
      text-align: center;
    }
    .table-wrapper {
      flex: 0 0 100%;
    }
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
    position: relative;
    text-align: center;
    width: 50%;
    margin: auto;
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
