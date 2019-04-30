<template>
    <ve-line ref="timeShareChart" v-bind="option"></ve-line>
    <!--<div style='position:absolute;border:1px #B4CCFC solid;z-index:33;width:90px;height:150px;top:20px;right:60.52904564315353px;background-color:rgba(255,255,255,0.7);'>-->
        <!--<p>时间:<span style='float:right'>09:30</span></p>-->
        <!--<p>价位:<span style='float:right' class=''>8.48</span></p>-->
        <!--<p>均价:<span style='float:right' class=''>8.48</span></p>-->
        <!--<p>涨跌:<span style='float:right' class=''>0.00</span></p>-->
        <!--<p>涨幅:<span style='float:right' class=''>0.00%</span></p>-->
        <!--<p>现量:<span style='float:right'>1098</span></p>-->
        <!--<p>总量:<span style='float:right'>10.17万</span></p></div>-->
    <!--<div style='position:absolute;width:1px;height:360.03999999999996px;background-color:#00A0E8;top:20px;left:60.52904564315353px'></div>-->
    <!--<div style='position:absolute;height:1px;width:253.94190871369298px;background-color:#00A0E8;top:146.38px;left:60.52904564315353px'></div>-->
</template>

<script>
	import echarts from 'echarts';
    import {getMinuteData} from '../../api/api';
    const categories = ["09:30", "09:31", "09:32", "09:33", "09:34", "09:35", "09:36", "09:37", "09:38", "09:39", "09:40", "09:41", "09:42", "09:43", "09:44", "09:45", "09:46", "09:47", "09:48", "09:49", "09:50", "09:51", "09:52", "09:53", "09:54", "09:55", "09:56", "09:57", "09:58", "09:59", "10:00", "10:01", "10:02", "10:03", "10:04", "10:05", "10:06", "10:07", "10:08", "10:09", "10:10", "10:11", "10:12", "10:13", "10:14", "10:15", "10:16", "10:17", "10:18", "10:19", "10:20", "10:21", "10:22", "10:23", "10:24", "10:25", "10:26", "10:27", "10:28", "10:29", "10:30", "10:31", "10:32", "10:33", "10:34", "10:35", "10:36", "10:37", "10:38", "10:39", "10:40", "10:41", "10:42", "10:43", "10:44", "10:45", "10:46", "10:47", "10:48", "10:49", "10:50", "10:51", "10:52", "10:53", "10:54", "10:55", "10:56", "10:57", "10:58", "10:59", "11:00", "11:01", "11:02", "11:03", "11:04", "11:05", "11:06", "11:07", "11:08", "11:09", "11:10", "11:11", "11:12", "11:13", "11:14", "11:15", "11:16", "11:17", "11:18", "11:19", "11:20", "11:21", "11:22", "11:23", "11:24", "11:25", "11:26", "11:27", "11:28", "11:29", "11:30", "13:01", "13:02", "13:03", "13:04", "13:05", "13:06", "13:07", "13:08", "13:09", "13:10", "13:11", "13:12", "13:13", "13:14", "13:15", "13:16", "13:17", "13:18", "13:19", "13:20", "13:21", "13:22", "13:23", "13:24", "13:25", "13:26", "13:27", "13:28", "13:29", "13:30", "13:31", "13:32", "13:33", "13:34", "13:35", "13:36", "13:37", "13:38", "13:39", "13:40", "13:41", "13:42", "13:43", "13:44", "13:45", "13:46", "13:47", "13:48", "13:49", "13:50", "13:51", "13:52", "13:53", "13:54", "13:55", "13:56", "13:57", "13:58", "13:59", "14:00", "14:01", "14:02", "14:03", "14:04", "14:05", "14:06", "14:07", "14:08", "14:09", "14:10", "14:11", "14:12", "14:13", "14:14", "14:15", "14:16", "14:17", "14:18", "14:19", "14:20", "14:21", "14:22", "14:23", "14:24", "14:25", "14:26", "14:27", "14:28", "14:29", "14:30", "14:31", "14:32", "14:33", "14:34", "14:35", "14:36", "14:37", "14:38", "14:39", "14:40", "14:41", "14:42", "14:43", "14:44", "14:45", "14:46", "14:47", "14:48", "14:49", "14:50", "14:51", "14:52", "14:53", "14:54", "14:55", "14:56", "14:57", "14:58", "14:59", "15:00"];
	const shareColor = function (info) {
		const num = typeof info === 'object' ? (info.currentPrice * 1 - info.lastPrice * 1) : (info * 1);
		if (isNaN(num))return '';
		if (num < 0) {
			return 'green';
		}
		if (num > 0) {
			return 'red'
		}
		return '';
	}
	const toDecimal2 = function (x, size){
		if (x === '0E-8') return "0.00";
		if (x === '--') return x;
		size = !size && size !== 0 ? 2 : size;
		var f = parseFloat(x);
		if (isNaN(f)) {
			return '0.00';
		}
		var f = f.toFixed(size);
		var s = f.toString();
		var rs = s.indexOf('.');
		if (rs < 0 && size !== 0) {
			rs = s.length;
			s += '.';
		}
		while (s.length <= rs + size) {
			s += '0';
		}
		return s;
	}

    export default {
		name: "time-share",
		data: function () {
			return {
				option: {},
				code: '600837'
			}
		},
        mounted(){
	        this.findTimeSharing({stockCode: this.code});
        },
        methods: {
	        async findTimeSharing({stockCode, position=0}){
		        let res =  await getMinuteData({stockCode, position});
		        let newData=res;
		        console.log(newData);
		        // if (!newData.avgLine) {
			     //    return null;
		        // }
		        this.data = newData;
		        this.$nextTick(()=>{
			        this.setOption(newData);
			        //this.$refs.echarts_vue.echarts.resize();
		        })
            },
	        formatData(data){
		        let price = data.minLine;
		        let volumn = data.volumn;
		        let lastPrice = data.lastPrice * 1;
		        let avgPrice = data.avgLine;
		        let currentTime = categories[price.length - 1];
		        let currentPrice = price[price.length - 1] * 1 == 0 ? lastPrice : price[price.length - 1];
		        let highPrice = data.highestPrice * 1 == 0 ? data.highPrice : data.highestPrice;
		        let lowPrice = data.lowestPrice * 1 == 0 ? data.lowPrice : data.lowestPrice;
		        let chajia = Math.abs(highPrice - lastPrice) >= Math.abs(lowPrice - lastPrice) ? Math.abs(highPrice - lastPrice) : Math.abs(lowPrice - lastPrice);
		        let high = (lastPrice + chajia).toFixed(2);
		        let low = (lastPrice - chajia).toFixed(2);
		        if (!!data.time && data.time[data.time.length - 1] === "15:00") {
			        currentPrice = null;
			        currentTime = null;
		        }

		        let maxVolum = 0;
		        let highPoint = [];
		        let openLine = [];
		        let volumns = [];
		        for (let i = 0, length = categories.length; i < length; i++) {
			        let lp = 0;
			        if (i == 0) {
				        lp = lastPrice;
			        } else {
				        lp = price[i] ? price[i - 1] : 0
			        }
			        let v = volumn[i] ? volumn[i] : 0;
			        maxVolum = v >= maxVolum ? v : maxVolum;

			        let np = price[i] ? price[i] == 0 ? lastPrice : price[i] : 0;

			        highPoint = [price.length - 1, price[length - 1]];
			        openLine[i] = {
				        name: categories[i],
				        value: lastPrice + ""
			        };
			        volumns[i] = {
				        name: categories[i],
				        value: volumn[i] ? volumn[i] : 0,
				        itemStyle: {
					        normal: {
						        color: np - lp > 0 ? "#FF0D00" : '#43a950'
					        }
				        }
			        }
		        }
		        for (let k = 30000; k >= 3; k = k / 10) {
			        if (maxVolum % k == maxVolum) {
				        continue;
			        } else {
				        maxVolum = k - maxVolum % k + maxVolum;
				        break;
			        }
		        }

		        return {
			        price: price,
			        lastPrice: lastPrice,
			        currentPrice: currentPrice,
			        currentTime: currentTime,
			        high: high,
			        low: low,
			        maxVolum: maxVolum,
			        chajia:chajia,
			        avgPrice: avgPrice,
			        volumns: volumns,
			        openLine: openLine
                }
            },
            setOption(data){
	            let $this = this;

	            let formatedData = this.formatData(data);
	            let price = formatedData.price;
	            let lastPrice = formatedData.lastPrice * 1;
	            let low = formatedData.low;
	            let high = formatedData.high;
	            let maxVolum = formatedData.maxVolum;
	            let chajia = formatedData.chajia;
	            let avgPrice = formatedData.avgPrice;
	            let volumns = formatedData.volumns;
	            let currentPrice = formatedData.currentPrice;
	            let currentTime = formatedData.currentTime;
	            let openLine = formatedData.openLine;
	            let markPoint = [[currentTime, currentPrice]];
	            let showMiddleValue = 0.00;
	            let lable = [];
	            let totalTraded = data.totalVolume;

                let option = {
	                tooltip: {
                        trigger: 'axis',
		                transitionDuration: 0,
                        axisPointer: {
	                        type: "none",
	                        axis: "x",
                        },
		                textStyle: {
			                color: "#3d3d3d"
		                },
		                position: function (pt, arr, dom) {
			                return [0, 0];
		                },
		                extraCssText: "width:100%;height:0px;margin-left:0%;padding:0px",
		                formatter: function (param) {
                            let chart = $this.$refs.timeShareChart.echarts;
                        	let top1 = chart.convertToPixel({yAxisIndex: 0}, high);
			                let height = chart.convertToPixel({yAxisIndex: 1}, 0) - top1;
			                let left1 = chart.convertToPixel({xAxisIndex: 1}, 0);
			                let width = chart.convertToPixel({xAxisIndex: 1}, openLine.length - 1) - left1;
			                let type = param[0].componentSubType;
			                let index = 0;
			                let time = "";

			                if (type === "bar") {
				                index = param[0].dataIndex;
				                time = param[0].name
			                } else if(param[2]) {
				                index = param[2].dataIndex;
				                time = param[2].name
			                }
			                if (index >= data.time.length - 1) {
				                index = data.time.length - 1
			                }
			                let color = shareColor({
				                currentPrice: price[index] == 0 ? lastPrice : price[index],
				                lastPrice: lastPrice
			                });

			                let nowTime = data.time[index];
			                let avg = avgPrice[index];
			                let vol = volumns[index].value;
			                let p = toDecimal2(price[index] == 0 ? lastPrice : price[index]);
			                let top = chart.convertToPixel({yAxisIndex: 0}, p * 1);
			                let left = chart.convertToPixel({xAxisIndex: 1}, index);
			                let zd = (p * 1 - lastPrice * 1).toFixed(2);
			                let zf = (zd * 100 / lastPrice).toFixed(2);
			                let totalTra = totalTraded >= 10000 ? (totalTraded / 10000).toFixed(2) + "万" : totalTraded;
			                let dataText = "<p>时间:<span style='float:right'>" + nowTime + "</span></p>" +
				                "<p>价位:<span style='float:right' class='" + color + "'>" + p + "</span></p>" +
				                "<p>均价:<span style='float:right' class='" + color + "'>" + avg + "</span></p>" +
				                "<p>涨跌:<span style='float:right' class='" + color + "'>" + zd + "</span></p>" +
				                "<p>涨幅:<span style='float:right' class='" + color + "'>" + zf + "%</span></p>" +
				                "<p>现量:<span style='float:right'>" + vol + "</span></p>" +
				                "<p>总量:<span style='float:right'>" + totalTra + "</span></p>";

			                let leftText = "<div style='position:absolute;border:1px #B4CCFC solid;z-index:33;width:90px;height:150px;top:" + top1 + "px;left:" + left1 + "px;background-color:rgba(255,255,255,0.7);'>";
			                let rightText = "<div style='position:absolute;border:1px #B4CCFC solid;z-index:33;width:90px;height:150px;top:" + top1 + "px;right:" + left1 + "px;background-color:rgba(255,255,255,0.7);'>";
			                let text = "";
			                let crossText = "<div style='position:absolute;width:1px;height:" + height + "px;background-color:#00A0E8;top:" + top1 + "px;left:" + left + "px'></div>" +
				                "<div style='position:absolute;height:1px;width:" + width + "px;background-color:#00A0E8;top:" + top + "px;left:" + left1 + "px'></div>"
			                if (index >= categories.length / 2) {
				                text = leftText + dataText + "</div>" + crossText;
			                } else {
				                text = rightText + dataText + "</div>" + crossText;
			                }

			                return text;
                        }
                    },
	                grid: [
		                {
			                left: 60,
			                right: 60,
			                top: "5%",
			                height: '63.19%',
			                containLabel:false,
			                show: true,
			                borderWidth: 0,
			                boderColor: "#d0d0d0",
			                shadowBlur: 0
		                },
		                {
			                left: 60,
			                right: 60,
			                height: '26.82%',
			                top: '68.19%',
			                containLabel:false,
			                show: false,
			                borderWidth: 0,
			                boderColor: "#d0d0d0",
			                shadowBlur: 0,
		                }],
	                parallel: {height: 600,width:350},
                    xAxis: [
                        {
                        	type: 'category',
	                        gridIndex: 0,
	                        data: categories,
	                        min: 'dataMin',
	                        max: 'dataMax',
	                        axisLine: {
		                        show: false
	                        },
	                        axisLabel: {
		                        fontWeight: "bold",
		                        interval: 59,
		                        show: false,
		                        textStyle: {
			                        color: '#3d3d3d',
			                        shadowColor: "rgba(0,0,0,0)",
			                        fontWeight: "bold",
		                        }
	                        },
	                        axisTick: {
		                        show: false
	                        },
	                        splitLine: {
		                        show: true,
		                        lineStyle: {
			                        width: 0.3,
			                        color: '#DDDDDD',
			                        shadowColor: "rgba(0,0,0,0)"
		                        },
	                        },
	                        boundaryGap: false
                        },
		                {
			                type: 'category',
			                gridIndex: 1,
			                data: categories,
			                axisLine: {
				                lineStyle: {
					                width: 0.3,
					                color: '#d0d0d0',
					                shadowColor: "rgba(0,0,0,0)"
				                },
				                show: true
			                },
			                axisLabel: {
				                interval: 59,
				                show: true,
				                textStyle: {
					                fontSize: 12,
					                color: "#3d3d3d",
					                fontWeight: "bold",
				                }
			                },
			                splitLine: {
				                show: true,
				                lineStyle: {
					                width: 0.3,
					                color: '#DDDDDD'
				                },
			                },
		                }
                    ],
                    yAxis: [
		                {
                            type: 'value',
			                position: "left",
			                offset:0,
			                gridIndex: 0,
			                interval: chajia / 4,
			                min: low,
			                max: high,
			                axisLine: {
				                show: false
			                },
			                axisTick: {show: false},
			                axisLabel: {
				                show: true,
				                formatter: function (value, index) {
					                value = value * 1;
					                if (index == 4) {
						                showMiddleValue = value.toFixed(2) * 1;
						                value = lastPrice;
					                }
					                return value.toFixed(2);
				                },
				                margin: 1,
				                textStyle: {
					                fontSize: 12,
					                fontWeight: "bold",
					                color: function (val) {
						                val = val.replace(",", "") * 1;
						                val = val.toFixed(2) * 1;
						                if (val > showMiddleValue) {
							                return "#ff0d00";
						                }
						                else if (val < showMiddleValue) {
							                return '#43a950';
						                } else {
							                return "#3d3d3d";
						                }
					                }
				                }
			                },
			                splitLine: {
				                show: true,
				                lineStyle: {
					                width: 0.3,
					                color: '#dddddd',
				                }
			                },
		                },
		                {
			                type: 'value',
			                position: "left",
			                offset:0,
			                gridIndex: 1,
			                max: maxVolum,
			                min: 0,
			                interval: ((maxVolum / 3).toFixed(2)) * 1,
			                axisTick: {show: false},
			                axisLabel: {
				                show: true,
				                margin: 1,
				                formatter: function (value, index) {
					                if (index != 3) {
						                lable[index] = value;
						                return value;
					                }
				                },
				                textStyle: {
					                fontWeight: "bold",
					                color: "#3d3d3d",
					                fontSize: 12
				                }
			                },
			                splitLine: {
				                show: true,
				                lineStyle: {
					                width: 0.3,
					                color: '#d0d0d0'
				                }
			                }
		                },
		                {
			                type: 'value',
			                position: "right",
			                min: low,
			                max: high,
			                gridIndex: 0,
			                interval: (chajia / 4),
			                axisTick: {show: false},
			                axisLabel: {
				                show: true,
				                margin: 1,
				                fontWeight: "bold",
				                formatter: function (value, index) {
					                if (index == 4) {
						                showMiddleValue = value;
						                value = "0.00%"
					                } else {
						                value = ((Math.abs(value - lastPrice) / lastPrice) * 100).toFixed(2);
						                value = value + "%"
					                }
					                return value;
				                },
				                textStyle: {
					                fontSize: 12,
					                color: function (val) {
						                val = val.replace(",", "") * 1;
						                val = val.toFixed(2) * 1;
						                if (val > showMiddleValue) {
							                return "#ff0d00";
						                }
						                else if (val < showMiddleValue) {
							                return '#43a950';
						                } else {
							                return "#3d3d3d";
						                }
					                },
					                fontWeight: "bold",
				                }
			                },
			                splitLine: {
				                show: false
			                }
		                },
		                {
			                type: 'value',
			                position: "right",
			                min: 0,
			                max: maxVolum,
			                gridIndex: 1,
			                interval: ((maxVolum / 3).toFixed(2)) * 1,
			                axisTick: {show: false},
			                axisLabel: {
				                show: true,
				                margin: 1,
				                formatter: function (value, index) {
					                if (index != 3) {
						                return lable[index];
					                }
				                },
				                textStyle: {
					                fontWeight: "bold",
					                color: '#3d3d3d',
					                fontSize: 12,
				                }

			                },
                            splitLine: {
			                	show: false
                            },
			                axisLine: {
				                show: false
			                },
		                }
		            ],
                    series: [
                        {
			                name: '分时',
			                type: 'line',
			                smooth: false,
			                showSymbol: false,
			                symbol: 'circle',
			                symbolSize: 0,
			                data: price,
			                xAxisIndex: 0,
			                yAxisIndex: 0,
			                sampling: 'average',
			                lineStyle: {
				                normal: {
					                color: "#66b6ff",
					                width: 1
				                }
			                },
			                itemStyle: {
				                normal: {
					                areaStyle: {
						                type: 'default', color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							                offset: 0,
							                color: 'rgb(238, 250, 255)'
						                }, {
							                offset: 1,
							                color: 'rgb(250, 254, 255)'
						                }])
					                }
				                }
			                },
                        },
                        {
			                name: '均线',
			                type: 'line',
			                smooth: false,
			                showSymbol: false,
			                symbol: 'circle',
			                symbolSize: 0,
			                xAxisIndex: 0,
			                yAxisIndex: 0,
			                data: avgPrice,
			                lineStyle: {
				                normal: {
					                color: "#ffC500",
					                width: 1,
					                type: "solid"
				                }
			                },
                        },
	                    {
		                    name: '昨收',
		                    type: 'line',
		                    smooth: true,
		                    symbol: 'none',
		                    sampling: 'average',
		                    xAxisIndex: 0,
		                    yAxisIndex: 0,
		                    lineStyle: {
			                    normal: {
				                    color: "#ccc",
				                    type: 'dashed',
				                    width: 1
			                    }
		                    },
		                    data: openLine,
	                    },
		                {
			                name: 'Volumn',
			                type: 'bar',
			                boundaryGap: true,
			                legendHoverLink: false,
			                xAxisIndex: 1,
			                yAxisIndex: 1,
			                itemStyle: {
				                normal: {
					                color: '#7fbe9e'
				                }
			                },
			                data: volumns
		                },
		                {
			                name: '最新',
			                type: 'effectScatter',
			                boundaryGap: true,
			                rippleEffect: {
				                period: 4,
				                scale: 3,
				                brushType: 'stroke',
			                },
			                symbolSize: 4,
			                xAxisIndex: 0,
			                yAxisIndex: 0,
			                itemStyle: {
				                normal: {
					                color: '#66b6ff'
				                }
			                },
			                coordinateSystem: "cartesian2d",
			                data: markPoint
		                }
                    ]
                }

	            this.option = option;
            }
        }
	}
</script>

<style type="text/css">

</style>
