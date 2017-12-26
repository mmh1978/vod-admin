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
            <Button type="primary" @click="querySoft">查询</Button>
            <Button type="success" @click="addSoft">新增</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <a href="#" slot="extra" @click.prevent="exportMealList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table ref="mealTable" :loading="loading" :data="softList" :columns="softColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
                v-model="softInfoModal"
                title="新增软件版本"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="softInfo" :model="softInfo" :rules="softInfoRule" :label-width="120">
                <FormItem label="产品" prop="product_name">
                    <Select v-model="softInfo.product_id">
                        <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="产品版本号" prop="version">
                    <Input v-model="softInfo.version" placeholder="请输入 1.0.0.0"></Input>
                </FormItem>
                <FormItem label="最小可升级版本号" prop="min_version">
                    <Input v-model="softInfo.min_version" placeholder="请输入 1.0.0.0"></Input>
                </FormItem>
                <FormItem label="最大可升级版本号" prop="max_version">
                    <Input v-model="softInfo.max_version" placeholder="请输入 1.0.0.0"></Input>
                </FormItem>
                <!--<FormItem label="产品类型" prop="prodType">-->
                <!--<Input v-model="mealInfo.prodType" placeholder="请输入"></Input>-->
                <!--</FormItem>-->
                <FormItem label="内容" prop="content">
                    <Input v-model="softInfo.content" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="是否强制">
                    <i-switch v-model="force">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="选择资源">
                    <Upload
                            ref="upload"
                            :action="upload.url"
                            :before-upload="handleBeforeUpload"
                            :on-progress="handleProgress"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :data="params">
                        <Button type="ghost" icon="ios-cloud-upload-outline">{{upload.status}}</Button>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
  var md5 = require('md5');
  import * as oapi from '../../api/operationApi'
  import {getProductList, getRegionList, getQnToken} from '../../api/commonApi'

  export default {
    data() {
      return {
        queryMode: '',
        loading: false,
        params: {
          token: '',
          key: null
        },
        upload: {
          url: 'http://upload.qiniu.com/',
          status: '等待上传'
        },
        force: false,
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        softInfo: {
          id: 0,
          product_id: 0,
          version: "",
          min_version: "",
          max_version: "",
          content: "",
          force: false,
          url: ""
        },
        softInfoRule: {},
        softInfoModal: false,
        softColumns: [
          {title: 'ID', key: 'id', width: 60},
          {
            title: '产品', key: 'product_name', render: (h, params) => {
            const row = params.row;
            var name = '';
            for (var i = 0; i < this.productList.length; i++) {
              if (row.product_id == this.productList[i].id) {
                name = this.productList[i].product_name;
                break;
              }
            }
            return name;
          }
          },
          {title: '版本号', key: 'version'},
          {
            title: '版本区间', key: 'version', render: (h, params) => {
            const row = params.row;
            return row.min_version + '-' + row.max_version;
          }
          },
          {
            title: '是否强制', key: 'force', width: 100, render: (h, params) => {
            const row = params.row;
            const text = row.force == 1 ? '是' : '否';
            return text;
          }
          },
          {
            title: 'URL', key: 'url', width: 80, render: (h, params) => {
            const row = params.row;
            const text = row.url;
            return h('A', {
              domProps: {
                href: text
              }
            }, '下载');
          }
          },
          {
            title: '状态', key: 'state', width: 100, render: (h, params) => {
            const row = params.row;
            var name = '';
            switch (row.state) {
              case 0:
                name = '待发布';
                break;
              case 1:
                name = '已经发布';
                break;
              case 2:
                name = '下架';
                break;
              case 3:
                name = '发布测试';
                break;
            }
            return name;
          }
          },
          {title: '时间', key: 'intime', width: 160},
          {
            title: '操作', key: '', width: 180, render: (h, params) => {
            const row = params.row;
            var name = '';
            var state = 0;
            switch (row.state) {
              case 0:
                state = 3;
                name = '发布测试';
                break;
              case 3:
                state = 1;
                name = '发布';
                break;
            }
            var oplist = [h('Button', {
              on: {
                click: () => {
                  this.editSoft(params.row);
                }
              },
              props: {
                type: 'primary',
                size: 'small',
                shape: 'circle'
              }
            }, '编辑')];
            if (name) {
              oplist.push(h('Button', {
                on: {
                  click: () => {
                    this.publishSoft(params.row, state);
                  }
                },
                props: {
                  size: 'small',
                  shape: 'circle'
                }
              }, name));
            }
            if (row.state != 2) {
              oplist.push(h('Button', {
                on: {
                  click: () => {
                    this.publishSoft(params.row, 2);
                  }
                },
                props: {
                  size: 'small',
                  shape: 'circle'
                }
              }, '下架'));
            }
            return oplist;
          }
          }
        ],
        softList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
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
    mounted() {
      this.getProductList();
      this.getRegionList();
      this.getQnToken();
    },
    methods: {
      handleBeforeUpload(file) {
        let len = file.name.length;
        let idx = file.name.lastIndexOf('.');
        let fileName = file.name.slice(0, idx);
        let type = file.name.slice(idx, len);
        this.params.key = `api_kbubbles/soft/${md5(fileName)}${type}`;
      },
      handleProgress(e) {
        this.upload.status = '上传 ' + e.percent + '%';
      },
      handleSuccess() {
        this.upload.status = '上传成功';
        this.softInfo.url = this.params.key;
      },
      handleError() {
        this.upload.status = '上传失败';
      },
      getQnToken() {
        getQnToken().then(res => {
          this.params.token = res.uptoken;
        });
      },
      getSoftList() {
        this.loading = true;
        oapi.getSoftList({page: this.pageNo, size: this.pageSize, product_id: this.selectedProd}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.softList = result.data;
            this.total = result.total;
          }
        }).catch(error=>{
          this.loading = false;
        });
      },
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
      querySoft() {
        this.getSoftList();
      },
      queryLastWeek() {},
      queryLastMonth() {},
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.querySoft();
      },
      publishSoft(soft, state) {
        oapi.publishSoft({id: soft.id, state: state}).then(result => {
          if (result.ret && result.ret === 1) {
            this.$Message.success('成功！');
          } else {
            this.$Message.error('失败！');
          }
        });
      },
      exportMealList() {
        this.$refs.mealTable.exportCsv({
          filename: '套餐信息'
        });
      },
      addSoft() {
        this.softInfoModal = true;
        this.softInfo = {
          id: 0,
          product_id: 0,
          version: "",
          min_version: "",
          max_version: "",
          content: "",
          url: ""
        };
        this.upload = {
          url: 'http://upload.qiniu.com/',
          status: '等待上传'
        };
        this.$refs.upload.clearFiles();
      },
      editSoft(soft) {
        // TODO
        this.softInfoModal = true;
        this.softInfo = soft;
        this.softInfo.product = {
          id: soft.id,
          product_id: soft.product_id,
          version: soft.version,
          min_version: soft.min_version,
          max_version: soft.max_version,
          content: soft.content,
          force: soft.force === 1,
          url: soft.url
        };
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      ok() {
        this.softInfo.force = this.force ? 1 : 0;
        let params = {
          id: this.softInfo.id,
          product_id: this.softInfo.product_id,
          version: this.softInfo.version,
          min_version: this.softInfo.min_version,
          max_version: this.softInfo.max_version,
          content: this.softInfo.content,
          force: this.softInfo.force,
          url: this.softInfo.url
        };
        this.$refs['softInfo'].validate(valid => {
          if (valid) {
            oapi.editSoft(params).then(result => {
              if (result.ret && result.ret === 1) {
                this.$Message.success('成功！');
              } else {
                this.$Message.error('失败！');
              }
            }).catch(error => {
              this.$Message.error(error.msg);
            });
          } else {
            this.$Message.error('表单验证失败！');
          }
        });
      },
      cancel() {
        this.softInfoModal = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>