
<template>
  <div>
    <Row class="search-area">
      <Col span="4">
        <Select v-model="selectedProd">
          <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
        </Select>
      </Col>
      <Col span="4">
      <!--<Cascader :data="regionList" v-model="selectedRegion"></Cascader>-->
        <Select v-model="selectedCountry" @on-change="getProvinces">
          <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select v-model="selectedProvince" @on-change="getCities">
          <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select v-model="selectedCity">
          <Option v-for="item in cities" :value="item.region_code" :key="item.region_code">{{ item.region_name }}</Option>
        </Select>
      </Col>
      <Col span="8">
        <RadioGroup v-model="queryMode" type="button">
            <Radio label="昨天"></Radio>
                <Radio label="上周"></Radio>
                <Radio label="上月"></Radio>
            </RadioGroup>
        <Button type="primary" @click="queryFeed">查询</Button>
      </Col>
    </Row>
    <Card>
      <p slot="title">
        详情明细
      </p>
      <a href="#" slot="extra" @click.prevent="exportMealList">
        <Icon type="android-open"></Icon>
        导出
      </a>
      <Table ref="mealTable" :loading="loading" :data="feedList" :columns="feedColumns" stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import * as fbapi from '../../api/feedbackApi'
  import * as comapi from '../../api/commonApi'
  export default {
    data() {
      return {
        queryMode: '',
        loading: false,
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        feedColumns: [
          {title: 'ID', key: 'id'}, 
          {title: '用户信息', key: 'opinion_uniqueid'}, 
          {title: '盒子信息', key: 'opinion_uname'}, 
          {title: '反馈内容', key: 'opinion_msg'},
          {title: '时间', key: 'opinion_time'}, 
        ],
        feedList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
    },
    watch:{
      queryMode: function (val) {
        this.queryMode = val;
        if (val === '上周') {
          this.queryLastWeek();
        } else if (val === '上月') {
          this.queryLastMonth();
        }
      }
    },
    mounted() {
      this.getProductList();
      this.getRegionList();
      this.getFeedBackList();
    },
    methods: {
      getRegionCode() {
        var region_code = []
        if(this.selectedCountry){
            region_code.push(this.selectedCountry);
            if(this.selectedProvince){
                region_code.push(this.selectedProvince);
                if(this.selectedCity){
                    region_code.push(this.selectedCity);
                }
            }
        }
        return region_code.join();
      },
      getFeedBackList() {
        this.loading = true;
        const areaid = this.getRegionCode();
        fbapi.getFeedBackList({page: this.pageNo, type: 2, size: this.pageSize, product_id: this.selectedProd, area_id: areaid}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.feedList = result.data;
            this.total = result.total;
          }
        }).catch(error=>{
          this.loading = false;
        });
      },
      getProductList() {
        comapi.getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.productList = result.data;
          }
        });
      },
      getRegionList() {
        comapi.getRegionList({check: 0, pid: 0, depth: 1}).then(result => {
          if (result.code && result.code === 200) {
            this.countries = result.data;
          }
        });
      },
      getProvinces() {
        comapi.getRegionList({check: 0, pid: this.selectedCountry, depth: 2}).then(result => {
          if (result.code && result.code === 200) {
            this.provinces = result.data;
          }
        });
      },
      getCities() {
        comapi.getRegionList({check: 0, pid: this.selectedProvince, depth: 3}).then(result => {
          if (result.code && result.code === 200) {
            this.cities = result.data;
          }
        });
      },
      queryFeed() {
        this.getFeedBackList();
      },
      queryLastWeek() {},
      queryLastMonth() {},
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.queryFeed();
      },
      exportMealList() {
        this.$refs.mealTable.exportCsv({
          filename: '套餐信息'
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>