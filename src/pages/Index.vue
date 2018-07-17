<template>
	<div>
		<p>入口，暂缺</p>
		<ul>
			<!--<li>-->
				<!--<router-link to="/Create">创建</router-link>-->
			<!--</li>-->
			<!--<li>-->
				<!--<router-link to="/TodoList">置办</router-link>-->
			<!--</li>-->
			<!--<li>-->
				<!--<router-link to="/QueryList">查询统计</router-link>-->
			<!--</li>-->
		<!--</ul>-->
		<!--<ul>-->
			<!--<li>-->
				<!--<router-link to="/MailTo/export">导出/催单</router-link>-->
			<!--</li>-->
			<!--<li>-->
				<!--<router-link to="/StaffList">人员列表</router-link>-->
			<!--</li>-->
      <!--<li>-->
        <!--<router-link to="/Detail/1">置办详情</router-link>-->
      <!--</li>-->
      <li>
        <router-link to="/Register">注册</router-link>
      </li>
		</ul>
	</div>
</template>

<script>
  export default{
    data(){
      return {}
    },
    methods:{
      gotoMail(){
        this.$router.push({name:'MailTo', params:{emails:["1@qq.com","2@qq.com"], attach:{name:"123"}, type:1}})
      }
    }
  }
</script>

<style>
</style>
