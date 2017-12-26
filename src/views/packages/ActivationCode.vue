<template>
  <div>
    <Row class="search-area">
      <Col span="4">
      <Input v-model="cdkey" placeholder="请输入激活码"></Input>
      </Col>
      <Col span="4">
      <Button type="primary" @click="queryCDKey">查询</Button>
      <Button type="success" @click="generateCDKey">生成激活码</Button>
      </Col>
    </Row>
    <Card>
      <p slot="title">
        详细记录
      </p>
      <a href="#" slot="extra" @click.prevent="exportCDKey">
        <Icon type="android-open"></Icon>
        导出
      </a>
      <Table :loading="loading" ref="CDKeyTable" :data="cdkeyList" :columns="cdkeyCols" stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal
      v-model="codeModal"
      title="生成激活码"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="genCode" :model="genCode" :rules="genCodeRules" :label-width="80">
        <FormItem label="套餐" prop="mealid">
          <Select v-model="genCode.mealid" placeholder="请选择">
            <Option v-for="meal in mealList" :value="meal.id" :key="meal.id">{{meal.meal_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="有效期" prop="expire">
          <Input v-model="genCode.expire" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="数量" prop="total">
          <Input v-model="genCode.total" placeholder="请输入"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {getCDKeyList, generateCode, getMealList} from '../../api/mealApi'

  export default {
    data() {
      return {
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        cdkey: '',
        cdkeyList: [],
        cdkeyCols: [
          {title: '序号', key: 'id', width: 60}, 
          {title: '激活码', key: 'code'}, 
          {title: '套餐名称', key: 'meal_name'},
          {title: '状态', key: 'state', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.state){
              case 1:
                name = '已使用';
                break;
              case -1:
                name = '已失效';
                break;
              case 0:
                name = '未使用';
                break;
              case 2:
                name = '已过期';
                break;
            } 
            return name;
          }}, 
          {title: '到期时间', key: 'expire'}, 
          {title: '时间', key: 'intime'}
        ],
        mealList: [],
        codeModal: false,
        genCode: {
          mealid: '',
          expire: 0,
          total: 0
        },
        genCodeRules: {
          mealid: [
            {required: true, message: '', trigger: 'change'}
          ],
          expire: [
            {required: true, message: '', trigger: 'blur'}
          ],
          total: [
            {required: true, message: '', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getCDKeyList();
    },
    methods: {
      getCDKeyList() {
        this.loading = true;
        getCDKeyList({page: this.pageNo, size: this.pageSize, code: this.cdkey}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.cdkeyList = result.data;
            this.total = result.total;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getMealList() {
        getMealList().then(result => {
          if (result.code && result.code === 200) {
            this.mealList = result.data;
          }
        });
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.getCDKeyList();
      },
      exportCDKey() {
        this.$refs.CDKeyTable.exportCsv({
          filename: '激活码'
        });
      },
      queryCDKey() {
        if (!this.cdkey) {
          this.$Message.info('请先输入激活码！');
          return;
        }
        this.getCDKeyList();
      },
      generateCDKey() {
        this.codeModal = true;
        this.genCode.mealid = 0;
        this.genCode.expire = 0;
        this.genCode.total = 0;
        this.getMealList();
      },
      ok() {
        if(this.genCode.mealid<=0 ||  parseInt(this.genCode.expire)<=0 ||  parseInt(this.genCode.total)<=0){
          this.$Message.error('请确认输入的内容是否正确');
          return;
        }
        let params = this.genCode;
        generateCode(params).then(result => {
          if (result.ret && result.ret === 1) {
            this.$Message.success('成功');
            this.getCDKeyList();
          } else {
            this.$Message.error('失败');
          }
        });
      },
      cancel() {
        this.codeModal = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>