<template>
    <div>
        <Row class="search-area">
            <Col span="2">
            <Select v-model="selectedType">
                <Option v-for="item in typeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
            </Select>
            </Col>
            <Col span="3">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <Col span="2">
            <!--<Cascader :data="regionList" v-model="selectedRegion"></Cascader>-->
            <Select v-model="selectedCountry" @on-change="getProvinces">
                <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="2">
            <Select v-model="selectedProvince" @on-change="getCities">
                <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">{{ item.region_name }}
                </Option>
            </Select>
            </Col>
            <Col span="2">
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
            <Button type="primary" @click="queryRes">查询</Button>
            <Button type="success" @click="addRes">新增</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <a href="#" slot="extra" @click.prevent="exportResList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table ref="resList" :loading="loading" :data="resList" :columns="resColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
                v-model="resInfoModal"
                title="新增软件版本"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="resInfo" :model="resInfo" :rules="resInfoRule" :label-width="80">
                <FormItem label="资源类型" prop="tname">
                    <Select v-model="resInfo.type">
                        <Option v-for="item in typeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="版本号" prop="version">
                    <Input v-model="resInfo.version" placeholder="请输入 1.0.0.0"></Input>
                </FormItem>
                <FormItem label="产品" prop="product_name">
                    <Select v-model="resInfo.product_id">
                        <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="最低软件版本" prop="program">
                    <Input v-model="resInfo.program" placeholder="请输入 1.0.0.0"></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input v-model="resInfo.content" placeholder="请输入"></Input>
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
  import * as resapi from '../../api/operationApi'
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
        typeList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedType: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        resInfo: {
          id: 0,
          product_id: 0,
          type: '',
          version: "",
          program: "",
          content: "",
          url: "",
          force: false
        },
        resInfoRule: {},
        resInfoModal: false,
        resColumns: [
          {title: 'ID', key: 'id', width: 60},
          {
            title: '产品', key: 'product_name', width: 120, render: (h, params) => {
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
          {title: '版本号', key: 'version', width: 80},
          {title: '类型', key: 'tname', width: 100},
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
          {
            title: '是否强制', key: 'force', width: 120, render: (h, params) => {
            const row = params.row;
            return row.force === 1 ? '是' : '否';
          }
          },
          {title: '时间', key: 'intime', width: 180},
          {
            title: '操作', key: '', width: 300, render: (h, params) => {
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
                  this.editRes(params.row);
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
                    this.publishRes(params.row, state);
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
                    this.publishRes(params.row, 2);
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
        resList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0
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
      this.getResTypeList();
      this.getQnToken();
    },
    methods: {
      getResList() {
        this.loading = true;
        resapi.getResList({
          page: this.pageNo,
          size: this.pageSize,
          product_id: this.selectedProd,
          type: this.selectedType
        }).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.resList = result.data;
            this.total = result.total;
          }
        }).catch(error=>{
          this.loading = false;
        });
      },
      getResTypeList() {
        resapi.getResTypeList().then(result => {
          if (result.code && result.code === 200) {
            this.typeList = result.data;
          }
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
      queryRes() {
        this.getResList();
      },
      queryLastWeek() {},
      queryLastMonth() {},
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.queryRes();
      },
      publishRes(res, state) {
        var msg = "";
        if (state == 3){msg = "发布测试";}
        if (state == 1){msg = "发布";}
        if (state == 2){msg = "下架";}
        msg = '你确定要[' + msg + "]这条信息吗？";
        this.$Modal.confirm({
            title: '提示',
            content: msg,
            onOk: () => {
              resapi.publishRes({id: res.id, state: state}).then(result => {
                if (result.ret && result.ret === 1) {
                  this.$Message.success('成功！');
                  this.queryRes();
                } else {
                  this.$Message.error('失败！');
                }
              });
            }
        });
      },
      exportResList() {
        this.$refs.resList.exportCsv({
          filename: '资源版本'
        });
      },
      addRes() {
        this.resInfoModal = true;
        this.resInfo = {
          id: 0,
          product_id: 0,
          type: '',
          version: "",
          program: "",
          content: "",
          url: "",
          force: false
        };
      },
      editRes(res) {
        this.resInfoModal = true;
        this.resInfo = res;
        this.force = res.force === 1;
      },
      getQnToken() {
        getQnToken().then(res => {
          this.params.token = res.uptoken;
        });
      },
      handleBeforeUpload(file) {
        let len = file.name.length;
        let idx = file.name.lastIndexOf('.');
        let fileName = file.name.slice(0, idx);
        let type = file.name.slice(idx, len);
        this.params.key = `api_kbubbles/resource/${md5(fileName)}${type}`;
      },
      handleProgress(e) {
        this.upload.status = '上传 ' + e.percent + '%';
      },
      handleSuccess() {
        this.upload.status = '上传成功';
        this.resInfo.url = this.params.key;
      },
      handleError() {
        this.upload.status = '上传失败';
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      ok() {
        let params = {
          id: this.resInfo.id,
          product_id: this.resInfo.product_id,
          type: this.resInfo.type,
          version: this.resInfo.version,
          program: this.resInfo.program,
          content: this.resInfo.content,
          url: this.resInfo.url,
          force: this.force ? 1 : 0
        };
        this.$refs['resInfo'].validate(valid => {
          if (valid) {
            resapi.editRes(params).then(result => {
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
        this.resInfoModal = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>