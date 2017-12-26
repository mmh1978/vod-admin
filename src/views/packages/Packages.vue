<template>
  <div class="packages-container">
    <Tabs value="name1">
      <TabPane label="套餐信息" name="name1">
        <meal-info></meal-info>
      </TabPane>
      <TabPane label="用户套餐管理" name="name2">
        <user-meal></user-meal>
      </TabPane>
      <TabPane label="激活码管理" name="name3">
        <activation-code></activation-code>
      </TabPane>
      <TabPane label="交易记录查询" name="name4">
        <trade-record></trade-record>
      </TabPane>
    </Tabs>
    
  </div>
</template>
<script>
  import {saveAs} from 'file-saver'

  import MealInfo from './MealInfo.vue'
  import UserMeal from './UserMeal.vue'
  import ActivationCode from './ActivationCode.vue'
  import TradeRecord from './TradeRecord.vue'

  export default {
    data() {
      return {
        searchKey: '',
        cityList: [
          {
            value: 'beijing',
            label: '北京市'
          },
          {
            value: 'shanghai',
            label: '上海市'
          },
          {
            value: 'shenzhen',
            label: '深圳市'
          },
          {
            value: 'hangzhou',
            label: '杭州市'
          },
          {
            value: 'nanjing',
            label: '南京市'
          },
          {
            value: 'chongqing',
            label: '重庆市'
          }
        ],
        model1: '',
        model2: '',
        columns1: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data1: [
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
          }
        ],
        tableData1: this.mockTableData1(),
        tableColumns1: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const row = params.row;
              const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red';
              const text = row.status === 1 ? '构建中' : row.status === 2 ? '构建完成' : '构建失败';

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '画像内容',
            key: 'portrayal',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: params.row.portrayal.length + '个画像',
                  placement: 'bottom'
                }
              }, [
                h('Tag', params.row.portrayal.length),
                h('div', {
                  slot: 'content'
                }, [
                  h('ul', this.tableData1[params.index].portrayal.map(item => {
                    return h('li', {
                      style: {
                        textAlign: 'center',
                        padding: '4px'
                      }
                    }, item)
                  }))
                ])
              ]);
            }
          },
          {
            title: '选定人群数',
            key: 'people',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: params.row.people.length + '个客群',
                  placement: 'bottom'
                }
              }, [
                h('Tag', params.row.people.length),
                h('div', {
                  slot: 'content'
                }, [
                  h('ul', this.tableData1[params.index].people.map(item => {
                    return h('li', {
                      style: {
                        textAlign: 'center',
                        padding: '4px'
                      }
                    }, item.n + '：' + item.c + '人')
                  }))
                ])
              ]);
            }
          },
          {
            title: '取样时段',
            key: 'time',
            render: (h, params) => {
              return h('div', '近' + params.row.time + '天');
            }
          },
          {
            title: '更新时间',
            key: 'update',
            render: (h, params) => {
              return h('div', this.formatDate(this.tableData1[params.index].update));
            }
          }
        ]
      }
    },
    components: {
      MealInfo,
      UserMeal,
      ActivationCode,
      TradeRecord
    },
    methods: {
      mockTableData1() {
        let data = [];
        for (let i = 0; i < 10; i++) {
          data.push({
            name: '商圈' + Math.floor(Math.random() * 100 + 1),
            status: Math.floor(Math.random() * 3 + 1),
            portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
            people: [
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              },
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              },
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              }
            ],
            time: Math.floor(Math.random() * 7 + 1),
            update: new Date()
          })
        }
        return data;
      },
      formatDate(date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      changePage() {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.tableData1 = this.mockTableData1();
      },
      exportCDKey() {
//        let blob = new Blob(['hello,world'], {type: 'text'});
//        saveAs(blob, 'hello.txt');
        this.$refs.CDKeyTable.exportCsv({
          filename: '激活码'
        });
      },
      
    }
  }
</script>
<style lang="scss" scoped>
  .packages-container {
    padding: 10px 10px 0 20px;
  }
</style>