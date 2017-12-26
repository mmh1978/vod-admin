<template>
  <div>
    <Row class="search-area">
      <Col span="4">
      <Input v-model="mac" placeholder="请输入mac地址" :maxlength="12"></Input>
      </Col>
      <Col span="2">
      <Button type="primary" @click="queryMealList">查询套餐</Button>
      </Col>
      <Col span="4">
      <Select v-model="mealid">
        <Option v-for="item in mealTypes" :value="item.id" :key="item.id">{{ item.meal_name }}</Option>
      </Select>
      </Col>
      <Col span="4">
      <Input v-model="macAdd" placeholder="请输入mac地址"></Input>
      </Col>
      <Col span="2">
      <Button type="primary" @click="addMealModal">添加套餐</Button>
      </Col>
    </Row>
    <Card style="margin-bottom: 20px;">
      <p slot="title">
        当前套餐
      </p>
      <Table :loading="mealLoading" :columns="currentMealCols" :data="currentMealList"></Table>
    </Card>
    <Card>
      <p slot="title">
        VOD充值记录
      </p>
      <Table :loading="vodLoading" :columns="vodRecordCols" :data="vodRecordList"></Table>
    </Card>
   <Modal v-model="mealInfoModal" title="用户套餐详细" width="80" :styles="{top: '10px'}">
        <user-meal-list :meal="mealInfo"></user-meal-list>
        <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {getUserMealList, addUserMeal, delUserMeal, changeUserMeal, getMealList} from '../../api/mealApi'
  import UserMealList from './UserMealList.vue'
  export default {
    data() {
      return {
        mealLoading: false,
        vodLoading: false,
        mac: '',
        mealType: '',
        mealTypes: [],
        macAdd: '',
        mealid: 0,
        mealInfo: {
          mac: "",
          cur_meal: "",
          mealid: 0
        },
        mealInfoModal: false,
        mealInfoRule: {
          id: [
            {required: true, message: 'ID不能为空', trigger: 'blur'}
          ],
          meal_name: [
            {required: true, message: '套餐名称不能为空', trigger: 'blur'}
          ],
          vod_umac: [
            {required: true, message: '套餐价格不能为空', trigger: 'blur'}
          ],
          vod_uname: [
            {required: true, message: '请选择套餐类型', trigger: 'change'}
          ],
//          prodType: [
//            {required: true, message: '请选择产品类型', trigger: 'change'}
//          ],
          meal_details: [
            {required: true, message: '套餐描述不能为空', trigger: 'blur'}
          ]
        },
        currentMealCols: [
          {title: '用户名', key: 'vod_uname'},
          {title: 'MAC地址', key: 'vod_umac'}, 
          {title: '开始', key: 'starttime'}, 
          {title: '到期', key: 'endtime'},
          {title: '描述', key: 'meal_name'}, 
          {title: '类型', key: 'meal_type', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.meal_type){
              case 1:
                name = '不限量按时间';
                break;
              case 3:
                name = '时间+下载量';
                break;
              case 4:
                name = '时间(月)+下载量';
                break;
              case 2:
                name = '';
                break;
            } 
            return name;
          }}, 
          {title: '总量', key: 'meal_total'},
          {title: '剩余量', key: 'meal_lasttotal'}, 
          {title: '状态', key: 'state', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.state){
              case 1:
                name = '正常';
                break;
              case 3:
                name = '变更';
                break;
              case 4:
                name = '已删除';
                break;
              case 2:
                name = '过期';
                break;
            } 
            return name;
          }}, 
          {title: '操作', width: 80, render: (h, params) => {
            var oplist = [
              h('Button',{
                 on: {
                  click: () => {
                    this.deleteUserMeal(params.row);
                  }
                },
                props: {
                  type: 'warning',
                  shape: 'circle',
                  size: "small"
                }
              }, '删除')
            ];
            return oplist;
          }}
        ],
        currentMealList: [],
        vodRecordCols: [
          {title: '添加时间', key: 'meal_intime'}, 
          {title: '开始', key: 'starttime'}, 
          {title: '结束', key: 'endtime'},
          {title: '描述', key: 'meal_name'}, 
          {title: '类型', key: 'meal_type', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.meal_type){
              case 1:
                name = '不限量按时间';
                break;
              case 3:
                name = '时间+下载量';
                break;
              case 4:
                name = '时间(月)+下载量';
                break;
              case 2:
                name = '';
                break;
            } 
            return name;
          }}, 
          {title: '总量', key: 'meal_total'},
          {title: '剩余量', key: 'meal_lasttotal'}, 
          {title: '订单号', key: 'meal_tradeno'}, 
          {title: '交易方式', key: 'paytype'},
          {title: '状态', key: 'state', render: (h, params) => {
            const row = params.row;
            var name = '';
            switch(row.state){
              case 1:
                name = '正常';
                break;
              case 3:
                name = '变更';
                break;
              case 4:
                name = '已删除';
                break;
              case 2:
                name = '过期';
                break;
            } 
            return name;
          }},{title: '操作', width: 80, render: (h, params) => {
            const row = params.row;
            if (row.state != 1){return [];} 
            var oplist = [
              h('Button',{
                 on: {
                  click: () => {
                    this.showUserMealList(params.row);
                  }
                },
                props: {
                  type: 'primary',
                  shape: 'circle',
                  size: 'small'
                }
              }, '查看')
            ];
            return oplist;
          }}
        ],
        vodRecordList: []
      }
    },
    components: {
      UserMealList
    },
    mounted() {
      this.getMealList();
    },
    methods: {
      queryMealList() {
        if(this.mac){
          this.mealLoading = true;
          getUserMealList({mac: this.mac}).then(result => {
            this.mealLoading = false;
            if (result.code && result.code === 200) {
              this.currentMealList = [result.current];
              this.vodRecordList = result.data;
            }
          }).catch(() => {
            this.mealLoading = false;
          });
        } else {
          this.$Message.error('Sorry! No found user\' mac info');
        }
      },
      addMealModal() {
        if (this.macAdd) { 
          addUserMeal({mac:this.macAdd, mealid: this.mealid}).then(result => {
            if (result.ret && result.ret === 1) {
              this.$Message.success("Add user\' package success");
              this.macAdd = "";
            } else {
              this.$Message.error("Add user\' package failed ");
            }
          });
        } else {
          this.$Message.warning('Sorry! No found user\' mac info');
        }
      },
      deleteUserMeal(meal) {
        this.$Modal.confirm({
            title: 'Prompt',
            content: 'Are you sure you want to delete a user\'s package ?',
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
                delUserMeal({uid: 1, id: 1}).then(result => {
                if (result.ret && result.ret === 1) {
                  this.$Message.success('Delete user\' package success');
                } else {
                  this.$Message.error('Sorry! The server may be error');
                }
              });
            },
            onCancel: () => {
                this.$Message.info('Clicked cancel');
            }
        });
      },
      changeUserMeal(meal) {
        this.mealInfo = {
          mac: meal.vod_umac,
          cur_meal: meal.meal_name,
        };
        this.mealInfoModal = true;
      },
      showUserMealList(meal){
        this.mealInfo = {
          mac: this.mac,
          mealid: meal.id
        };
        this.mealInfoModal = true;
      },
      getMealList() {
        getMealList().then(result => {
          if (result.code && result.code === 200) {
            this.mealTypes = result.data;
          }
        });
      },
      ok(){
        if (this.mealInfo.new_mealid <= 0){
          return;
        }
        changeUserMeal({mac: this.mealInfo.mac, mealid: this.mealInfo.new_mealid}).then(result => {
          if (result.ret && result.ret === 1) {
            this.$Message.success('成功！');
          } else {
            this.$Message.error('失败！');
          }
        });
      },
      cancel(){ 
        this.mealInfoModal = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>