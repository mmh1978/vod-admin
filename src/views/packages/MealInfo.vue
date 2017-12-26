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
      <Col span="4">
      <Button type="primary" @click="queryMeal">查询</Button>
      <Button type="success" @click="openModal">新增套餐</Button>
      </Col>
    </Row>
    <Card>
      <p slot="title">
        套餐种类
      </p>
      <a href="#" slot="extra" @click.prevent="exportMealList">
        <Icon type="android-open"></Icon>
        导出
      </a>
      <Table :loading="loading" ref="mealTable" :data="mealList" :columns="mealColumns" stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="mealTotal" :current="pageNo" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal
      v-model="mealInfoModal"
      title="新增套餐种类"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="mealInfo" :model="mealInfo" :rules="mealInfoRule" :label-width="80">
        <FormItem label="套餐名称" prop="meal_name">
          <Input v-model="mealInfo.meal_name" placeholder="请输入套餐名称"></Input>
        </FormItem>
        <FormItem label="套餐价格" prop="meal_fee">
          <Input v-model="mealInfo.meal_fee" placeholder="请输入价格"></Input>
        </FormItem>
        <FormItem label="套餐类型" prop="meal_type"> 
          <Select v-model="mealInfo.meal_type" placeholder="请选择">
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <!--<FormItem label="产品类型" prop="prodType">-->
        <!--<Input v-model="mealInfo.prodType" placeholder="请输入"></Input>-->
        <!--</FormItem>-->
        <FormItem label="套餐描述" prop="meal_details">
          <Input v-model="mealInfo.meal_details" placeholder="请输入描述"></Input>
        </FormItem>
        <FormItem label="可用时长(月)" prop="meal_validtime">
          <Input v-model="mealInfo.meal_validtime" placeholder="请输入时长"></Input>
        </FormItem>
        <FormItem label="下载量" prop="total">
          <Input v-model="mealInfo.meal_total" placeholder="请输入可下载量"></Input>
        </FormItem>
        <FormItem label="下载速度(KB)" prop="total">
          <Input v-model="mealInfo.meal_downspeed" placeholder="请输入下载速度"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {getProductList, getRegionList, getMealList, editMeal} from '../../api/mealApi'
  export default {
    data() {
      return {
        loading: false,
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        typeList: [
          {
            id: 1,
            name: "不限量按时间"
          },{
            id: 3,
            name: "时间+下载量"
          },{
            id: 4,
            name: "时间(月)+下载量"
        }],
        mealColumns: [
          {title: 'ID', key: 'id', width: 60}, 
          {title: '套餐名称', key: 'meal_name'}, 
          {title: '套餐描述', key: 'meal_details'},
          {title: '套餐类型', key: 'meal_type_desc', render: (h, params) => {
            const row = params.row;
            var name = "";
            for (var i in this.typeList){
              if (this.typeList[i].id == row.meal_type){
                name = this.typeList[i].name;
                break;
              }
            }
            return name;
          }}, 
          {title: '套餐价格', key: 'meal_fee', width: 120},
          {title: '可用时长(月)', key: 'meal_validtime', width: 120},
          {title: '数量', key: 'meal_total', width: 60},
          {title: '时间', key: 'meal_intime'},
          {title: '操作', key: '', width: 80, render: (h, params) => {
            const row = params.row; 
            var oplist = [h('Button',{
                 on: {
                  click: () => {
                    this.editMeal(row);
                  }
                },
              props: {
                type: 'primary',
                size: 'small',
                shape: 'circle'
              }
              }, '编辑')]; 
            return oplist;
          }}
        ],
        mealList: [],
        pageNo: 1,
        pageSize: 10,
        mealTotal: 0,
        mealInfoModal: false,
        mealInfo: {
          id: 0,
          meal_name: '',
          meal_fee: '00.00',
          meal_type: 0,
          meal_details: '',
          meal_validtime: 12,
          meal_total: 0,
          meal_downspeed: 1024000
        },
        mealInfoRule: {
          id: [
            {required: true, message: 'ID不能为空', trigger: 'blur'}
          ],
          meal_name: [
            {required: true, message: '套餐名称不能为空', trigger: 'blur'}
          ],
          meal_fee: [
            {required: true, message: '套餐价格不能为空', trigger: 'blur'}
          ],
//          prodType: [
//            {required: true, message: '请选择产品类型', trigger: 'change'}
//          ],
          meal_details: [
            {required: true, message: '套餐描述不能为空', trigger: 'blur'}
          ],
          meal_validtime: [
            {required: true, message: '可用时长不能为空', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.getProductList();
      this.getRegionList();
      this.getMealList();
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
      getMealList() {
        this.loading = true;
        this.mealList = [];
        var params = {product_name: this.selectedProd, region_name: this.selectedCountry,
          page: this.pageNo, size: this.pageSize};
        getMealList(params).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.mealList = result.data;
            this.mealTotal = result.total;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      queryMeal() {
        this.getMealList();
      },
      exportMealList() {
        this.$refs.mealTable.exportCsv({
          filename: '套餐信息'
        });
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.getMealList();
      },
      openModal() {
        this.mealInfoModal = true;
        this.mealInfo = {
          id: 0,
          meal_name: '',
          meal_fee: '00.00',
          meal_type: 0,
          meal_details: '',
          meal_validtime: 12,
          meal_total: 0,
          meal_downspeed: 0
        };
      },
      editMeal(meal) { 
        this.mealInfoModal = true;
        this.mealInfo = {
          id: meal.id,
          meal_name: meal.meal_name,
          meal_fee: meal.meal_fee,
          meal_type: meal.meal_type,
          meal_details: meal.meal_details,
          meal_validtime: meal.meal_validtime,
          meal_total: meal.meal_total,
          meal_downspeed: meal.meal_downspeed
        };
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      ok() {
        let params = this.mealInfo;
        if (params.meal_total == ""){
          params.meal_total = 0;
        }
        this.$refs['mealInfo'].validate(valid => {
          if (valid) {
            editMeal(params).then(result => {
              if (result.ret && result.ret === 1) {
                this.$Message.success('成功');
              } else {
                this.$Message.error('失败');
              }
            });
          } else {
            this.$Message.error('表单验证失败！');
          }
        });
      },
      cancel() {
        this.mealInfoModal = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>