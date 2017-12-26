<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
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
            <Col span="3">
            <Button type="primary" @click="queryRecord">查询</Button>
            </Col>
        </Row>
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
  import {getProductList} from '../../api/mealApi'
  import {getMediaRankList} from '../../api/songApi'

  export default {
    data() {
      return {
        queryMode: '上周',
        loading: false,
        recordColumns: [
          {title: '序号', key: 'serial', width: 60},
          {title: '歌曲编号', key: 'serial_no'},
          {title: '歌名', key: 'media_name'},
          {title: '歌星', key: 'actor_name'},
          {title: '点击次数', key: 'total'}
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
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        mac: ''
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
    mounted() {
      this.getProductList();
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
      getRecordList() {
        this.loading = true;
        getMediaRankList({
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
          filename: '歌曲排行榜'
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