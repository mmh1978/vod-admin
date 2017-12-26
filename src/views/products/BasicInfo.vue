<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <!--<Col span="4">-->
            <!--<Select v-model="selectedCountry" @on-change="getProvinces">-->
            <!--<Option v-for="item in countries" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
            <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="4">-->
            <!--<Select v-model="selectedProvince" @on-change="getCities">-->
            <!--<Option v-for="item in provinces" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
            <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="4">-->
            <!--<Select v-model="selectedCity">-->
            <!--<Option v-for="item in cities" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
            <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <Col span="6" offset="1">
            <DatePicker type="daterange" :options="options1" placement="bottom-end" placeholder="选择日期"
                        :value="timeslot" @on-change="handleTime" format="yyyy-MM-dd"
                        style="width: 270px;"></DatePicker>
            </Col>
            <Col span="4">
            <Button type="primary" @click="queryBasic">查询</Button>
            </Col>
        </Row>
        <div v-show="main">
            <Card style="height: 320px; margin-bottom: 10px;">
                <!--<trend-line :line-data="lineData"></trend-line>-->
                <div style="width:100%;height:300px;" id="trend-line"></div>
            </Card>
            <Row>
                <Col span="24">
                <Table ref="basicTable" :data="basicList" :columns="basicColumns"></Table>
                </Col>
                <!--<Col span="12">-->
                <!--<Card style="margin-left: 10px;">-->
                <!--<city-count-pie></city-count-pie>-->
                <!--</Card>-->
                <!--</Col>-->
            </Row>
        </div>
        <Card v-show="!main">
            <p slot="title">
                详情明细
            </p>
            <div slot="extra">
                <a href="#" @click.prevent="backToMain">
                    <Icon type="arrow-return-left"></Icon>
                    返回&nbsp&nbsp
                </a>
                <a href="#" @click.prevent="exportBasicList">
                    <Icon type="android-open"></Icon>
                    导出
                </a>
            </div>
            <Table ref="basicDetailTable" :data="basicDetailList" :columns="basicDetailColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
  import echarts from 'echarts'
  import TrendLine from './TrendLine.vue'
  import CityCountPie from './CityCountPie.vue'
  import {getProductList, getRegionList} from '../../api/commonApi'
  import {EventBus} from '../../components/EventBus'
  import {getStbTrend, getStbLastTrend} from '../../api/productApi'

  export default {
    data() {
      return {
        main: true, //主页面or明细
        lineData: [],
        timeslot: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        selectedProd: 0,
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        basicList: [],
        basicColumns: [
          {title: '产品类型', key: 'product_name'},
          {title: '总数量', key: 'total'},
          {title: '今日增加', key: 'new_total'}
        ],
        basicDetailList: [],
        basicDetailColumns: [
          {title: '序号', key: 'id', width: 60},
          {title: '产品', key: 'product'},
          {title: '时间', key: 'time'},
          {title: '地区', key: 'region', width: 120},
          {title: '总数量', key: 'total', width: 100},
          {title: '增量', key: 'increase', width: 100}
        ],
        options1: {
          shortcuts: [
            {
              text: '最近一周',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '最近一个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '最近三个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            }
          ]
        }
      }
    },
    created() {
      EventBus.$on('open-prod-detail', params => {
        console.log(params);
        this.main = false;
      });
    },
    components: {
      TrendLine,
      CityCountPie
    },
    mounted() {
      this.$nextTick(() => {
        this.getProductList();
        this.getRegionList();
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        this.timeslot = [start.Format('yyyy-MM-dd'), end.Format('yyyy-MM-dd')];
        this.getStbTrend();
        this.getStbLastTrend();
      });

    },
    methods: {
      handleTime(time) {
        this.timeslot = time;
      },
      getProductList() {
        getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.productList = result.data;
          }
        });
      },
      getRegionList() {
        getRegionList({check: 0, pid: 0, depth: 1}).then(result => {
          if (result.code && result.code === 200) {
            this.countries = result.data;
          }
        });
      },
      getProvinces() {
        getRegionList({check: 0, pid: this.selectedCountry, depth: 2}).then(result => {
          if (result.code && result.code === 200) {
            this.provinces = result.data;
          }
        });
      },
      getCities() {
        getRegionList({check: 0, pid: this.selectedProvince, depth: 3}).then(result => {
          if (result.code && result.code === 200) {
            this.cities = result.data;
          }
        });
      },
      getStbLastTrend() {
        getStbLastTrend().then(res => {
          this.basicList = res.data;
        }).catch(error => {
          this.$Message.error(error.msg);
        })
      },
      getStbTrend() {
        getStbTrend({
          product_id: this.selectedProd ? this.selectedProd : 0,
//          timeslot: this.timeslot
          stime: this.timeslot[0],
          etime: this.timeslot[1]
        }).then(res => {
          var lineData = [];
          let main = document.getElementById("trend-line");
          let trendLineIns = echarts.getInstanceByDom(main);
          if (trendLineIns) {
            echarts.dispose(trendLineIns);
          }
          if (res.data.length) {
            lineData = res.data.map(item => {
              return {
                name: item.day,
                value: [
                  item.day, item.total
                ]
              }
            });
          }
          let trendLine = echarts.init(main);
          this.drawLineChart(trendLine, lineData);
        }).catch(error => {
          this.$Message.error(error.msg);
        })
      },
      queryBasic() {
        this.getStbTrend();
      },
      exportBasicList() {
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.querySoft();
      },
      backToMain() {
        this.main = true;
      },
      drawLineChart(chart, data) {

        var option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            }
          },
          series: [{
            name: '数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }]
        };
        chart.setOption(option);
        chart.on('click', (params) => {
          EventBus.$emit('open-prod-detail', params);
        });
        window.addEventListener('resize', () => {
          chart.resize();
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>