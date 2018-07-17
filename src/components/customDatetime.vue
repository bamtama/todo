<template>
  <div class="g-datetime-selection">
    <div class="date-selection" v-bind:class="{'z-selected':cdate}">
      <group gutter="0">
        <calendar title="" v-model="cdate" :start-date="cstartdate" :end-date="cenddate" v-on:on-change="actionChange"></calendar>
      </group>
    </div>
    <div class="time-selection" v-bind:class="{'z-selected':ctime}">
      <group gutter="0">
        <!--注意format参数需要添加空格以触发vux-datetime的初始值格式化-->
        <!--parseDate正则后检测位数来确定初始值，即X:Y:Z三位会被匹配为年月日初始值，不更改vux源代码的情况下，使用此种方式避免匹配错误-->
        <datetime v-model="ctime" format="HH:mm:ss "
                  v-on:on-change="actionChange"> </datetime>
      </group>
    </div>
  </div>
</template>

<script>
  import {Group, Datetime, Calendar} from 'vux'
  export default {
    name: "customDatetime",
    components:{
      Group, Datetime, Calendar
    },
    props:['date','time','startdate','enddate'],
    data(){
      return{
        cdate: this.date,
        ctime: this.time,
        cstartdate: this.startdate,
        cenddate: this.enddate,
      }
    },
    // watch:{
    //   cdate(val){
    //     this.onValueChange()
    //   },
    //   ctime(val){
    //     this.onValueChange()
    //   }
    // },
    mounted(){

    },
    methods:{
      onValueChange(){
        //此处数据传出给父组件
        //去掉时分秒后的空格
        this.$emit('value-change', {d:this.cdate, t:this.ctime.replace(/(\s*$)/g,"")})
      },
      actionChange(){
        this.onValueChange()
      }
    }
  }
</script>

<style scoped>

</style>
