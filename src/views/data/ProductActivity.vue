<template>
    <div>
        <Row class="search-area">
            <Col span="3">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <Col span="3">
            <Select v-model="selectedCountry" @on-change="getProvinces">
                <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="3">
            <Select v-model="selectedProvince" @on-change="getCities">
                <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="3">
            <Select v-model="selectedCity">
                <Option v-for="item in cities" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="8">
            <RadioGroup v-model="queryMode" type="button">
                <Radio label="上周"></Radio>
                <Radio label="上月"></Radio>
            </RadioGroup>
            <Button type="success" @click="queryActivity">查询</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <a href="#" slot="extra" @click.prevent="exportActList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table ref="resList" :loading="loading" :data="actList" :columns="actColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
  import {getProductList, getRegionList} from '../../api/commonApi'

  export default {
    data() {
      return {
        queryMode: '',
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        actList: [],
        actColumns: []
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
      queryActivity() {
        this.loading = true;
      },
      queryLastWeek() {},
      queryLastMonth() {},
      changePage(pageNo) {
        this.pageNo = pageNo;
      },
      exportActList() {
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>