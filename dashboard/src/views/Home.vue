<template>
  <section class="homeSection">
    <div class="container-fluid">
      <div class="row p-5">
        <div class="col-lg home-cols">
          <div class="title-group">
            <h1 class="title">Welcome into the Manager <br>Dashboard</h1>
            <h2 class="subtitle">
              make sure you are in the right place!
            </h2>
          </div>
        </div>
        <div class="col-lg home-cols">
          <form class="formSection">
            <img src="../assets/KITrental-logos_black.png">
            <h3  class="errorMsg" ref="errorMSG">Wrong password or username!</h3>
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input type="text" placeholder="Username" ref="username">
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input type="password" placeholder="Password" ref="password">
              </div>
            </div>
            <button type="submit" @click.prevent="login()">Login</button>
          </form>  
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import router from "../router/index"
  import { useCookies } from "vue3-cookies";

  export default {
    setup() {
      const { cookies } = useCookies();
      return { cookies };
    },
    name: 'home',
    components: {},
    data(){
      return{
        username: '',
        password: '',
      }
    },
    methods: { 
      login(){    
        this.username = this.$refs.username.value;
        this.password = this.$refs.password.value;
        let data={
          emplUsername: this.$refs.username.value,
          emplPassword: this.$refs.password.value
        }
        this.axios.post("/api/login/managers",data)    
          .then((response) => {    
            console.log(response)
            if(response.data.password==true){
              this.cookies.set('auth', response.data.auth);
              router.push("/dashboard/home");
            }else{
              this.$refs.errorMSG.style.display ="block";
            }    
          })    
          .catch((errors) => {
            console.log(errors);    
            this.$refs.errorMSG.style.display ="block";
          })    
      }      
    },
    mounted() {

    }
  };
</script>
<style lang="scss" >
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300&display=swap');

  .homeSection {
    background-color:#031f1c;
    .row {
      height: 100vh;
      .home-cols {
      display: flex;
      align-items: center;
      text-align:left;
      .title {
        color:#fff;
        font-size: 4vw;
        font-family: 'Jost', sans-serif;
        flex: 0 0 100%;
      }
      .subtitle {
        color:#fff;
        font-size: 2vw;
        font-family: 'Jost', sans-serif;
        font-weight: bold;
        flex: 0 0 100%;
      }
      &:nth-child(2){
        justify-content: end;
      }
      .formSection{
        height:50vh;
        width:25vw;
        background-color: rgba(255, 255, 255, .45);
        backdrop-filter: blur(10px);
        border-radius:10px;
        text-align:left;
        padding-left:2vw;
        .errorMsg{
          color: red;
          font-size: 1vw;
          display: none;
          position: absolute;
          left: 5vw;
          top: 12vh;
        }
        img {
          width:10vw;
          position:relative;
          bottom:6vh;
          left:5vw;
        }
        .field{
          position:relative;
          bottom:5vh;
          input[type="text"],input[type="password"]{
            width:90%;
            height:4.5vh;
            border:none;
            padding-left:5px;
          }
          label{
            color:#222;
          }
        }
        button{
          width:50%;
          height:12%;
          position:relative;
          left:5vw;
          bottom:2vh;
          background:#222;
          border:0;
          border-radius:5px;
          color:#fff;
        }
      }
    }
    }
    
  }
</style>