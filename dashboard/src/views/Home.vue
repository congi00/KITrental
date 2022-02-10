<template>
  <div class="home">
    <section class="homeSection">
      <div class="container-fluid">
        <h1 class="title">Welcome into the Manager <br>Dashboard</h1>
        <h2 class="subtitle">
          make sure you are in the right place!
        </h2>
        <div class="formSection" @submit.prevent="submitForm">
          <img src="../img/KITrental-logos_black.png">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input v-model="username" type="text" placeholder="Username">
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input type="password" v-model="password" placeholder="Password">
            </div>
          </div>
          <button type="submit">Login</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
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
      // submit the form to our backend api
      async submitForm() {
        const res = await fetch('/API/login/Managers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // pass in the information from our form
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          })
        });
        if(res=="")
          return 0;
      }
    },
  };
</script>
<style lang="scss" scoped>
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
