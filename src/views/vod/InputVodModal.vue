<template>
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="100">
        <FormItem label="产品" prop="product_id">
            <Select v-model="form.product_id">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="MAC地址" prop="mac">
            <Input v-model="form.mac" placeholder="请输入mac地址"></Input>
        </FormItem>
        <FormItem label="套餐类型" prop="meal_id">
            <Select v-model="form.meal_id" placeholder="选择套餐">
                <Option v-for="item in mealList" :value="item.id" :key="item.id">{{item.meal_name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="套餐到期时间" prop="meal_expire">
            <DatePicker type="date" placeholder="选择日期" value="form.meal_expire" @on-change="handleMealExpireDate"></DatePicker>
        </FormItem>
        <FormItem label="使用地区">
            <Col span="8">
            <Select v-model="selectedCountry" @on-change="getProvinces">
                <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="8">
            <Select v-model="selectedProvince" @on-change="getCities">
                <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="8">
            <Select v-model="selectedCity">
                <Option v-for="item in cities" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
        </FormItem>
        <FormItem label="机顶盒限制使用时间" prop="auth_expire">
            <DatePicker type="date" placeholder="选择日期" value="form.auth_expire" @on-change="handleAuthExpireDate"></DatePicker>
        </FormItem>
        <FormItem label="脱网使用寿命" prop="offline_time">
            <Input v-model.number="form.offline_time" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="用户信息" prop="agent_info">
            <Input v-model="form.agent_info" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('form')">提交</Button>
        </FormItem>
    </Form>
</template>
<script>
  import {getProductList,getRegionList} from '../../api/commonApi'
  import {getMealList} from '../../api/mealApi'
  import {importVodInfo} from '../../api/vodApi'

  export default {
    data() {
      return {
        productList: [],
        mealList: [],
        regions: [],
        form: {
          product_id: null,
          mac: null,
          meal_id: null,
          meal_expire: null,
          region: null,
          auth_expire: null,
          offline_time: null,
          agent_info: null
        },
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        countries: [],
        provinces: [],
        cities: [],
        ruleValidate: {
          product_id: [
            {required: true, type: 'number', message: '请选择产品', trigger: 'change'}
          ],
          mac: [
            {required: true, message: '请输入mac地址', trigger: 'blur'}
          ],
          meal_id: [
            {required: true, type: 'number', message: '请选择套餐类型', trigger: 'change'}
          ],
          meal_expire: [
            {required: true, message: '请选择到期时间', trigger: 'change'}
          ],
          region: [
            {required: true, message: '请选择地区', trigger: 'change'}
          ],
          auth_expire: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ],
          offline_time: [
            {required: true, type: 'number', message: '请输入脱网使用寿命', trigger: 'blur'}
          ],
          agent_info: [
            {required: true, message: '请输入用户信息', trigger: 'blur'},
            {type: 'string', min: 3, message: '信息不能少于3字', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getProductList();
      this.getMealList();
      this.getRegionList();
    },
    methods: {
      handleMealExpireDate(date) {
        this.form.meal_expire = date;
      },
      handleAuthExpireDate(date) {
        this.form.auth_expire = date;
      },
      getProductList() {
        getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.productList = result.data;
          }
        });
      },
      getMealList() {
        getMealList({}).then(result => {
          if (result.code && result.code === 200) {
            this.mealList = result.data;
          }
        }).catch(() => {
          this.loading = false;
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
      handleSubmit(name) {
       this.form.region = this.getRegionCode();
        this.$refs[name].validate((valid) => {
          if (valid) {
            importVodInfo(this.form).then(result => {
              if (result.ret && result.ret === 1) {
                this.$Message.success('提交成功!');
              } else {
                this.$Message.error('提交失败！');
              }
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
  }
</script>
