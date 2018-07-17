<template>
</template>

<script>
    export default {
        name: "precheck",
      data(){},
      beforeCreate(){
          this.publicApi.precheck({}).then((res)=>{
            if(res.status === 122){
              //未登录
            }
            else if(res.status === 125){
              //登录成功
            }
          })
      }
    }
</script>

<style scoped>

</style>
