<template class="test">
    <div class="g-content ju-todo-detail">
      <group class="g-group" label-width="5.2em" :gutter="0">
        <cell title="标题"
              value-align="left">{{dataDetail.title}}</cell>
        <cell title="创建人"
              value-align="left">{{dataDetail.creator}}</cell>
        <cell title="创建时间"
              value-align="left">{{dataDetail.createTime}}</cell>
        <cell title="截止时间"
              value-align="left">{{dataDetail.endTime}}</cell>
        <cell title="置办人员"
              value-align="left">
          <div class="cont-wrap">
            <span class="cont">
              {{nameArrayToStr(dataDetail.staffs)}}
            </span>
          </div>
        </cell>
        <cell title="已办人员"
              value-align="left">
          <div class="cont-wrap">
            <span class="cont">
              {{nameArrayToStr(dataDetail.handledStaffs)}}
            </span>
          </div>
        </cell>
        <cell title="未办人员"
              value-align="left">
          <div class="cont-wrap unhandle-wrap">
            <span class="cont">
              {{nameArrayToStr(dataDetail.unhandledStaffs)}}
            </span>
            <span @click="checkUnhandleStaffs" class="btn-check">查看</span>
          </div>
        </cell>
        <cell title="响应人数"
              value-align="left">{{dataDetail.responseNum}}/{{dataDetail.attendNum}}</cell>
        <cell title="发送模式"
              value-align="left">{{getModeText(dataDetail.sendMode)}}</cell>
        <cell title="发送时间" v-if="dataDetail.sendTime"
              value-align="left">{{dataDetail.sendTime}}</cell>
        <x-textarea :readonly="true"
                    title="内容"
                    :autosize="true"
                    :rows="2"
                    v-model="dataDetail.content"> </x-textarea>
      </group>
      <group label-width="5.2em" :gutter="4" class="g-group" style="margin-bottom: 40px;">
        <cell title="置办意见" value-align="left">
          <span class="btn-check" @click="checkOpinions">查看</span>
        </cell>
      </group>
      <div v-if="showBtnHandle" v-show="!showPopup" class="g-btn-fix-bottom" @click="gotoPage(0)">置办</div>
      <div v-if="showBtnUrge" v-show="!showPopup" class="g-btn-fix-bottom" @click="gotoPage(1)">催单</div>

      <div v-transfer-dom>
        <popup v-model="showPopup" height="90%" :hide-on-blur="false" width="100%" @on-show="popupShow" @on-hide="popupHide">
          <div class="ju-detail-popup g-p">
            <div class="title">
              <span>{{cPopupTitle}}</span>
              <i class="iconfont icon-close close" style="padding:5px 10px;margin: -5px -10px 0 0;" @click="showPopup=false"></i>
            </div>
            <div class="cont">
              <!--未置办人员查看-->
              <div class="ju-detail-unhandle-list" v-show="popupType===0">
                <group class="g-group item"
                       label-width="5.2em"
                       :title="item.name"
                       :key="index"
                       v-for="(item,index) in dataDetail.unhandledStaffs">
                  <cell title="所属单位" value-align="left">{{item.departName}}</cell>
                  <cell title="职务" value-align="left">{{item.position}}</cell>
                  <cell title="地址" value-align="left">{{item.address}}</cell>
                  <cell title="电话" value-align="left">{{item.officePhone}}</cell>
                  <cell title="手机" value-align="left">{{item.cellPhone}}</cell>
                  <cell title="邮箱" value-align="left">{{item.email}}</cell>
                </group>
              </div>
              <!--置办意见查看-->
              <div class="ju-detail-opinion-list" v-show="popupType===1">
                <group v-for="(item,index) in dataOpinionList"
                       :title="item.name"
                       :key="index"
                       label-width="5.2em"
                       class="g-group item">
                  <cell value-align="left">
                    <span slot="title" class="title-label">置办意见</span>
                    <m-fold-part v-model="item.content"> </m-fold-part>
                  </cell>
                  <cell title="响应时长" value-align="left">{{transferReponseTime(item.reDuration)}}</cell>
                  <cell title="回复时间" value-align="left">{{item.time}}</cell>
                </group>
              </div>
            </div>
          </div>
        </popup>
      </div>
      <!--<div style="position: absolute; background: rgba(0,0,0,0.5);left: 0;top: 0;right: 0;bottom: 0;">-->
        <!--<div style="height: 300px;width: 100%; background: #f90;overflow: scroll">-->
          <!--<div style="height: 2000px;">123</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
</template>

<script>
  import {Group, Cell, XTextarea, Popup,TransferDom} from 'vux'
  import foldpart from '@/components/foldPart'
  export default{
    name:'detail',
    components:{
      Popup,
      XTextarea,
      Cell,
      Group,
      mFoldPart: foldpart
    },
    directives:{
      TransferDom
    },
    data(){
      return {
        id:this.$route.query.id,
        type: this.$route.query.type,
        dataDetail:{},
        showPopup: false,
        popupType: 0,         //0-置办意见，1-未置办人员,
        dataOpinionList:[],   //意见列表
        showBtnHandle: false, //是否显示置办按钮
        showBtnUrge: false,   //是否显示催单按钮
      }
    },
    computed:{
      cPopupTitle(){
        let t = '';
        switch (this.popupType){
          case 0:
            t = '查看未办人员';
            break;
          case 1:
            t = '查看置办意见';
            break;
          default:
            t = '标题未定义';
            break;
        }
        return t;
      }
    },
    mounted(){
      this.initData();
    },
    methods:{
      initData(){
        //获取对应数据
        // 显示
        this.getData(this.id)
      },
      getData(id){
        this.publicApi.getReminderDetail({reminderId:id}).then((res)=>{
          if(res.data.status === 200){
            if(res.data.data.title){
              this.dataDetail = res.data.data;
              this.showBtn();
            }
            else{
              this.$vux.alert.show({
                content: '当前查询项目为空，请返回！',
                buttonText:'返回置办列表',
                onHide:()=>{
                  this.$router.replace('/TodoList')
                }
              })
            }
          }
          else if(res.data.status === 131){
            this.$vux.alert.show({
              content: '抱歉，您不是该项目的置办人员，无法查看该信息！',
              buttonText:'返回置办列表',
              onShow () {
              },
              onHide:()=>{
                this.$router.replace('/TodoList')
              }
            })
          }
          else{
            this.$vux.toast.show({text:res.data.message, type:'warn'})
          }
        })
      },
      getModeText(mode){
        let t = '';
        switch (mode){
          case 1:
            t = '立即发送'
            break;
          case 2:
            t = '定时发送'
            break;
          case 3:
            t = '随机发送'
            break;
        }
        return t;
      },
      checkUnhandleStaffs(){
        // this.$router.push({path:'/StaffList'})
        this.showPopup = true;
        this.popupType = 0;
      },
      checkOpinions(){
        this.showPopup = true;
        this.popupType = 1;
      },
      nameArrayToStr(data){
        let str = '';
        for(let i in data){
          str += data[i].name;
          if(i <= data.length-2){
            str += '、'
          }
        }
        return str;
      },
      gotoPage(type){
        if(type === 0){
          this.$router.push({path:`/Handle/${this.id}?title=${this.dataDetail.title}`})
        }
        else if(type === 1){
          //获取未办人员邮箱
          let idlist = [];
          console.log(this.dataDetail.unhandledStaffs)
          this.dataDetail.unhandledStaffs.forEach((it,i)=>{
            idlist.push(it.userId);
          })
          this.publicApi.getEmails({ids:idlist.toString()}).then(res=>{
            if(res.data.status === 200){
              this.$router.push({name:'MailTo',
                params:{emails:res.data.data,attach:"",type:0,title:this.dataDetail.title }
              })
            }
            else{
              this.$vux.toast.text('获取邮箱列表失败，请重试')
            }
          })
        }
      },
      transferReponseTime(m){
        let d = 0, h = 0;
        if(m < 60){
        }
        else{
          h = parseInt(m/60);
          if( h < 24){
            //do nothing
          }
          else{
            d = parseInt(h/24);
          }
        }
        h = h % 24;
        m = m % 60;
        if(h===0&&d===0){
          return m+'分钟';
        }
        else if(h!==0&&d===0){
          return h + '小时'+ m +'分钟'
        }
        else{
          return d + '天' + h+ '小时' + m + '分钟'
        }
      },
      popupShow(){
        // let bodydom = document.querySelector('body');
        // let maskdom = document.querySelector('.vux-popup-mask');
        // let popdom = document.querySelector('.ju-detail-popup');
        // bodydom.ontouchstart = (ev)=>{console.log('body');}
        // maskdom.ontouchstart = (ev)=>{console.log('mask');ev.stopPropagation()}
        // popdom.ontouchstart = (ev)=>{console.log('popup');ev.stopPropagation()}

        document.querySelector('.g-viewbox .rview').style.overflow='hidden';

        //需触发样式更新，所以在popup show之后进行数据初始化
        if(this.popupType===1){
          this.dataOpinionList = this.dataDetail.handledStaffs;
        }
      },
      popupHide(){
        document.querySelector('.g-viewbox .rview').style.overflow='auto'
      },
      showBtn(){
        //userStatus---1:发起者，2:已办，3:未办，发起者可以催单，已办的没有催单或置办按钮，未办的可以置办
        switch (parseInt(this.dataDetail.userStatus)){
          case 1:
            this.showBtnHandle = false;
            if(this.dataDetail.sendTime && new Date().getTime() - new Date(this.dataDetail.sendTime.replace(/-/g, "/")).getTime() > 0
              && this.dataDetail.unhandledStaffs.length > 0){
              this.showBtnUrge = true;
            }
            else{
              this.showBtnUrge = false;
            }
            break;
          case 2:
            this.showBtnHandle = false;
            this.showBtnUrge = false;
            break;
          case 3:
            this.showBtnHandle = true;
            this.showBtnUrge = false;
            break;
          default:
            break;
        }
        // if(this.$route.query.share === '1'){
        //   //分享出去的详情页
        //   switch (parseInt(this.dataDetail.userStatus)){
        //     case 1:
        //       this.showBtnHandle = false;
        //       if(this.dataDetail.sendTime && new Date().getTime() - new Date(this.dataDetail.sendTime.replace(/-/g, "/")).getTime() > 0
        //         && this.dataDetail.unhandledStaffs.length > 0){
        //         this.showBtnUrge = true;
        //       }
        //       else{
        //         this.showBtnUrge = false;
        //       }
        //       break;
        //     case 2:
        //       this.showBtnHandle = false;
        //       this.showBtnUrge = false;
        //       break;
        //     case 3:
        //       this.showBtnHandle = true;
        //       this.showBtnUrge = false;
        //       break;
        //     default:
        //       break;
        //   }
        // }
        // else{
        //   //页面内跳转
        //   if(this.type === 'todo'){
        //     this.showBtnHandle = true;
        //     this.showBtnUrge = false;
        //   }
        //   else if(this.type==='launched'){
        //     this.showBtnHandle = false;
        //     //发送时间内且有未办人员，则显示
        //     if(this.dataDetail.sendTime && new Date().getTime() - new Date(this.dataDetail.sendTime.replace(/-/g, "/")).getTime() > 0
        //       && this.dataDetail.unhandledStaffs.length > 0){
        //       this.showBtnUrge = true;
        //     }
        //     else{
        //       this.showBtnUrge = false;
        //     }
        //   }
        //   else{
        //     this.showBtnHandle = false;
        //     this.showBtnUrge = false;
        //   }
        // }
      }
    }
  }
</script>

<style>
  .vux-popup-mask,.vux-popup-dialog{
    position: absolute !important;
    overflow-y: hidden !important;
  }
</style>
