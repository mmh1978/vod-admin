<template>
  <div>
    <Row class="search-area">
      <Col span="4">
      <Input v-model="record" placeholder="请输入订单号或mac地址"></Input>
      </Col>
      <Col span="4">
      <Button type="primary" @click="queryRecord">查询</Button>
      </Col>
    </Row>
    <Card>
      <p slot="title">
        详细记录
      </p>
      <a href="#" slot="extra" @click.prevent="exportTradeRecord">
        <Icon type="android-open"></Icon>
        导出
      </a>
      <Table :loading="loading" ref="tradeTable" :data="recordList" :columns="recordCols" stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import {getTradeList} from '../../api/mealApi'
  export default {
    data() {
      return {
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        record: '',
        recordList: [],
        recordCols: [
          {title: '订单号', key: 'tradeno'}, 
          {title: '用户信息', key: 'uname'},
          {title: '套餐类型', key: 'subject', width: 160}, 
          {title: '支付方式', key: 'paytype', width: 100}, 
          {title: '价格', key: 'fee', width: 80},
          {title: '状态', key: 'state', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.state){
              case 1:
                name = '交易成功';
                break;
              case 3:
                name = '交易超时';
                break;
              case 0:
                name = '未支付';
                break;
              case 2:
                name = '交易关闭';
                break;
            } 
            return name;
          }, width: 80}, 
          {title: '时间', key: 'intime', width: 180}
        ]
      }
    },
    mounted() {
      this.getTradeList();
    },
    methods: {
      getTradeList() {
        this.loading = true;
        getTradeList({page: this.pageNo, size: this.pageSize, search: this.record}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.recordList = result.data;
            this.total = result.total;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      queryRecord() {
        if (!this.record) {
          this.$Message.info('请先输入要查询的mac！');
          return;
        }
        this.getTradeList();
      },
      exportTradeRecord() {
        this.$refs.tradeTable.exportCsv({
          filename: '交易记录'
        });
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.getTradeList();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/common.scss';
</style>