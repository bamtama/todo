<template>
  <div class="dw-ugerAndExport g-content">
    <div>
      <group>
        <x-input title="收件人：" v-model="recipient" :label-width="'100%'" :show-clear="false" required></x-input>
        <x-input title="抄&emsp;送：" v-model="duplicate" :label-width="'100%'" :show-clear="false"></x-input>
        <x-input title="主&emsp;题：" v-model="title" :label-width="'100%'" :show-clear="false" required></x-input>
        <cell value-align="left" v-if="type">
          <div slot="title" class="attach-label">附&emsp;件：</div>
          <div class="attach-wrap">
            <svg class="svg-icon">
              <use xlink:href="#icon-zip"></use>
            </svg>
            <span>{{attachment}}</span>
          </div>
        </cell>
        <x-textarea title="正&emsp;文："
                    :height="120"
                    v-model="content"
                    @on-focus="textareaFocus = true"
                    @on-blur="textareaFocus = false"></x-textarea>
      </group>
    </div>
      <flexbox :gutter="10" style="padding: 40px 55px;">
        <flexbox-item>
          <x-button type="primary" @click.native="actionSend" :show-loading="isLoading">发送</x-button>
        </flexbox-item>
      </flexbox>
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
    Box,
    Cell,
    dateFormat
  } from "vux";

  import { cookie } from 'vux'

  export default {
    name: "MailTo",
    components: {
      Cell,
      XButton,
      XTextarea,
      Group,
      XInput,
      Flexbox,
      FlexboxItem,
      Box
    },
    data() {
      return {
        type: 0, //1-导出，0-催单
        recipient: '',
        duplicate: '',
        title: this.getDefault(),
        attachment: '',
        noemailNames:[],
        content: this.getDefault(),
        textareaFocus:false,
        isLoading:false
      };
    },
    computed: {
    },
    mounted(){
      if(1){
        this.$store.dispatch('setVisible',true);
        this.saveData()
      }else{
        this.$router.replace('/LoginTo?reuri='+ encodeURIComponent(this.$route.fullPath))
        //window.location.href = window.location.origin + '/mashangban/nos!14?turnto=' + this.$route.fullPath;
      }

      window.onresize = ()=>{
        if(this.textareaFocus){
          document.querySelector('textarea').scrollIntoView(true)
          // document.querySelector('.g-content').scrollTop = 10000;
        }
      }
    },
    methods: {
      saveData(){
        console.log(this.$route.params.emails )
        let params = this.$route.params.emails ? this.$route.params : JSON.parse(window.localStorage.getItem('MailInfo'));
        console.log(params)
        if(params.emails){
          this.type = params.type;
          this.recipient = this.toEmailString(params.emails);
          this.duplicate = '';
          this.attachment = params.attach;
          if(this.type === 0){
            this.title = '【催单】'+params.title;
            this.content = '请尽快置办！';
          }
          window.localStorage.setItem('MailInfo',JSON.stringify(params))

          //提示当前无email的姓名
          if(this.noemailNames.length > 0){
            this.$vux.alert.show({
              content: `未获取到${this.noemailNames.toString()}的邮箱地址，请手动添加`,
              buttonText:'我知道了'
            })
          }
        }
        else{
          this.$vux.toast.show({
            text:'获取数据失败，即将跳转到列表页',
            type:'warn',
            time: 1000,
            onHide:()=>{
              this.$router.push('/QueryList')
            }
          })
        }
      },
      toEmailString(arr){
        let arr1 = [], arr2 = [];
        for(let i in arr){
          if(arr[i].email){
            arr1.push(arr[i].email)
          }
          else{
            arr2.push(arr[i].name);
          }
        }
        this.noemailNames = arr2;
        return arr1.toString();
      },
      actionSend(){
        let emails = [];
        if(this.recipient.length <= 0){
          this.$vux.toast.show({
            text:'无收件人，请填写后发送',
            type:'warn'
          })
          return false;
        }
        var reqdata = {
          type:this.type,
          recMails: [this.recipient].toString(),
          copyMails:[this.duplicate].toString(),
          filePath: this.attachment,
          title:this.title,
          content:this.content
        }
        console.log(reqdata)
        this.isLoading = true;
        this.publicApi.sendMail(reqdata).then(res=>{
          this.isLoading = false;
          if(res.data.status === 200){
            this.$vux.toast.show({
              text:'发送成功，即将回到列表页',
              time: 1000,
              onHide:()=>{
                this.$router.go(-1)
                //this.$router.replace({path:'/QueryList'})
              }
            })
          }else{
            this.$vux.toast.text(res.data.message)
          }
        })
      },
      getDefault(){
        return  `事项集 ` + dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
      }
    }
  };
</script>

<style lang="less">
  .dw-ugerAndExport {
    padding-bottom: 0;
    .weui-cells {
      margin: 0px;
      font-size: 15px;
      .disabled{
        color: initial;
      }
      .weui-cell {
        padding: 1.8vh 3%;
        &::before {
          width: 100%;
          height: 1px;
          background-color: #c5c5c5;
        }
        .weui-label{
          width: 100% !important;
        }
      }
    }
    .weui-btn {
      width: 91%;
    }
    .attach-label{
      width: 64px;
      flex: none;
    }
    .attach-wrap{
      flex: auto;
      height: 19px;
      position: relative;
      .svg-icon{
        position: absolute;
        font-size: 32px;
        top: -6px;
        left: -6px;
      }
      &>span{
        position: absolute;
        left: 28px;
        right: 0;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        color: #292929;
      }
    }
  }
</style>
