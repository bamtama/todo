<template>
  <div class="m-fold-part">
    <i class="btn-folded" @click="isUnfold = !isUnfold"
       v-if="height>MAXHEIGHT">
      <span v-show="!isUnfold">...</span>
      <i class="iconfont icon-arrow-up" v-show="isUnfold"></i>
    </i>
    <div class="pwrap" v-bind:class="{'z-unfold': isUnfold}">
      <p ref="p">{{value}}</p>
    </div>
  </div>
</template>

<script>
  export default{
    name:'foldPart',
    props:['value'],
    data(){
      return{
        MAXHEIGHT:44,	//默认两行，未设置自定义配置
        height: '',
        isUnfold: false
      }
    },
    computed:{
    },
    mounted(){
      this.getHeight()
    },
    methods:{
      getHeight(){
        this.$nextTick(()=>{
          setTimeout(()=>{
            this.height = this.$refs.p.clientHeight;
          },0)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .m-fold-part{
    position: relative;
    font-size: 15px;
    .btn-folded{
      display: inline-block;
      width: 1em;
      text-align: center;
      color: #3988ff;
      background: #fff;
      line-height: 22px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    &>.pwrap{
      max-height: 44px;
      line-height: 22px;
      overflow: hidden;
      text-align: justify;
      &.z-unfold{
        max-height:none;
        height: auto;
        text-align: left;
      }
    }
  }
</style>
