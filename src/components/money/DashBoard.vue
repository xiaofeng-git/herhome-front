<template>
    <div class="hello">
      <!-- 面包屑导航-->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>经济管理</el-breadcrumb-item>
    <el-breadcrumb-item>收支情况</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品列表主体部分-->
    <el-card class="dashboard-card">
      <el-row class="chartContainer"> 
        <el-col :span="12"><h2>民宿支出情况</h2></el-col>
        <el-col :span="12"><h2>民宿收入情况</h2></el-col>
      </el-row>
      <el-row>
        <el-col :span="20"><div class="chart" :style="{ width: '50%', height: '500px' }" ref="out"></div></el-col>
        <el-col :span="20"><div class="chart" :style="{ width: '50%', height: '500px' }" ref="in"></div></el-col>
      </el-row>
    </el-card>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';

  export default {
    data(){
          return{

            // category : ["2023-07-18","2023-07-19","2023-07-20","2023-07-21","2023-07-22"],
            // lineData : [320, 230, 450, 270, 1010],
            // barData : [120, 120, 110, 140, 150],
                  // 查询参数
            queryInfo :{
              query:null, // 名
              startDate:null,
              endDate:null,
              minsuId:null,
              catogoryCode:null,
              pageNum:1, // 页数
              pageSize:5, // 每个页显示用户数
            },
            outChart : null,
            inChart : null,
            buySum : 0,
            compensateSum : 0,
            option : {},
            inOption:{},
            outDateLegend: [
              '采购',
              '清洁',
              '民宿租金',
              '维修',
            ],
            outDateSeries:[
              ],
            outDateDetail:[],
            inDateDetail:[],

        }
    },
    mounted() {
        this.outChart = echarts.init(this.$refs.out);
        this.inChart = echarts.init(this.$refs.in);
        this.getOutChartData();
        this.getInChartData();
    },
    methods:{
      async getInChartData(){
        // 民宿订单收入 
        const {data:buy} = await this.$http.get("allBuy",{ params:this.queryInfo});
  
        if(buy.BuyCounts > 0){
          buy.data.forEach((item, index) => {
            this.buySum += item.money;
          })
        }
        // 民宿赔偿收入 
        const {data:compensate} = await this.$http.get("allCompensate",{ params:this.queryInfo});
        if(compensate.CompensateCounts > 0){
          compensate.data.forEach((item) => {
            this.compensateSum += item.price;
          })
        }
        this.inDateDetail = this.inDateDetail.concat({ value: buySum, name: '民宿订单' });
        this.inDateDetail = this.inDateDetail.concat({ value: compensateSum, name: '赔偿' });
        this.updateInChart();
      },
      async getOutChartData(){
        console.log("getOutChartData");
        // 民宿支出 
        const {data:minsu} = await this.$http.get("allMinsu",{ params:this.queryInfo});
        var minsuSum = 0;
        if(minsu.MinsuCounts > 0){
          minsu.data.forEach((item, index) => {
            minsuSum += item.price;
          })
        }
        // 采购支出
        const {data:product} = await this.$http.get("allProduct",{ params:this.queryInfo});
        var productSum = 0;
        var categoryArr = [];
        var category = {
          name:'',
          value:0
        }
        var categoryCode = '';
        var arrIndex = 0;
        if(product.ProductCounts > 0){
          product.data.sort(function (a,b) {
              return a.catogoryCode-b.catogoryCode;
          })    
          product.data.forEach((item, index) => {
            if(categoryCode != item.catogoryCode){
              
              category = {
                name:item.catogoryName,
                value:item.price,
              };
              categoryArr[arrIndex] =category;
              arrIndex++;
              categoryCode = item.catogoryCode;
            }else{
              category.value += item.price;
            }
            productSum += item.price;
          })
        }
        // 清洁支出
        const {data:clean} = await this.$http.get("allClean",{ params:this.queryInfo});
        var cleanSum = 0;
        if(clean.ProductCounts > 0){
          clean.data.forEach((item, index) => {
            cleanSum += item.price;
          })
        }
        // 维修支出
        
        const {data:repair} = await this.$http.get("allRepair",{ params:this.queryInfo});
        var repairSum = 0;
        if(repair.ProductCounts > 0){
          repair.data.forEach((item, index) => {
            repairSum += item.price;
          })
        }
        this.outDateSeries = [],
        this.outDateSeries = this.outDateSeries.concat({ value: minsuSum, name: '民宿租金', selected: true  });
        this.outDateSeries = this.outDateSeries.concat({ value: productSum, name: '采购' });
        this.outDateSeries = this.outDateSeries.concat({ value: cleanSum, name: '清洁'});
        this.outDateSeries = this.outDateSeries.concat({ value: cleanSum, name: '维修' });
        this.outDateDetail = [
                // { value: 335, name: '采购基础物资' },
                // { value: 310, name: '采购一次性用品' },
                // { value: 251, name: '采购工具' },
                // { value: 234, name: '清洁被套' },
                // { value: 147, name: '清洁地板' },
                // { value: 135, name: '清洁窗户' },
                // { value: 102, name: '维修' }
              ];
              this.outDateDetail = this.outDateDetail.concat({ value: minsuSum, name: '民宿租金' });
              this.outDateDetail = this.outDateDetail.concat(categoryArr);
              this.outDateDetail = this.outDateDetail =  this.outDateDetail.concat({ value: cleanSum, name: '清洁费用' },)
              this.outDateDetail = this.outDateDetail.concat({ value: repairSum, name: '维修费用' },)
        this.updateOutChart();
      },

      updateOutChart() {
        console.log("updateChart");
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            data: this.outDateLegend
          },
          series: [
            {
              name: '支出',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],
              label: {
                position: 'inner',
                fontSize: 14
              },
              labelLine: {
                show: false
              },
              data: this.outDateSeries
            },
            {
              name: '支出',
              type: 'pie',
              radius: ['45%', '60%'],
              labelLine: {
                length: 30
              },
              label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#6E7079',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#8C8D8E',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  b: {
                    color: '#4C5058',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 33
                  },
                  per: {
                    color: '#fff',
                    backgroundColor: '#4C5058',
                    padding: [3, 4],
                    borderRadius: 4
                  }
                }
              },
              data: this.outDateDetail
            }
          ]
        };
        this.outChart.setOption(this.option); // 更新ECharts实例的选项
        // 监听窗口大小变化，自动调整图表大小
        window.addEventListener('resize', () => this.outChart.resize());

      },
      updateInChart(){
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        const weatherIcons = {
          Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
          Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
          Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
        };
        option = {
          title: {
            text: 'Weather Statistics',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['民宿订单', '赔偿']
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [
                {
                  value: 1548,
                  name: '民宿订单',
                  label: {
                    formatter: [
                      '{title|{b}}{abg|}',
                      '  {weatherHead|Weather}{valueHead|Days}{rateHead|Percent}',
                      '{hr|}',
                      '  {Sunny|}{value|202}{rate|55.3%}',
                      '  {Cloudy|}{value|142}{rate|38.9%}',
                      '  {Showers|}{value|21}{rate|5.8%}'
                    ].join('\n'),
                    backgroundColor: '#eee',
                    borderColor: '#777',
                    borderWidth: 1,
                    borderRadius: 2,
                    rich: {
                      title: {
                        color: '#eee',
                        align: 'center'
                      },
                      abg: {
                        backgroundColor: '#333',
                        width: '100%',
                        align: 'right',
                        height: 25,
                        borderRadius: [4, 4, 0, 0]
                      },
                      Sunny: {
                        height: 30,
                        align: 'left',
                        backgroundColor: {
                          image: weatherIcons.Sunny
                        }
                      },
                      Cloudy: {
                        height: 30,
                        align: 'left',
                        backgroundColor: {
                          image: weatherIcons.Cloudy
                        }
                      },
                      Showers: {
                        height: 30,
                        align: 'left',
                        backgroundColor: {
                          image: weatherIcons.Showers
                        }
                      },
                      weatherHead: {
                        color: '#333',
                        height: 24,
                        align: 'left'
                      },
                      hr: {
                        borderColor: '#777',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      value: {
                        width: 20,
                        padding: [0, 20, 0, 30],
                        align: 'left'
                      },
                      valueHead: {
                        color: '#333',
                        width: 20,
                        padding: [0, 20, 0, 30],
                        align: 'center'
                      },
                      rate: {
                        width: 40,
                        align: 'right',
                        padding: [0, 10, 0, 0]
                      },
                      rateHead: {
                        color: '#333',
                        width: 40,
                        align: 'center',
                        padding: [0, 10, 0, 0]
                      }
                    }
                  }
                },
                { value: 434, name: '赔偿' },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        
        this.inChart.setOption(this.inOption); // 更新ECharts实例的选项
        // 监听窗口大小变化，自动调整图表大小
        window.addEventListener('resize', () => this.inChart.resize());
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang="less" scoped>
  
  .dashboard-card{
        width:90%;
        border-radius:20px;
        margin: 10px 20px;
        background-size: cover;
        background-repeat: no-repeat;
    }
    .chartContainer{
      margin-top: -30px;
    }
    .chart{
      margin: 10px 20px;
    }
  </style>