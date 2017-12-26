<template>
    <div>
        <div v-show="main === 'chart'">
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
                <!--<Col span="5">-->
                <!--<Button type="default" @click="queryYesterday">昨天</Button>-->
                <!--<Button type="default" @click="queryLastWeek">上周</Button>-->
                <!--<Button type="default" @click="queryLastMonth">上个月</Button>-->
                <!--</Col>-->
                <Col span="6" offset="1">
                <DatePicker type="daterange" :options="options1" placement="bottom-end" placeholder="选择日期"
                            :value="timeslot" @on-change="handleTime" format="yyyy-MM-dd"
                            style="width: 270px;"></DatePicker>
                </Col>
                <Col span="3">
                <Input v-model="mac" placeholder="mac地址查询"></Input>
                </Col>
                <Col span="3">
                <Button type="primary" @click="queryOpenTrend">查询</Button>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <Card>
                    <!--<start-tv-line></start-tv-line>-->
                    <div style="width:100%;height:300px;" id="tv-line"></div>
                </Card>
                </Col>
                <Col span="12">
                <Card style="margin-left: 10px;">
                    <!--<start-computer-line></start-computer-line>-->
                    <div style="width:100%;height:300px;" id="computer-line"></div>
                </Card>
                </Col>
            </Row>
        </div>
        <div v-show="main === 'room'">
            <Row class="search-area">
                <Col span="4">
                <Select v-model="roomProd">
                    <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
                </Select>
                </Col>
                <Col span="5">
                <Button type="default" @click="queryOpenStbYesterday">昨天</Button>
                <Button type="default" @click="queryOpenStbLastWeek">上周</Button>
                <Button type="default" @click="queryOpenStbLastMonth">上个月</Button>
                </Col>
                <Col span="3">
                <Input v-model="roomMac" placeholder="mac地址查询"></Input>
                </Col>
                <Col span="3">
                <Button type="primary" @click="queryOpenStbList">查询</Button>
                </Col>
            </Row>
            <Card>
                <p slot="title">
                    开台明细记录
                </p>
                <div slot="extra">
                    <a href="#" @click.prevent="backToMain">
                        <Icon type="arrow-return-left"></Icon>
                        返回&nbsp&nbsp
                    </a>
                    <a href="#" @click.prevent="exportTvList">
                        <Icon type="android-open"></Icon>
                        导出
                    </a>
                </div>
                <Table ref="tvTable" :data="tvList" :columns="tvColumns"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="tvTotal" :current="tvPageNo" @on-change="changeTvPage"></Page>
                    </div>
                </div>
            </Card>
        </div>
        <div v-show="main === 'online'">
            <Row class="search-area">
                <Col span="4">
                <Select v-model="openProd">
                    <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
                </Select>
                </Col>
                <Col span="5">
                <Button type="default" @click="queryOpenStbYesterday">昨天</Button>
                <Button type="default" @click="queryOpenStbLastWeek">上周</Button>
                <Button type="default" @click="queryOpenStbLastMonth">上个月</Button>
                </Col>
                <Col span="3">
                <Input v-model="roomMac" placeholder="mac地址查询"></Input>
                </Col>
                <Col span="3">
                <Button type="primary" @click="queryOpenStbList">查询</Button>
                </Col>
            </Row>
            <Card>
                <p slot="title">
                    开机明细记录
                </p>
                <div slot="extra">
                    <a href="#" @click.prevent="backToMain">
                        <Icon type="arrow-return-left"></Icon>
                        返回&nbsp&nbsp
                    </a>
                    <a href="#" @click.prevent="exportComputerList">
                        <Icon type="android-open"></Icon>
                        导出
                    </a>
                </div>
                <Table ref="comTable" :data="computerList" :columns="computerColumns"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="comTotal" :current="comPageNo" @on-change="changeComPage"></Page>
                    </div>
                </div>
            </Card>
        </div>
        <Modal
                v-model="stbDetailShow"
                title="mac明细记录"
                @on-ok="ok"
                @on-cancel="cancel">
            <Table ref="stbDetailTable" :data="stbDetailList" :columns="stbDetailCols"></Table>
        </Modal>
        <Modal
                v-model="stbDayDetailShow"
                title="mac天明细记录"
                @on-ok="dayOk"
                @on-cancel="dayCancel">
            <Table ref="stbDetailTable" :data="stbDayDetailList" :columns="stbDayDetailCols"></Table>
        </Modal>
    </div>
</template>
<script>
  import echarts from 'echarts'
  import StartTvLine from './StartTvLine.vue'
  import StartComputerLine from './StartComputerLine.vue'
  import {getProductList, getRegionList} from '../../api/commonApi'
  import {
    getStbTrend,
    getStbLastTrend,
    getOpenTrend,
    getOpenStbList,
    getOpenStbDetail,
    getOpenStbDayDetail
  } from '../../api/productApi'
  import {EventBus} from '../../components/EventBus'

  export default {
    data() {
      return {
        openType: 1,
        stbDetailShow: false,
        stbDayDetailShow: false,
        stbDetailList: [],
        stbDayDetailList: [],
        stbDetailCols: [
          {title: '开机时长',key: 'open_long'},
          {title: '开机次数',key: 'open_time'},
          {title: '开台时长',key: 'room_long'},
          {title: '开台时长',key: 'room_time'},
          {title: '日期',key: 'day', render: (h, params) => {
            const row = params.row;
            return h('Tag', {
              on: {
                click: () => {
                  this.openStbDayDetailModal();
                }
              }
            }, row.day)
          }}
        ],
        stbDayDetailCols: [
          {title: '开机/开台的开始时间', key: 'stime'},
          {title: '开机/开台的结束时间', key: 'etime'}
        ],
        main: 'chart', //主页面or开台明细or开机明细
        timeslot: [],
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
        },
        mac: '',
        roomMac: '',
        roomTimeType: 2,
        tvPageNo: 1,
        pageSize: 10,
        tvTotal: 0,
        comTotal: 0,
        comPageNo: 1,
        selectedProd: 0,
        roomProd: 0,
        openProd: 0,
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        tvList: [],
        tvColumns: [
          {title: '序号', key: 'uid', width: 60},
          {title: 'uname', key: 'uname'},
          {title: '开台时长(s)', key: 'room_long'},
          {title: '开台次数', key: 'room_time'},
          {
            title: 'mac地址', key: 'umac', render: (h, params) => {
            const row = params.row;
            return h('Tag', {
              on: {
                click: () => {
                  this.openStbDetailModal();
                }
              }
            }, row.umac)
          }
          }
        ],
        computerList: [],
        computerColumns: [
          {title: '序号', key: 'uid', width: 60},
          {title: 'uname', key: 'uname'},
          {title: '开机时长(s)', key: 'open_long'},
          {title: '开机次数', key: 'open_time'},
          {title: 'mac地址', key: 'umac'}
        ]
      }
    },
    created() {
      EventBus.$on('open-tv-list', params => {
        console.log(params)
        this.openProd = 0;
        this.main = 'room';
      });
      EventBus.$on('open-computer-list', params => {
        console.log(params)
        this.roomProd = 0;
        this.main = 'online'
      })
    },
    components: {
      StartTvLine,
      StartComputerLine
    },
    mounted() {
      this.$nextTick(() => {
        this.getProductList();
//      this.getRegionList();
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        this.timeslot = [start.Format('yyyy-MM-dd'), end.Format('yyyy-MM-dd')];
        this.getLineChart();
      });
    },
    methods: {
      backToMain() {
        this.main = 'chart';
      },
      handleTime(time) {
        this.timeslot = time;
      },
      drawLineChart(chart, data, type , text) {
        var _this = this;
        var option = {
          title: {
            text: text
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
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
        chart.on('click', params => {
          if (type === 'tv') {
            EventBus.$emit('open-tv-list', params);
          } else if (type === 'com') {
            EventBus.$emit('open-computer-list', params);
          }
          _this.getOpenStbList();
        });
        window.addEventListener('resize', function () {
          chart.resize();
        });
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
      queryOpenTrend() {
        this.getLineChart();
      },
      getLineChart() {
        console.log(this.timeslot);
        getOpenTrend({
          product_id: this.selectedProd? this.selectedProd : 0,
          stime: this.timeslot[0],
          etime: this.timeslot[1],
//          timeslot: this.timeslot,
          mac: this.mac
        }).then(res => {
          var tvData = [], comData = [];
          let tvDom = document.getElementById("tv-line");
          let comDom = document.getElementById("computer-line");
          let tvLineIns = echarts.getInstanceByDom(tvDom);
          let comLineIns = echarts.getInstanceByDom(comDom);
          if (tvLineIns) {
            echarts.dispose(tvLineIns);
          }
          if (comLineIns) {
            echarts.dispose(comLineIns);
          }
          if (res.data.length) {
            tvData = res.data.map(item => {
              return {
                name: item.day,
                value: [
                  item.day, item.room_time
                ]
              }
            });
            comData = res.data.map(item => {
              return {
                name: item.day,
                value: [
                  item.day, item.open_time
                ]
              }
            });
          }
          let tvLine = echarts.init(tvDom);
          let comLine = echarts.init(comDom);
          this.drawLineChart(tvLine, tvData, 'tv', '开台次数');
          this.drawLineChart(comLine, comData, 'com', '开机次数');
        })
      },
      getOpenStbList() {
        getOpenStbList({
          product_id: this.openProd ? this.openProd : this.roomProd ? this.roomProd : this.productList[0].id,
          type: this.roomTimeType,
          mac: this.roomMac
        }).then(res => {
          if (res.code && res.code === 200) {
            this.tvList = res.data;
            this.computerList = res.data;
          }
        }).catch(error => {
          this.$Message.error(error.msg);
        })
      },
      queryOpenStbList() {
        this.getOpenStbList();
      },
      queryOpenStbYesterday() {
        this.roomTimeType = 1;
        this.getOpenStbList();
      },
      queryOpenStbLastWeek() {
        this.roomTimeType = 2;
        this.getOpenStbList();
      },
      queryOpenStbLastMonth() {
        this.roomTimeType = 3;
        this.getOpenStbList();
      },
      exportTvList() {
        this.$refs.tvTable.exportCsv({
          filename: '歌曲排行榜'
        })
      },
      exportComputerList() {
        this.$refs.comTable.exportCsv({
          filename: '歌曲排行榜'
        })
      },
      changeTvPage(pageNo) {
        this.tvPageNo = pageNo;
        this.getOpenStbList();
      },
      changeComPage(pageNo) {
        this.comPageNo = pageNo;
        this.getOpenStbList();
      },
      openStbDetailModal() {
        this.stbDetailShow = true;
        getOpenStbDetail({
          type: this.roomTimeType,
          mac: this.roomMac,
          uid: this.$store.getters.UID
        }).then(res => {
          if (res.code && res.code === 200) {
            this.stbDetailList = res.data;
          }
        }).catch(error => {
          this.$Message.error(error.msg);
        })
      },
      openStbDayDetailModal() {
        this.stbDayDetailShow = true;
        getOpenStbDayDetail({
          uid: this.$store.getters.UID,
          type: this.openType
        }).then(res => {
          if (res.code && res.code === 200) {
            this.stbDayDetailList = res.data;
          }
        }).catch(error => {
          this.$Message.error(error.msg);
        })
      },
      ok() {},
      cancel() {},
      dayOk() {},
      dayCancel() {}
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>