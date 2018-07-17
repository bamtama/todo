<template>
  <div class="g-re">
    <x-button type="primary" @click.native="refresh">刷新</x-button>
  </div>
</template>

<script>
    import XButton from "vux/src/components/x-button/index";

    export default {
      components: {XButton},
      name: "RedirectPage",
      mounted(){
        this.$store.dispatch('setVisible', true)
      },
      methods:{
        refresh(){
          let uri = decodeURIComponent(this.$route.query.turnto);
          if(!uri){
            uri = '/'
          }
          this.$router.replace('/LoginTo?reuri='+ encodeURIComponent(uri))
        }
      }
    }
</script>

<style scoped>
  .g-re{
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 60px;
  }
</style>
