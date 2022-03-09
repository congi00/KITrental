<script>

export default {
    setup() {
    },
}
</script>

<template>
  <div class="container titles-wrapper">
    <h1 style="margin-bottom:3rem">Welcome in your dashboard panel Mr. Manager!</h1>
    <h2>From here you'll be able to generate and inspect graphs on several statistics</h2>
    <h2 style="margin-bottom:2rem">like income and number of rentals, <u>divided by months</u>. </h2>
    <h2>Please, select an option among the ones in the sidebar. </h2>
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
.vsm--scroll-overflow, .vsm--scroll {
  position: unset!important;
}

.titles-wrapper {
  margin-top: 3rem;
}

</style>