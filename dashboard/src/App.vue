<template>
  <RouterView />
</template>

<script>
  export default {
    name: 'app',
    components: {},
    data(){
      return{
        username: '',
        password: '',
      }
    },
    methods: {},
  };
</script>

<style>
@import '@/assets/base.css';

</style>