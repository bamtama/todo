<template>
  <div class="dw-handling g-content">
      <div>
          <group :title="cTitle">
                <x-textarea
                  v-model="content"
                  placeholder="点击输入您的意见"
                  :height="120"> </x-textarea>
          </group>
      </div>
      <box gap="4.5vh 2%">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="actionSubmit">提交</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button class="btn" typeof="primary" @click.native="actionCancel">取消</x-button>
          </flexbox-item>
        </flexbox>
      </box>
  </div>
</template>

<script>
import {
  XButton,
  XTextarea,
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  Box
} from "vux";
import { cookie } from 'vux';

export default {
  name: "handle",
  components: {
    XButton,
    XTextarea,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    Box
  },
  data(){
    return{
      id: this.$route.params.id,
      content:''
    }
  },
  computed: {
    cTitle(){
      let t = this.$route.query.title;
      if(t === 'undefined'){
        t = ''
      }
      return t;
    }
  },
  mounted(){
    if(1){
      this.$store.dispatch('setVisible',true);
    }else{
      this.$router.replace('/LoginTo?reuri='+ encodeURIComponent(this.$route.fullPath))
      //window.location.href = window.location.origin + '/mashangban/nos!14?turnto=' + this.$route.fullPath;
    }

    window.onresize = ()=>{
      document.querySelector('textarea').scrollIntoView(true)
      // document.querySelector('.g-content').scrollTop = 10000;
    }
  },
  methods: {
    actionSubmit(){
      var reqd = {
        reminderId:this.id,
        content:this.content
      }
      this.publicApi.reToReminder(reqd).then((res)=>{
        if(res.data.status === 200){
          this.$vux.toast.show({
            text:'操作成功，即将返回列表页',
            isShowMask:true,
            time:1000,
            onHide:()=>{
              this.$router.replace({path:'/TodoList'})
            }
          });
        }else{
          this.$vux.toast.show({text:res.data.message, type:'warn'})
        }
      })
    },
    actionCancel(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="less">
.g-viewbox > .dw-handling {
  background: #ffffff;
  .weui-cells__title {
    margin: 1.8vh 3%;
    padding: 0px;
    font-size: 15px;
    color: #292929;
  }
  .weui-cell {
    background: #f4f4f4;
    font-size: 15px;
    padding: 1.8vh 3%;
    .weui-textarea {
      background: #f4f4f4;
    }
  }
  .weui-btn {
    width: 80%;
  }
  .btn{
    &.weui-btn:after{
      border: 4px solid #dfdfdf;
    }
  }
}
</style>
