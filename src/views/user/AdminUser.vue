<template>
    <div>
        <Row class="search-area">
            <Col span="4">
            <Input v-model="search" placeholder="请查询信息 如用户名"></Input>
            </Col>
            <Col span="8">
            <Button type="primary" @click="queryUser">查询</Button>
            <Button type="primary" @click="addUser">新增</Button>
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
            <Table ref="userTable" :loading="loading" :data="userList" :columns="userColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
                v-model="createUserModal"
                :title="modalTitle"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
                <FormItem v-if="superType === 0" label="地域">
                    <Row>
                        <Col span="6">
                        <Select v-model="selectedCountry" @on-change="getProvinces">
                            <Option v-for="item in countries" :value="item.region_code" :key="item.region_code">
                                {{ item.region_name }}
                            </Option>
                        </Select>
                        </Col>
                        <Col span="6">
                        <Select v-model="selectedProvince" @on-change="getCities">
                            <Option v-for="item in provinces" :value="item.region_code" :key="item.region_code">
                                {{ item.region_name }}
                            </Option>
                        </Select>
                        </Col>
                        <Col span="6">
                        <Select v-model="selectedCity">
                            <Option v-for="item in cities" :value="item.region_code" :key="item.region_code">
                                {{ item.region_name }}
                            </Option>
                        </Select>
                        </Col>
                        <Col span="4" offset="1">
                        <Button @click="addRegion">添加地域</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Tag v-for="(item,index) in selectedRegions" :key="item" :name="item" closable @on-close="deleteRegion(index)">{{ item }}</Tag>
                    </Row>
                </FormItem>
                <FormItem v-if="superType === 0" label="分组">
                    <Select v-model="form.group_id">
                        <Option v-for="item in groupIds" :value="item.id" :key="item.id">{{item.group_name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem v-if="superType === 0" label="产品">
                    <Select v-model="form.filter.product" multiple>
                        <Option v-for="item in productList" :value="item.id" :key="item.id">{{item.product_name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem v-if="superType === 0" label="super_type">
                    <Select v-model="form.super_type">
                        <Option :value="1" :key="1">1</Option>
                        <Option :value="2" :key="2">2</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="superType === 3">
                    <Select v-model="form.super_type">
                        <Option :value="3" :key="3">3</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="superType === 4">
                    <Select v-model="form.super_type">
                        <Option :value="4" :key="4">4</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model="form.uname" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="角色昵称">
                    <Select v-model="form.roleid">
                        <Option v-for="role in roleNames" :value="role.roleid" :key="role.roleid">{{role.role_name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="昵称">
                    <Input v-model="form.unick" placeholder="请输入昵称"></Input>
                </FormItem>
                <FormItem label="密码">
                    <Input v-model="form.upwd" placeholder="请输入密码" type="password"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('form')">提交</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  import * as userapi from '../../api/userApi'
  import Select2 from '../components/Select2.vue'
  import {getProductList, getRegionList} from '../../api/commonApi'
  import {mapGetters} from 'vuex'
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        loading: false,
        createUserModal: false,
        search: '',
        userColumns: [
          {title: 'ID', key: 'id', width: 60},
          {title: '用户名', key: 'uname', width: 120},
          {title: '昵称', key: 'unick', width: 180},
          {
            title: '角色名称', key: 'rolename', width: 180
          },
          {title: '修改日期', key: 'intime', width: 180},
          {
            title: '操作', render: (h, params) => {
            return [h('Button', {
              on: {
                click: () => {
                  this.editUser(params.row);
                }
              },
              props: {
                type: 'primary',
                shape: 'circle',
                size: 'small'
              }
            }, '编辑'),
              
              h('Button', {
                on: {
                  click: () => {
                    this.delUser(params.row);
                  }
                },
                props: {
                  type: 'warning',
                  shape: 'circle',
                  size: 'small'
                }
              }, '删除'),
            ];
          }
          }
        ],
        userList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        modalTitle: '',
        productList: [],
        selectedRegions: [],
        roleNames: [],
        macOptions: [
          {id: 1, text: 'Hello'},
          {id: 2, text: 'World'}
        ],
        songOptions: [
          {id: 1, text: 'Hello'},
          {id: 2, text: 'World'}
        ],
        groupIds: [],
        countries: [],
        provinces: [],
        cities: [],
        selectedCountry: '',
        selectedProvince: '',
        selectedCity: '',
        form: {
          id: 0,
          uname: null,
          unick: null,
          upwd: null,
          roleid: null,
          super_type: null,
          group_id: null,
          filter: {     //筛选条件
            product: [], //产品id
            region: [] //区域选择
          }
        },
        ruleValidate: {}
      }
    },
    computed: {
      superType() {
        return this.$store.getters.SUPER_TYPE;
      }
    },
    components: {
      Select2
    },
    mounted() {
      this.$nextTick(() => {
        this.listRole()
        this.getUserList();
      });
    },
    methods: {
      listRole() {
        userapi.listRole().then(result => {
          if (result.code && result.code === 200) {
            const roles = result.data.map(item => {
              item.roleid = item.id.toString();
              return item;
            });
            this.roleNames = roles;
          }
        })
      },
      addRegion() {
        this.form.filter.region.push(`${this.selectedCountry},${this.selectedProvince},${this.selectedCity}`);
        this.selectedRegions.push(`${this.selectedCountry},${this.selectedProvince},${this.selectedCity}`);
        this.selectedCountry = '';
        this.selectedProvince = '';
        this.selectedCity = '';
      },
      deleteRegion(index) {
        this.form.filter.region.splice(index, 1);
        this.selectedRegions.splice(index, 1);
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
      getUserList() {
        this.loading = true;
        userapi.getUserList({page: this.pageNo, size: this.pageSize, search: this.search}).then(result => {
          this.loading = false;
          if (result.code && result.code === 200) {
            this.userList = result.data;
            this.total = result.total;
          }
        }).catch(error => {
          this.loading = false;
        });
      },
      queryUser() {
        this.getUserList();
      },
      changePage(pageNo) {
        this.pageNo = pageNo;
        this.queryUser();
      },
      exportMealList() {
        this.$refs.mealTable.exportCsv({
          filename: '套餐信息'
        });
      },
      addUser() {
        if (this.superType === 4) {
          this.$Modal.warning({
                title: '警告',
                content: '' +
                '抱歉，您不能创建用户！'
            });
        }
        this.getProductList();
        this.getRegionList();
        this.listGroup();
        this.modalTitle = '添加用户';
        this.form = {
          id: 0,
          uname: null,
          unick: null,
          upwd: null,
          roleid: null,
          super_type: null,
          group_id: null,
          filter: {     //筛选条件
            "product": [], //产品id
            "region": [] //区域选择
          }
        };
        this.createUserModal = true;
      },
      listGroup() {
        userapi.listGroup().then(result => {
          if (result.data && result.code === 200) {
            this.groupIds = result.data;
          }
        })
      },
      getProductList() {
        getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.productList = result.data;
          }
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            userapi.editUser(this.form).then(result=>{
              console.log(result)
            }).catch(error=>{
              console.log(error)
            });
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      showUserRegion(user) {
      },
      editUser(user) {
        this.modalTitle = '修改用户';
        this.createUserModal = true;
        this.form = user;
      },
      delUser(user) {
        this.$Modal.confirm({
          title: '警告',
          content: '您确定要删除该用户吗？',
          onOk: () => {
            this.$Message.info('Clicked ok');
          },
          onCancel: () => {
            this.$Message.info('Clicked cancel');
          }
        });
      },
      ok() {
      },
      cancel() {
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>
