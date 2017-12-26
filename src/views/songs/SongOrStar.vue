<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <Col span="3">
            <Input v-model="songOrStar" placeholder="歌曲/歌星查询"></Input>
            </Col>
            <Col span="3">
            <Button type="primary" @click="queryRecord">查询</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                歌星描述
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
  import {getProductList, getRegionList} from '../../api/mealApi'

  export default {
    data() {
      return {
        total: 0,
        pageNo: 1,
        loading: false,
        selectedProd: '',
        productList: [],
        songOrStar: '',
        recordList: [],
        recordColumns: []
      }
    },
    mounted() {
      this.getProductList();
    },
    methods: {
      getProductList() {
        getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.productList = result.data;
          }
        });
      },
      queryRecord() {
        this.loading = true;
      },
      changePage(page) {
        this.pageNo = page;
        this.queryRecord();
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common";
</style>