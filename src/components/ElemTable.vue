<template>
    <div class="head">
        <scroller
                :on-refresh="refresh"
                :on-infinite="infinite"
                :move-event="moveEvent"
                ref="my_scroller">
            <el-table :data="items" ref="elTable" style="width: 100%;">
                <template v-for="(column, index) in columns">
                    <el-table-column
                            v-if="column.isMerge"
                            fixed
                            :prop="column.prop"
                            :label="column.label"
                            :width="column.width"></el-table-column>
                    <el-table-column
                            v-else
                            :prop="column.prop"
                            :label="column.label"
                            :width="column.width"></el-table-column>
                </template>
            </el-table>
        </scroller>
    </div>
</template>

<script>
	import ElTable from './table';

	export default {
		name: "elem-table",
        data(){
			return{
				items: [],
				begin_pos_str: 0,
				tableData: this.tableOption.tableData || [],
				columns: [
					{
						prop:'date',
            label: '日期',
            width:100,
						isMerge: true
          },
					{
						prop:'name',
						label: '名称',
						width:200
					},
					{
						prop:'address',
						label: '地址',
						width:150
					},
					{
						prop:'address1',
						label: '地址1',
						width:120
					},
					{
						prop:'address2',
						label: '地址2',
						width:120
					},
					{
						prop:'address3',
						label: '地址3',
						width:120
					}
                ],
				isEnd: !this.url,
				//默认为加载中
				isLoading: true,
				isFirst: true,
				isError: false
				//第一次加载如果为空时会显示暂无数据的div撑大主容器
            }
        },
        props: {
	        ajaxOption: {type: Object, default: () => ({})},
	        isParseHeader: {
		        type: Boolean,
		        default: true
	        },
	        url: {
		        type: String,
		        required: false
	        },
	        noInfinite: {
		        type: Boolean,
		        default: false
	        },
	        tableOption: {
		        type: Object,
		        default: () => ({})
	        }
        },
        mounted(){
	        for (let i = 1; i <= 10; i++) {
		        this.items.push({
			        date: '2016-05-02',
			        name:i + ' - keep walking, be 2 with you.',
			        address: '上海市普陀区',
			        address1: '上海市普陀区',
			        address2: '上海市普陀区',
			        address3: '上海市普陀区'
		        });
	        }
	        this.top = 1
	        this.bottom = 10
        },
        components: {
	        ElTable
        },
        props: {
            url: {
            	type: String,
                required: false
            },
	        tableOption: {
            	type: Object,
                default: ()=>({})
            }
        },
        methods: {
	        parseHeader(data) {
		        const widthMap = {
			        sec_account: 6,
			        error_message: 6,
			        special_serial_no: 6,
			        fund_account: 6,
			        balance_this_time: 6,
			        amt_this_time: 6,
			        bank_name: 7,
			        serial_no: 8.5,
			        '3rd_transable': 8,
			        bank_account: 8,
			        transfer_balance: 8,
			        abstract: 8,
			        market_code: 6
		        };
		        let columns = [];
		        let array = data.visible.split('|');
		        if (!array[array.length - 1]) array.pop();
		        if (!!data.visible_merge) {
			        let arrayMerge = data.visible_merge.split('|');
			        if (!arrayMerge[arrayMerge.length - 1]) arrayMerge.pop();
			        let field1 = arrayMerge[0].split('*');
			        let field2 = arrayMerge[1].split('*');
			        if (field1[0] === 'sec_name') {
				        columns.push({
					        isMerge: true,
					        label: array[0].split('*')[1],
					        key1: field1[0],
					        key2: field2[0],
				        });
			        }
		        }

		        array.forEach((d) => {
			        let field = d.split('*');
			        //occur_date*日期|occur_time*时间|
			        if (field[0] === 'sec_name' || field[0] === 'sec_code') {
				        return true;
			        }
			        columns.push({
				        label: field[1],
				        prop: field[0],
				        width: widthMap[field[0]] || 5
			        });
		        });
		        this.columns = columns;
	        },
	        refresh(done) {
		        setTimeout(() => {
			        let start = this.top - 1
			        for (let i = start; i > start - 3; i--) {
				        this.items.splice(0, 0, {
					        date: '2016-05-02',
					        name:i + ' - keep walking, be 2 with you.',
					        address: '刷新',
					        address1: '上海市普陀区',
					        address2: '上海市普陀区',
					        address3: '上海市普陀区'
                        })
			        }
			        this.top = this.top - 3;
			        done()
		        }, 1500)
	        },
	        moveEvent(key, val){
		        this.$refs.elTable.$el.children[1].style[key] = val;
		        this.$refs.elTable.$el.children[3].children[0].style[key] = val;
            },
	        infinite(done) {
		        console.log('infinite called..')
		        setTimeout(() => {
			        let start = this.bottom + 1
			        for (let i = start; i < start + 3; i++) {
				        this.items.push({
                            date: '2016-05-02',
					        name:i + ' - keep walking, be 2 with you.',
					        address: '上海市普陀区',
					        address1: '上海市普陀区',
					        address2: '上海市普陀区',
					        address3: '上海市普陀区'
                        })
			        }
			        this.bottom = this.bottom + 3
			        done()
		        }, 1500)
	        },
        }
	}
</script>

<style type="text/less">
    @import "./table/css/table.css";
    .head{
        position: absolute;
        left: 0;
        right: 0;
        top: 190px;
        bottom: 0;
    }
</style>
