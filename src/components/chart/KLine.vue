<template>
    <ve-line ref="kLineChart" v-bind="option"></ve-line>
    <!--<ve-candle ref="kLineChart" :data="chartData" :settings="chartSettings" v-bind="option"></ve-candle>-->
</template>

<script>
    import {findKLine} from  '../../api/api';
    let resultMA5 = [];
    let resultMA10 = [];
    let resultMA20 = [];
    let resultMA30 = [];
	export default {
		name: "k-line",
        data(){
			return {
                code: '600837',
				option: {}
            }
        },
        mounted(){
            this.findKLineData();
        },
        methods: {
	        async findKLineData(){
		        let res = await findKLine({stockCode: this.code, period:"7", position:0, num:10000000, exRight:2});
		        let result=res;
		        this.option=this.getOption(result);
            },
	        getOption(res){
	        	let data = this.parseData(res);
                let maxColumn = Math.max.apply(null, data.volumns);
		        let $this = this;
		        let datalen = data.length;
		        let legengdata = datalen <= 22 ? ['K线指标'] : ['K线指标', 'MA5', 'MA10', 'MA20', 'MA30'];
		        let option ={
                    tooltip: {
	                    trigger: 'axis',
	                    axisPointer: {
		                    type: "none",
		                    axis: "x",
		                    animation: false,
		                    animationDurationUpdate: 1,
		                    lineStyle: {
			                    color: '#3d3d3d',
			                    type: "solid",
			                    width: 1
		                    },
		                    shadowStyle: {
			                    shadowColor: 'rgba(0, 0, 0, 0)',
			                    shadowBlur: 0
		                    }
	                    },
	                    textStyle: {
		                    color: "#3d3d3d"
	                    },
	                    position: function (pt, arr, dom) {
		                    return ["0", '-0'];
	                    },
	                    backgroundColor: "#fff",
	                    extraCssText: "width:100%;height:0px;margin-left:0%;padding:0px",
	                    formatter: function (param, sticket) {
		                    let data = res;
		                    let dataIndex = param[0].dataIndex;
		                    let m5 = dataIndex > 5 ? resultMA5[dataIndex] : "";
		                    let m10 = dataIndex > 10 ? resultMA10[dataIndex] : "";
		                    let m20 = dataIndex > 20 ? resultMA20[dataIndex] : "";
		                    let m30 = dataIndex > 30 ? resultMA30[dataIndex] : "";
		                    let value = data[dataIndex];
		                    let g = $this.$refs.kLineChart.echarts;
		                    let grid = g.getOption().grid[0];
		                    let top = parseFloat(grid.top) * 0.0025;
		                    let right = parseFloat(grid.right) * 0.0025;
		                    let left = parseFloat(grid.left) * 0.0025;
		                    let topX = g.getHeight() * top;
		                    let leftY = g.getWidth() * left;
		                    let rightY = g.getWidth() * right;
		                    let pointX = g.convertToPixel({ xAxisIndex: 1 }, dataIndex);
		                    let pointY = g.convertToPixel({ yAxisIndex: 0 }, value[1]);
		                    let height = g.getHeight() * (1 - top *2);
		                    let width = g.getWidth() * (1 - left - right);
		                    let result = '';
		                    let MAtext = "<div style='position:absolute;width:100%;font-size:12px;top:" + (topX - 28) + "px;left:" + leftY + "px;color:#B9B9B9'>"
			                    + "<span>MA5:" + m5 + "</span> " + "<span>MA10:" + m10 + "</span> "
			                    + "<span>MA20:" + m20 + "</span> " + "<span>MA30:" + m30 + "</span></div>";
		                    let datatxt = "<p style='font-weight:600;font-size:14px;text-align:center'>" + value[0] + "</p>"
			                    + "<p>开盘价：<span style='float:right'>" + value[1] + "</span></p>" + "<p>收盘价：<span style='float:right'>" + value[2] + "</span></p>"
			                    + "<p>最低价：<span style='float:right'>" + value[3] + "</span></p>" + "<p>最高价：<span style='float:right'>" + value[4] + "</span></p>"
			                    + "<p>成交额：<span style='float:right'>" + value[6] + "</span></p>" + "<p>成交量：<span style='float:right'>" + value[5] + "</span></p>";
		                    let divLine = "<div style='position:absolute;width:1px;height:" + height + "px;background-color:#00A0E8;top:" + topX + "px;left:" + pointX + "px'></div>"//竖线
			                    + "<div style='position:absolute;height:1px;width:" + width + "px;background-color:#00A0E8;left:" + leftY + "px;top:" + pointY + "px'></div>"; //横线
		                    let textLeft = "<div style='position:absolute;    z-index: 9;border:1px #B4CCFC solid;padding:2px;background-color:rgba(255,255,255,0.7);width:120px;height:150px;font-size:12px;top:" + topX + "px;left:" + leftY + "px'>"
			                    + datatxt + "</div>" + divLine;
		                    let textRight = "<div style='position:absolute;    z-index: 9;border:1px #B4CCFC solid;padding:2px;background-color:rgba(255,255,255,0.7);width:120px;height:150px;font-size:12px;top:" + topX + "px;right:" + rightY + "px'>"
			                    + datatxt + "</div>" + divLine;
		                    if (pointX < parseInt(width / 2)) {
			                    result = textRight + MAtext;
		                    } else {
			                    result = textLeft + MAtext;
		                    }
		                    return result;
	                    }
                    },
			        grid: [
				        {
					        top: 60,
					        left: 60,
					        right: 30,
					        containLabel:false,
					        height: '50%',
				        },
				        {
					        left: 60,
					        right: 30,
					        top: '70%',
					        containLabel:false,
					        height: '15%',
				        }
			        ],
			        xAxis: [
                        {
                        	type: 'category',
                            gridIndex: 0,
	                        data: data.categoryData,
	                        scale: true,
	                        axisTick:{length:3,lineStyle:{color:'#ff0000'}},
	                        splitNumber: 20,
	                        min: 'dataMin',
	                        max: 'dataMax',
	                        axisLabel: { show: false },
	                        boundaryGap: false,
                        },
				        {
					        type: 'category',
					        gridIndex: 1,
					        data: data.categoryData,
					        scale: true,
					        axisLine: {
						        onZero: false,
						        lineStyle: {
							        width: 0.3,
							        color: '#B9B9B9',
							        shadowColor: "rgba(0,0,0,0)"
						        }
					        },
					        splitNumber: 20,
					        min: 'dataMin',
					        max: 'dataMax'
				        }
                    ],
			        yAxis: [
                        {
	                        gridIndex: 0,
	                        axisTick: { show: false },
	                        axisLine: {
		                        lineStyle: {
			                        width: 0.3,
			                        color: '#B9B9B9',
			                        shadowColor: "rgba(0,0,0,0)"
		                        },
                                show: false,
		                        onZero: false,
                            },
	                        min: 'dataMin',
	                        max: 'dataMax',
                            splitLine: {
	                            show: true,
	                            lineStyle: {
		                            width: 0.3,
		                            color: '#d0d0d0'
	                            }
                            }
                        },
                        {
	                        gridIndex: 1,
	                        axisTick: { show: false },
	                        axisLine: {
		                        lineStyle: {
			                        width: 0.3,
			                        color: '#B9B9B9',
			                        shadowColor: "rgba(0,0,0,0)"
		                        },
		                        show: false
	                        },
	                        splitNumber: 2,
	                        axisLabel: {
		                        show: true,
		                        formatter: function (value, index) {
			                        return (value/10000).toFixed(2)*1 + '万';
		                        },
		                        textStyle: {
			                        fontWeight: "bold",
			                        color: "#3d3d3d",
			                        fontSize: 12
		                        }
	                        },
	                        min: 0,
	                        max: 'dataMax',
	                        splitLine: {
		                        show: true,
		                        lineStyle: {
			                        width: 0.3,
			                        color: '#d0d0d0'
		                        }
	                        }
                        }
                    ],
			        dataZoom: [
				        {
					        type: 'inside',
					        xAxisIndex: [0, 1],
					        start: datalen <= 22 ? 0 : 30,
					        end: 100
				        }, {
					        show: true,
					        dataBackground: {
						        lineStyle:{
							        color:'#b9b9b9'
						        },
						        areaStyle:{
							        color:'#b9b9b9'
						        }
					        },
					        textStyle:{
						        color:'#b9b9b9'
					        },
					        xAxisIndex: [0, 1],
					        type: 'slider',
					        top: '100%',
					        start: datalen <= 22 ? 0 : 40,
					        end: 100
				        }
			        ],
                    series: [
                        {
                        	name: 'K线指标',
	                        type: 'candlestick',
	                        data: data.values,
	                        itemStyle: {
		                        normal: {
			                        color: '#FF2318',
			                        color0: '#43A950',
			                        borderColor: null,
			                        borderColor0: null
		                        }
	                        }
                        },
                        {
	                        name: '成交量',
	                        type: 'bar',
	                        data: data.volumns,
	                        xAxisIndex: 1,
	                        yAxisIndex: 1
                        },
                        {
	                        name: 'MA5',
	                        type: 'line',
	                        data: this.calculateMA(5, data),
	                        symbol: 'none',
	                        smoothMonotone: 'x',
	                        sampling: 'average',
	                        lineStyle: {
		                        normal:{
			                        // color:'#1aba3c',
			                        width:1,
			                        opacity:0.8
		                        }
	                        }
                        },
                        {
	                        name: 'MA10',
	                        type: 'line',
	                        data: this.calculateMA(10, data),
	                        symbol: 'none',
	                        smoothMonotone: 'x',
	                        sampling: 'average',
	                        lineStyle: {
		                        normal:{
			                        // color:'#1aba3c',
			                        width:1,
			                        opacity:0.8
		                        }
	                        }
                        },
	                    {
		                    name: 'MA20',
		                    type: 'line',
		                    data: this.calculateMA(20, data),
		                    symbol: 'none',
		                    smoothMonotone: 'x',
		                    sampling: 'average',
		                    lineStyle: {
			                    normal:{
				                    // color:'#1aba3c',
				                    width:1,
				                    opacity:0.8
			                    }
		                    }
	                    },
	                    {
		                    name: 'MA30',
		                    type: 'line',
		                    data: this.calculateMA(30, data),
		                    symbol: 'none',
		                    smoothMonotone: 'x',
		                    sampling: 'average',
		                    lineStyle: {
			                    normal:{
				                    // color:'#1aba3c',
				                    width:1,
				                    opacity:0.8
			                    }
		                    }
	                    }
                    ]
                }
                return option;
            },
	        parseData(data){
		        let categoryData = [];
		        let values = [];
		        let volumns = [];

		        let item;
		        for (let i = 0; i < data.length; i++) {
			        categoryData.push(data[i][0]);
                    item = [data[i][1] * 1, data[i][2] * 1, data[i][3] * 1, data[i][4] * 1];

			        if (data[i][1] * 1 == 0 && data[i][2] * 1 == 0) {
				        values.push({ value: item, itemStyle: { 'normal': { 'opacity': 0 } } });
			        } else if (data[i][1] * 1 == data[i][2] * 1 && data[i][2] * 1 == data[i][3] * 1 && data[i][3] * 1 == data[i][4] * 1 && data[i][4] * 1 == data[i][1] * 1) {
				        values.push({ value: item, itemStyle: { 'normal': { 'color': '#FF2318', 'color0': '#FF2318' } } });
			        } else {
				        values.push(item);
			        }

			        if (data[i][2] * 1 >= data[i][1] * 1) { //收盘价大于开盘价 成交量是红色
				        volumns.push({ value: data[i][5] * 1, itemStyle: { 'normal': { 'color': '#FF2318' } } });
			        } else { //相反
				        volumns.push({ value: data[i][5] * 1, itemStyle: { 'normal': { 'color': '#43A950' } } });
			        }
                }
		        return {
			        categoryData: categoryData,
			        values: values,
			        volumns: volumns
		        };
            },
	        calculateMA(dayCount, data){
		        let result = [];
		        for (let i = 0, len = data.values.length; i < len; i++) {
			        if (i < dayCount) {
				        result.push('-');
				        continue;
			        }
			        let sum = 0;
			        for (let j = 0; j < dayCount; j++) {
				        sum += parseFloat(data.values[i - j][1]);
			        }
			        result.push(+(sum / dayCount).toFixed(2));
		        }
		        switch (dayCount) {
			        case 5:
				        resultMA5 = result;
				        break;
			        case 10:
				        resultMA10 = result;
				        break;
			        case 20:
				        resultMA20 = result;
				        break;
			        case 30:
				        resultMA30 = result;
				        break;
			        default:
				        break;
		        }
		        return result;
            }
		}
	}
</script>

<style scoped>

</style>
