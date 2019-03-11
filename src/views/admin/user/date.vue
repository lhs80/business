<style rel="stylesheet/scss" lang="scss" >
	@import '../../../../static/laydate/theme/default/laydate.css';
</style>

<template>
  <div class="app-container calendar-list-container">
      <div class="site-demo-laydate">
		  <div id="test-n1"></div>
		</div>
  </div>
  
</template>
con
<script>
//自定义重要日
  export default {
	data(){
			return {
				 
				 
		     };
	},
	computed: {
	},
	filters: {
	},
	created() {
		
	},
	mounted:function(){
	  laydate.render({
	    elem: '#test-n1',
	    position: 'static',
		mark: {
		      '0-10-14': '生日',
		      '0-12-31': '跨年', //每年的日期
		      '0-0-10': '工资', //每月某天
		      '0-0-15': '月中',
		      '2017-8-15': '' ,//如果为空字符，则默认显示数字+徽章
		      '2099-10-14': '呵呵'
		},
	    done: function(value, date){
	      if(date.year === 2017 && date.month === 8 && date.date === 15){ //点击2017年8月15日，弹出提示语
	        layer.msg('这一天是：中国人民抗日战争胜利72周年');
	      }
	    }
	  });
	},
	methods: {
		
	}
};

</script>