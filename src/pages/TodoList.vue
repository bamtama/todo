<template>
	<div>
    <div class="g-content">
      <div class="mescroll" id="mescroll" v-bind:style="{height:scrollheight+'px'}" >
        <group class="ju-todolist" :gutter="0">
          <cell value-align="left"
                v-for="(item,index) in dataTodoList"
                :link="itemLink(item.reminderId)"
                :key="item.index">
            <h5>{{item.title}}</h5>
            <div class="person">
              <span>发起人：{{item.createName}}</span>
              <span>响应 {{item.responseNum}}/{{item.attendNum}} 人</span>
            </div>
            <div class="time">
              <span><template v-if="item.sendTime">发送时间：{{item.sendTime}}</template></span>
              <!--<span v-if="item.finish===1" class="warning">未完成</span>-->
              <span v-if="item.finish===2" class="warning">已完成</span>
              <span v-if="item.finish===3" class="warning">超时未完成</span>
            </div>
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
  import {Group,Cell} from "vux";
  import MeScroll from '../assets/libs/mescroll.m'
  export default{
    name:'todolist',
    components:{
      Group,
      Cell
    },
    data(){
      return{
        dataTodoList:[],
        pageSize: 10,
        pageIndex: 0,
        mescroll: null,
        total: 0,
        isListInit: true,
        scrollheight: 0
      }
    },
    mounted(){
      console.log('todo')
      this.initData()
    },
    computed:{
    },
    methods:{
      initData(){
        //获取数据列表
        this.pageSize = 10;
        this.pageIndex = 0;
        this.initScroll()
      },
      initScroll(){
        let self = this;
        this.scrollheight = window.document.body.clientHeight-50;
        this.mescroll = new MeScroll("mescroll", {
          down:{
            callback: self.getList,
            auto: true,
            offset: 60
          }
        });
      },
      getList(){
        console.log('从后台获取数据列表信息')
        let reqdata = {
          type:1
        }
        //马上隐藏加载中。。
        this.mescroll.endSuccess(10, true)
        this.publicApi.getReminderList(reqdata).then((res)=>{
          if(res.data.status === 200){
            this.dataTodoList = res.data.data;
          }
          else{
            this.$vux.toast.show({text:res.data.message, type:'warn'})
          }
        })
      },
      itemLink(id){
        return `/Detail?type=todo&id=${id}`
      }
    }
  }
</script>
<style>
  @import url("../assets/libs/mescroll.min.css");
</style>
