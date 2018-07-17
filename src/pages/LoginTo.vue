<template>

</template>

<script>
  export default {
    name: "login-to",
    mounted(){
      this.$store.dispatch('globalLoading', false);
      window.location.href = this.$route.query.reuri;
      //console.log(window.location.origin + '/mashangban/nos!14?turnto=' + this.$route.query.reuri)
    }
  }
</script>

<style scoped>

</style>
