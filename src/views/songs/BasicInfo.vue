<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <Col span="4">
            <Select v-model="selectedCountry" @on-change="getProvinces">
                <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="4">
            <Select v-model="selectedProvince" @on-change="getCities">
                <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="4">
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
            <Button type="primary" @click="queryBasic">查询</Button>
            </Col>
        </Row>
        <Collapse v-model="classify" accordion>
            <Panel name="lang">
                语言分类
                <div slot="content">
                    <sort-bar dom-id="lang"></sort-bar>
                </div>
            </Panel>
            <Panel name="song">
                歌曲分类
                <div slot="content">
                    <sort-bar dom-id="song"></sort-bar>
                </div>
            </Panel>
            <Panel name="star">
                歌星分类
                <div slot="content">
                    <sort-bar dom-id="star"></sort-bar>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
  import SortBar from './SortBar.vue'
  import {getProductList, getRegionList} from '../../api/commonApi'

  export default {
    data() {
      return {
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
        classify: 'lang',
        queryMode: '上周'
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
    components: {
      SortBar
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
      queryBasic() {
      },
      queryLastWeek() {},
      queryLastMonth() {},
      exportBasicList() {
      },
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common";
</style>