<template>
  <div>
    <div class="g-content">
      <group class="g-group" title="注册新用户">
        <x-input title="用户名" v-model="username"></x-input>
        <x-input :max="13" is-type="china-mobile" type="tel" title="手机号" v-model="cellphone"></x-input>
      </group>
      <box gap="40px 55px">
        <x-button type="primary" @click.native="actionReg">注册</x-button>
      </box>
    </div>
  </div>
</template>
<script>
  import {Group, XInput,XButton,Cell,Box} from 'vux';
  export default {
    components: {
      Box,
      Cell,
      XInput,
      XButton,
      Group},
    name: "register",
    data(){
      return{
        username:'',
        cellphone:''
      }
    },
    mounted(){
      this.$store.dispatch('setVisible',true);
    },
    methods:{
      actionReg(){
        var reqdata = {
          name: this.username,
          phoneNum: this.cellphone
        }

        if(!reqdata.name || !reqdata.phoneNum){
          this.$vux.toast.text('请输入完整信息')
          return false;
        }
        if(!/^(\+?0?86\-?)?1[3456789]\d{9}$/.test(reqdata.phoneNum)){
          this.$vux.toast.text('请输入正确的手机号码')
          return false;
        }

        this.publicApi.register(reqdata).then(res=>{
          if(res.data.status === 200){
            //注册成功
            this.$vux.toast.show({
              text:'注册成功，即将跳转',
              time:1000,
              onHide:()=>{
                this.$router.push({path:'/Create'})
              }
            })
          }
          else{
            this.$vux.toast.text(res.data.message)
          }
        })
      }
    }
  }
</script>
<style>

</style>
