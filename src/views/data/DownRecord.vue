<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <!--<Col span="2">-->
            <!--<Select v-model="selectedCountry" @on-change="getProvinces">-->
                <!--<Option v-for="item in countries" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="2">-->
            <!--<Select v-model="selectedProvince" @on-change="getCities">-->
                <!--<Option v-for="item in provinces" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="2">-->
            <!--<Select v-model="selectedCity">-->
                <!--<Option v-for="item in cities" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <Col span="5">
            <RadioGroup v-model="queryMode" type="button">
                <Radio label="昨天"></Radio>
                <Radio label="上周"></Radio>
                <Radio label="上个月"></Radio>
            </RadioGroup>
            </Col>
            <Col span="3">
            <Input v-model="mac" placeholder="mac地址查询"></Input>
            </Col>
            <!--<Col span="3">-->
            <!--<Input v-model="location" placeholder="KTV场所查询"></Input>-->
            <!--</Col>-->
            <Col span="3">
            <Button type="primary" @click="queryRecord">查询</Button>
            </Col>
        </Row>
        <!--<Card style="margin-top: 20px; margin-bottom: 20px;">-->
            <!--<div style="height: 200px;">-->
                <!--<click-count-pie></click-count-pie>-->
            <!--</div>-->
        <!--</Card>-->
        <Card>
            <p slot="title">
                TOP 1000
            </p>
            <a href="#" slot="extra" @click.prevent="exportRecordsList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table :loading="loading" ref="recordTable" :data="recordList" :columns="recordColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
  import ClickCountPie from './ClickCountPie.vue'
  import {getProductList, getRegionList} from '../../api/mealApi'
  import {getDownRankList} from '../../api/songApi'

  export default {
    data() {
      return {
        queryMode: '上周',
        loading: false,
        recordColumns: [
          {title: '序号', key: 'serial'},
          {title: '歌曲编号', key: 'serial_no'},
          {title: '歌名', key: 'media_name'},
          {title: '歌星', key: 'actor_name'},
          {title: '下载次数', key: 'total'}
        ],
        recordList: [],
        timeType: 2,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        times: [
          {type: 1, name: '上周'},
          {type: 2, name: '上月'}
        ],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        selectedTime: '',
        mac: '',
        location: ''
      }
    },
    watch:{
      queryMode: function (val) {
        this.queryMode = val;
        if (val === '昨天') {
          this.queryYesterday();
        } else if (val === '上周') {
          this.queryLastWeek();
        } else if (val === '上个月') {
          this.queryLastMonth();
        }
      }
    },
    components: {
      ClickCountPie
    },
    mounted() {
      this.getProductList();
//      this.getRegionList();
      this.getRecordList();
    },
    methods: {
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
      getRecordList() {
        this.loading = true;
        getDownRankList({
          p: this.pageNo,
          size: this.pageSize,
          product_id: this.selectedProd,
          type: this.timeType,
          mac: this.mac
        }).then(res => {
          this.loading = false;
          this.recordList = res.data;
          this.total = res.total;
        }).catch(error=>{
          this.loading = false;
        })
      },
      queryRecord() {
        this.getRecordList();
      },
      queryYesterday() {
        this.timeType = 1;
        this.getRecordList();
      },
      queryLastWeek() {
        this.timeType = 2;
        this.getRecordList();
      },
      queryLastMonth() {
        this.timeType = 3;
        this.getRecordList();
      },
      exportRecordsList() {
        this.$refs.recordTable.exportCsv({
          filename: '下载记录'
        })
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.getRecordList();
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import '../../style/common';
</style>