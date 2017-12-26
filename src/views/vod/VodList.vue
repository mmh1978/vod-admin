<template>
    <div class="wrapper-page">
        <Row class="search-area">
            <Col span="3">
            <Select v-model="selectedProd">
                <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
            </Col>
            <!--<Col span="2">-->
            <!--<Select v-model="selectedCountry" @on-change="getProvinces">-->
                <!--<Option v-for="item in countries" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="2">-->
            <!--<Select v-model="selectedProvince" @on-change="getCities">-->
                <!--<Option v-for="item in provinces" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="2">-->
            <!--<Select v-model="selectedCity">-->
                <!--<Option v-for="item in cities" :value="item.region_id" :key="item.region_id">{{ item.region_name }}-->
                <!--</Option>-->
            <!--</Select>-->
            <!--</Col>-->
            <!--<Col span="5">-->
            <!--<DatePicker type="daterange" :options="options1" placement="bottom-end" placeholder="选择日期"-->
                        <!--:value="timeslot" @on-change="handleTime" format="yyyy-MM-dd"-->
                        <!--style="width: 200px;"></DatePicker>-->
            <!--</Col>-->
            <Col span="6">
            <Button type="success" @click="queryVod">查询</Button>
            </Col>
        </Row>
        <Row class="operation-area">
            <Col span="10">
            <Button type="success" @click="inputVod">输入VOD信息</Button>
            <Button type="success" @click="importVod">导入VOD信息</Button>
            <Button type="success" @click="createGroup">创建产品组</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <a href="#" slot="extra" @click.prevent="exportVodList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table ref="vodTable" :loading="loading" :data="vodList" :columns="vodColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal v-model="inputVodShow" title="输入VOD">
            <input-vod-modal></input-vod-modal>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="importVodShow" title="导入VOD">
            <import-vod-modal></import-vod-modal>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="createGroupShow" title="创建分组">
            <create-group-modal></create-group-modal>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="editVodShow" title="VOD信息" width="80" :styles="{top: '10px'}">
            <vod-info :vodinfo="selectedVod"></vod-info>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="editAreaShow" title="VOD授权设置">
            <stb-area :stb="selectedVod"></stb-area>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  import InputVodModal from './InputVodModal.vue'
  import ImportVodModal from './ImportVodModal.vue'
  import CreateGroupModal from './CreateGroupModal.vue'
  import VodInfo from './VodInfo.vue'
  import StbArea from './StbArea.vue'
  import {getProductList, getRegionList} from '../../api/commonApi'
  import * as api from '../../api/vodApi'


  export default {
    
    data() {
      return {
        loading: false,
        inputVodShow: false,
        importVodShow: false,
        createGroupShow: false,
        editVodShow: false,
        editAreaShow: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
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
        selectedVod: "",
        vodList: [],
        vodColumns: [
          {title: 'MAC', key: 'vod_umac', width: 120},
          {title: '产品', key: 'vod_product_name', width: 120},
          {title: '软件版本', key: 'vod_app_ver' , width: 90},
          {
            title: '歌曲版本', key: 'vod_media_ver', width: 90
          },
          {title: '剩余空间', key: 'vod_disk_space', width: 90},
          {title: '歌曲数量', key: 'vod_song_count', width: 90},
          {title: '授权区域', key: 'auth_info' , width: 140},
          {title: '使用区域', key: 'use_info', width: 140},
          {title: '登陆IP', key: 'login_ip', width: 140},
          {
            title: '操作', render: (h, params) => {
            return [h('Button', {
              on: {
                click: () => {
                  this.editVod(params.row);
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
                  this.editArea(params.row);
                }
              },
              props: {
                type: 'primary',
                shape: 'circle',
                size: 'small'
              }
            }, '授权'),
            ];
          }
          }
        ],
        timeslot: '',
        options1: {
          shortcuts: [
            {
              text: '最近一周',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '最近一个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '最近三个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            }
          ]
        }
      }
    },
    components: {
      InputVodModal,
      ImportVodModal,
      CreateGroupModal,
      VodInfo,
      StbArea
    },
    mounted() {
      this.getProductList();
      this.getRegionList();
      this.queryVod();
    },
    methods: {
      handleTime(time) {
        this.timeslot = time;
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
      queryVod() {
        this.loading = true;
        api.getVodList({page: this.pageno, size: this.pageSize, search:""}).then(result => {
        this.loading = false;          
          if (result.code && result.code === 200) {
            this.vodList = result.data;
            this.total = result.total;
          }
        })
      },
      changePage(pageNo) {
        this.pageno = pageNo;
        this.queryVod();
      },
      exportVodList() {
      },
      inputVod() {
        this.inputVodShow = true;
      },
      importVod() {
        this.importVodShow = true;
      },
      createGroup() {
        this.createGroupShow = true;
      },
      editVod(vod) {
        this.editVodShow = true;
        this.selectedVod = JSON.parse(JSON.stringify(vod));
      },
      editArea(vod) {
        this.editAreaShow = true;
        this.selectedVod = JSON.parse(JSON.stringify(vod.stbarea));
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>