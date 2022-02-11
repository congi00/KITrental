<template>
  <div id="home">
    <section class="homeSection">
      <div class="container-fluid">
        <h1 class="title">Welcome into the Manager <br>Dashboard</h1>
        <h2 class="subtitle">
          make sure you are in the right place!
        </h2>
        <form class="formSection">
          <img src="./img/KITrental-logos_black.png">
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
    </section>
   <!--<div id="nav">
      <router-link to="/dashboard">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
  import router from "./router"    
  import axios from "axios"  
  import Vue from 'vue'
  import VueCookies from 'vue-cookies'
  Vue.use(VueCookies)

  export default {
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
        axios.post("/api/login/managers",data)    
          .then((response) => {    
            if(response.data.password==true){
              this.$cookies.set("user_session",response.data.id);
              router.push("/about")
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
  };
</script>
<style lang="scss" >
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300&display=swap');

  .homeSection{
    width:100vw;
    height:100vh;
    background-color:#031f1c;
    overflow:hidden;
  }
  .homeSection h1 {
    color:#fff;
    font-size: 4vw;
    font-family: 'Jost', sans-serif;
  }
  .homeSection h2 {
    color:#fff;
    font-size: 2vw;
    font-family: 'Jost', sans-serif;
    font-weight:bold;
  }
  .homeSection .title{
    position:absolute;
    top:30vh;
    left:2vw;
    text-align:left;
  }

  .homeSection .subtitle{
    position:absolute;
    top:55vh;
    left:2vw;
    text-align:left;
  }
  .formSection{
    height:50vh;
    width:25vw;
    background-color: rgba(255, 255, 255, .45);
    backdrop-filter: blur(10px);
    border-radius:10px;
    position:absolute;
    right:5vw;
    top:25vh;
    text-align:left;
    padding-left:2vw;
    .errorMsg{
      color: red;
      font-size: 1vw;
      position: absolute;
      left: 5vw;
      top: 12vh;
      display: none;
    }
    img{
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
</style>

