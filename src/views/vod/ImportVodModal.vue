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
            <DatePicker type="date" placeholder="选择日期" value="form.meal_expire"
                        @on-change="handleMealExpireDate"></DatePicker>
        </FormItem>
        <FormItem label="使用地区">
            <Col span="8">
            <Select v-model="selectedCountry" @on-change="getProvinces">
                <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name
                    }}
                </Option>
            </Select>
            </Col>
            <Col span="8">
            <Select v-model="selectedProvince" @on-change="getCities">
                <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name
                    }}
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
            <DatePicker type="date" placeholder="选择日期" value="form.auth_expire"
                        @on-change="handleAuthExpireDate"></DatePicker>
        </FormItem>
        <FormItem label="脱网使用寿命" prop="offline_time">
            <Input v-model.number="form.offline_time" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="用户信息" prop="agent_info">
            <Input v-model="form.agent_info" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="上传文件">
            <input ref="myFile" name="myFile" type="file" @change="checkFile" class="foo">
        </FormItem>
        <!--<Upload-->
        <!--ref="upload"-->
        <!--:action="upload.url"-->
        <!--:before-upload="handleBeforeUpload"-->
        <!--:on-progress="handleProgress"-->
        <!--:on-success="handleSuccess"-->
        <!--:on-error="handleError"-->
        <!--:data="params"-->
        <!--type="drag"-->
        <!--accept="txt">-->
        <!--<div style="padding: 20px 0">-->
        <!--<Icon type="ios-cloud-upload" size="20" style="color: #3399ff"></Icon>-->
        <!--<p>点击或将文件拖拽到这里上传</p>-->
        <!--</div>-->
        <!--</Upload>-->
        <FormItem>
            <Button type="primary" @click="handleSubmit('form')">提交</Button>
        </FormItem>
    </Form>

</template>
<script>
  var md5 = require('md5');
  import {getProductList, getRegionList, getQnToken} from '../../api/commonApi'
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
          agent_info: null,
          url: null
        },
        params: {
          token: '',
          key: null
        },
        upload: {
          url: 'http://upload.qiniu.com/',
          status: '等待上传'
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
//      this.getQnToken();
    },
    methods: {
      checkFile() {
        var files = this.$refs.myFile.files;//获取到文件列表
        if (files.length === 0) {
          this.$Message.error('请选择文件');
        } else {
          var reader = new FileReader();//新建一个FileReader
          reader.readAsText(files[0], "UTF-8");//读取文件
          reader.onload = function (evt) { //读取完文件之后会回来这里
            var fileString = evt.target.result; // 读取文件内容
            console.log(fileString)
          }
        }
      },
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
      handleSubmit(name) {
        this.form.region = [this.selectedCountry, this.selectedProvince, this.selectedCity].join(',');
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
//      getQnToken() {
//        getQnToken().then(res => {
//          this.params.token = res.uptoken;
//        });
//      },
//      handleBeforeUpload(file) {
//        var reader = new FileReader();//新建一个FileReader
//            reader.readAsText(file, "UTF-8");//读取文件
//            reader.onload = function(evt){ //读取完文件之后会回来这里
//            var fileString = evt.target.result; // 读取文件内容
//              console.log(fileString)
//        }
//
//        let len = file.name.length;
//        let idx = file.name.lastIndexOf('.');
//        let fileName = file.name.slice(0, idx);
//        let type = file.name.slice(idx, len);
//        this.params.key = `api_kbubbles/resource/vodinfo/${md5(fileName)}${type}`;
//      },
//      handleProgress(e) {
//        this.upload.status = '上传 ' + e.percent + '%';
//      },
//      handleSuccess() {
//        this.upload.status = '上传成功';
//        this.form.url = this.params.key;
//      },
//      handleError() {
//        this.upload.status = '上传失败';
//      }
    }
  }
</script>
<style scoped>
    .foo {
    display: block;
    position: relative;
    width: 100px;
    margin: auto;
    cursor: pointer;
    border: 0;
    height: 40px;
    border-radius: 5px;
    outline: 0;
}
.foo:hover:after {
    background: #11b69b;
}
.foo:after {
    transition: 200ms all ease;
    /*border-bottom: 3px solid rgba(0,0,0,.2);*/
    background: #11b69b;
    text-shadow: 0 2px 0 rgba(0,0,0,.2);
    color: #fff;
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    content: '上传文件';
    line-height: 40px;
    border-radius: 5px;
}
</style>
