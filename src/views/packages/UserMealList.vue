<template>
  <div>
    <Table :loading="mealLoading" :columns="currentMealCols" :data="currentMealList"></Table>
    <Modal
            transfer=false
            v-model="mealInfoModal"
            title="修改套餐数量"
            @on-ok="ok"
            @on-cancel="cancel" class="abc">
        <Form :model="mealInfo"  :label-width="80">
            <FormItem label="开始时间" prop="tname">
                <Input v-model="mealInfo.starttime" disabled></Input> 
            </FormItem>
            <FormItem label="结束时间" prop="tname">
                <Input v-model="mealInfo.endtime" disabled></Input> 
            </FormItem>
            <FormItem label="剩余数量" prop="tname">
                <Input v-model="mealInfo.meal_lasttotal"></Input> 
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
  import {getUserMealListDetail, editUserMealTotal} from '../../api/mealApi'
  export default {
    props: {
      meal: {
        mac: 'xxx'
      }
    },
    data() {
      return {
        mealLoading: false,
        vodLoading: false,
        mealInfo: {
            starttime: "",
            endtime: "",
            meal_lasttotal: "",
        },
        mealInfoModal: false,
        currentMealCols: [
          {title: '开始', key: 'starttime'}, 
          {title: '结束', key: 'endtime'},
          {title: '总量', key: 'meal_total'},
          {title: '剩余量', key: 'meal_lasttotal'}, 
          {title: '操作', width: 80, render: (h, params) => {
            var oplist = [
              h('Button',{
                 on: {
                  click: () => {
                    this.EditTotal(params.row);
                  }
                },
                props: {
                  type: 'primary',
                  shape: 'circle',
                  size: "small"
                }
              }, '编辑')
            ];
            return oplist;
          }}
        ],
        currentMealList: []
      }
    },
    mounted() {  
      
    },
    methods: {
      getMealList() {
        this.mealLoading = true;
        console.log(this.meal);
        getUserMealListDetail({umid: this.meal.mealid}).then(result => {
        this.mealLoading = false;
        if (result.code && result.code === 200) {
            this.currentMealList = result.data;
        }
        }).catch(() => {
            this.mealLoading = false;
        });
        console.log('xxxxx');
      },
      EditTotal(meal){
        this.mealInfo = meal;
        this.mealInfoModal = true;
      },
      ok(){
        editUserMealTotal(this.mealInfo).then(result => {
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
    },
    watch: {
      meal: function(val){
          console.log('xxxxx');
        this.mealLoading = true;
        console.log(this.meal);
        getUserMealListDetail({umid: this.meal.mealid}).then(result => {
        this.mealLoading = false;
        if (result.code && result.code === 200) {
            this.currentMealList = result.data;
        }
        }).catch(() => {
            this.mealLoading = false;
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>
<style>
.abc{
    z-index: 10000;
}
</style>