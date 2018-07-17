<template>
    <div class="g-error">
      <span>非法用户，无权访问系统</span>
    </div>
</template>

<script>
    export default {
      name: "Error",
      mounted(){
        this.$store.dispatch('setVisible',true);
      }
    }
</script>

<style scoped>
  .g-error{
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
