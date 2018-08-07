<template>
  <section :id="id">
  </section>
</template>

<script>
  import {getChartData} from '../../api/api';
    export default {
        name: "line-chart",
        data(){
          return{
            myChart: '',
            list: [],
            option: {
                  grid: {
                    x: 20,
                    y: 20,
                    x2:20
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    interval: 'auto',
                    inside: true,
                    axisTick:{
                      show: false
                    },
                    // axisLine: {
                    //   show: false
                    // },
                    data: ['0h', '1h', '2h', '3h', '4h', '5h', '6h','7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h','21h','22h', '23h','24h']
                  },
                  yAxis: {
                    type: 'value',
                    show: false
                  },
	              tooltip: {
		              trigger: 'axis',
		              // formatter: function (param) {
                       //    console.log('param',param)
		              // }
	              },
                  series: [
                    {
                      name: '',
                      type: 'line',
                      data: [],
                      symbolSize:0,
                      smooth: true,
                      lineStyle: {
                        normal: {
                          width: 0
                        }
                      },
                      areaStyle: {
                        normal: {
                          color: '#ef7f5d',
                          opacity: 1
                        }
                      }
                    }]
            }
          }
        },
        mounted(){
          getChartData().then(res=>{
            if(res.status == 0){
              this.list = {};
	            for(var key in res.dataMap){
		            var val = [];
		            for(var i=0; i<Object.keys(res.dataMap[key]).length; i++){
			            val.push(parseFloat(res.dataMap[key][i+'h']));
		            }
		            this.list[key] = val;
	            }
              this.drawLine();
            }
          })
        },
        props: {
          id: {
            type: String
          },
          seriesData: {
            type: Array
          },
          name: {
          	type: String,
              default: 'co2'
          }
        },
        watch:{
          seriesData(){
            this.option.series[0].data = this.seriesData;
            this.myChart.setOption(this.option);
            this.myChart.resize();
          },
          name(){
	          this.option.series[0].name = this.name;
	          this.myChart.setOption(this.option);
	          this.myChart.resize();
          }
        },
        methods: {
          drawLine() {
            var chart = document.getElementById(this.id);
            function resizeContainer() {
              //alert('innerHeight:'+window.innerHeight);
              chart.style.width = window.innerWidth-52+'px';
              chart.style.height = window.innerHeight/4+'px';
            }
            resizeContainer();
            // 基于准备好的dom，初始化echarts实例
            this.myChart = new this.$echarts.init(document.getElementById(this.id));
            // 绘制图表
            this.option.series[0].data = this.seriesData;
            console.log('name',this.name);
            this.option.series[0].name = this.name;
            this.myChart.setOption(this.option);

            //用于使chart自适应高度和宽度
            document.addEventListener('resize', function (e) {
              e.preventDefault();
              //重置容器高宽
              resizeContainer()
              this.myChart.resize();
            }, {passive: true})

            clearInterval(timer);
            var timer = setInterval(()=>{
              this.option.series[0].data = this.seriesData;
              this.myChart.setOption(this.option);
              this.myChart.resize();
            }, 3000);
          }
        },
        beforeDestroy(){
          window.removeEventListener('resize', this.myChart.resize, {passive: true})
        }
    }
</script>

<style scoped>

</style>
