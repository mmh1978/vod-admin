<template>
    <div>
        <Row class="search-area">
            <Col span="8">
            <Button type="primary" @click="queryTheme">查询</Button>
            <Button type="success" @click="addTheme">新增</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <Table ref="mealTable" :loading="loading" :data="themeList" :columns="themeColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
                v-model="themeModal"
                title="新增主题"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="theme" :model="theme" :rules="themeRule" :label-width="80">
                <FormItem label="主题名称" prop="name">
                    <Input v-model="theme.name" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="选择资源" prop="url">
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
                    <!--<Button v-model="theme.url" > 选择上传</Button>-->
                </FormItem>
            </Form>
        </Modal>

        <Modal
                v-model="themeInfoModal"
                width="1300"
                title="主题详细列表" :styles="{top: '20px'}">
            <div>
                <Row class="search-area">
                    <Col span="4">
                    <Select v-model="selectedProd">
                        <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}
                        </Option>
                    </Select>
                    </Col>
                    <Col span="4">
                    <!--<Cascader :data="regionList" v-model="selectedRegion"></Cascader>-->
                    <Select v-model="selectedCountry" @on-change="getProvinces">
                        <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">
                            {{ item.region_name }}
                        </Option>
                    </Select>
                    </Col>
                    <Col span="4">
                    <Select v-model="selectedProvince" @on-change="getCities">
                        <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">
                            {{ item.region_name }}
                        </Option>
                    </Select>
                    </Col>
                    <Col span="4">
                    <Select v-model="selectedCity">
                        <Option v-for="item in cities" :value="item.region_code" :key="item.region_code">{{ item.region_name
                            }}
                        </Option>
                    </Select>
                    </Col>
                    <Col span="8">
                    <Button type="primary" @click="queryThemeInfo">查询</Button>
                    <Button type="success" @click="addThemeInfo">新增</Button>
                    </Col>
                </Row>
                <Card>
                    <p slot="title">
                        详情明细
                    </p>
                    <Table ref="mealTable" :loading="infoLoading" :data="themeInfoList" :columns="themeInfoColumns" stripe></Table>
                    <div style="margin: 10px;overflow: hidden">
                        <div style="float: right;">
                            <Page :total="themeTotal" :current="pageThemeNo" @on-change="changeThemePage"></Page>
                        </div>
                    </div>
                </Card>
            </div>
        </Modal>
        <Modal
                v-model="themeInfoModal1"
                title="新增主题信息"
                @on-ok="themeok"
                @on-cancel="themecancel">
            <Form ref="themeinfo" :model="themeinfo" :rules="themeInfoRule" :label-width="80">
                <FormItem label="主题名称" prop="name">
                    <label> {{themeinfo.name}} </label>
                </FormItem>
                <FormItem label="产品" prop="product_id">
                    <Select v-model="themeinfo.product_id">
                        <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="软件版本" prop="program">
                    <Input v-model="themeinfo.program" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="主题版本" prop="version">
                    <Input v-model="themeinfo.version" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="选择资源" prop="url">
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
                    <!--<Button v-model="themeinfo.url" > 选择上传</Button>-->
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
  var md5 = require('md5');
  import * as themeapi from '../../api/operationApi'
  import {getProductList, getRegionList, getQnToken} from '../../api/commonApi'
  
  export default {
    data() {
      return {
        loading: false,
        infoLoading: false,
        params: {
          token: '',
          key: null
        },
        upload: {
          url: 'http://upload.qiniu.com/',
          status: '等待上传'
        },
        productList: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedProd: '',
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        themeinfo: {
          id: 0,
          name: "",
          product_id: 0,
          program: '',
          version: '',
          url: ''
        },
        theme: {
          id: 0,
          name: "",
          state: 0,
          url: ""
        },
        themeRule: {
          name: [
            {required: true, message: '主题名称不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '下载路径不能为空', trigger: 'blur'}
          ]
        },
        themeInfoRule: {
          program: [
            {required: true, message: '软件版本不能为空', trigger: 'blur'}
          ],
          version: [
            {required: true, message: '主题版本不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: 'URL不能为空', trigger: 'blur'}
          ]
        },
        themeModal: false,
        themeInfoModal: false,
        themeInfoModal1: false,
        themeColumns: [
          {title: '序号', key: 'id', width: 60},
          {title: '主题名称', key: 'name'},
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
          {title: '时间', key: 'uptime'},
          {
            title: '操作', key: '', render: (h, params) => {
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
                  this.editTheme(params.row);
                }
              },
              props: {
                type: 'primary',
                size: 'small',
                shape: 'circle'
              }
            }, '编辑'),
              h('Button', {
                on: {
                  click: () => {
                    this.showThemeInfoList(params.row);
                  }
                },
                props: {
                  type: 'primary',
                  size: 'small',
                  shape: 'circle'
                }
              }, '查看')];
            if (name) {
              oplist.push(h('Button', {
                on: {
                  click: () => {
                    this.publishTheme(params.row, state);
                  }
                },
                props: {
                  size: 'small',
                  shape: 'circle'
                }
              }, name));
            }
            if (row.state !== 2) {
              oplist.push(h('Button', {
                on: {
                  click: () => {
                    this.publishTheme(params.row, 2);
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
        themeInfoColumns: [
          {title: '序号', key: 'id', width: 60},
          // {
          //   title: '产品', key: 'product_name', render: (h, params) => {
          //   return 'selectedProd';
          // }
          // },
          {title: '软件版本', key: 'program'},
          {title: '主题版本', key: 'version'},
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
          {title: '时间', key: 'uptime'},
          {
            title: '操作', key: '', width: 200, render: (h, params) => {
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
                  this.editThemeInfo(params.row);
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
                    this.publishThemeInfo(params.row, state);
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
                    this.publishThemeInfo(params.row, 2);
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
        themeList: [],
        themeInfoList: [],
        pageThemeNo: 1,
        themeTotal: 0,
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
    },
    mounted() {
      this.getProductList();
      this.getRegionList();
      this.getThemeList();
      this.getQnToken();
    },
    methods: {
      handleBeforeUpload(file) {
        let len = file.name.length;
        let idx = file.name.lastIndexOf('.');
        let fileName = file.name.slice(0, idx);
        let type = file.name.slice(idx, len);
        this.params.key = `api_kbubbles/theme/${md5(fileName)}${type}`;
      },
      handleProgress(e) {
        this.upload.status = '上传 ' + e.percent + '%';
      },
      handleSuccess() {
        this.upload.status = '上传成功';
        if (this.themeInfoModal1) {
          this.themeinfo.url = this.params.key;
        } else if (this.themeModal) {
          this.theme.url = this.params.key;
        }
      },
      handleError() {
        this.upload.status = '上传失败';
      },
      getQnToken() {
        getQnToken().then(res => {
          this.params.token = res.uptoken;
        });
      },
      getThemeList() {
        this.loading = true;
        themeapi.getThemeList({page: this.pageNo, size: this.pageSize}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.themeList = result.data;
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
      queryTheme() {
        this.getThemeList();
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.queryTheme();
      },
      publishTheme(theme, state) {

        themeapi.publishTheme({id: theme.id, state: state}).then(result => {
          if (result.ret && result.ret === 1) {
            this.$Message.success('成功！');
          } else {
            this.$Message.error('失败！');
          }
        });
      },
      addTheme() {
        // TODO
        this.themeModal = true;
        this.theme = {
          id: 0,
          name: "",
          url: ""
        };
      },
      editTheme(theme) {
        // TODO
        this.themeModal = true;
        this.theme = theme;
      },
      showThemeInfoList(theme) {
        this.themeInfoModal = true;
        this.theme = theme;
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      ok() {
        let params = {
          id: this.theme.id,
          name: this.theme.name,
          url: this.theme.url
        };
        this.$refs['theme'].validate(valid => {
          if (valid) {
            themeapi.editTheme(params).then(result => {
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
        this.themeModal = false;
      },
      themeok() {
        let params = {
          id: this.themeinfo.id,
          theme_id: this.themeinfo.theme_id,
          product_id: this.themeinfo.product_id,
          program: this.themeinfo.program,
          version: this.themeinfo.version,
          url: this.themeinfo.url
        };
        console.log(params);
        this.$refs['themeinfo'].validate(valid => {
          if (valid) {
            console.log(params);
            themeapi.editThemeInfo(params).then(result => {
              if (result.ret && result.ret === 1) {
                this.$Message.success('成功！');
              } else {
                this.$Message.error('失败！');
              }
            });
          } else {
            this.$Message.error('表单验证失败！');
          }
        });
      },
      themecancel() {
        this.themeInfoModal1 = false;
      },
      queryThemeInfo() {
        this.infoLoading = true;
        themeapi.getThemeInfoList({
          page: this.pageThemeNo,
          size: this.pageSize,
          themeid: this.theme.id,
          product_id: this.selectedProd
        }).then(result => {
          this.infoLoading = false;
          if (result.code && result.code === 200) {
            this.themeInfoList = result.data;
            this.themeTotal = result.total;
          }
        }).catch(error=>{
          this.infoLoading = false;
        });
      },
      addThemeInfo() {
        this.themeInfoModal1 = true;
        this.themeinfo = {
          id: 0,
          name: this.theme.name,
          product_id: 0,
          program: '',
          version: '',
          url: ''
        }
      },
      editThemeInfo(theme) {
        this.themeInfoModal1 = true;
        this.themeinfo = theme;
        console.log(this.theme);
        this.themeinfo.name = this.theme.name;
        this.themeinfo.theme_id = this.theme.id;
      },
      changeThemePage(pageNo) {
        this.pageThemeNo = pageNo;
        this.queryThemeInfo();
      },
      publishThemeInfo(theme, state) {
        themeapi.publishThemeInfo({id: theme.id, state: state}).then(result => {
          if (result.ret && result.ret === 1) {
            this.$Message.success('成功！');
          } else {
            this.$Message.error('失败！');
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>