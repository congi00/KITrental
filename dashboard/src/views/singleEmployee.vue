<template>
    <div class="dashboard-wrapper">
        <div class="container table-wrapper pt-5"> 
            <form>
                <label for="employeeId">Search for Employee:</label>
                <input class="form-control" id="employeeId" list="recordList" type="text" v-model="employeeId" placeholder="Single Record" @keyup="handleChange" />
                <datalist ref="recordsList" id="recordList"></datalist>
                <button class="btn-show-rental" type="button" @click="showRental">Show Rental</button>
            </form>
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
        employeeId: '',
        rental: [],
    }
  },
  setup() {
    
  },
  methods:{
    showRental(){
        const { cookies } = useCookies();

        var record = this.employeeId;
        if (record && record.includes('id=')) {
            var index = record.indexOf("id=") + 3
            record = record.substring(index);
        }
        this.axios.get("/api/rental/",{headers: {'auth': cookies.get('auth')}})
            .then(async (res) => {
            res.data.employees.forEach((employee, i) => {
                this.employees.push(employee);
            })
            })
    }, 
  }
}
</script>