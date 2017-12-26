<template>
    <div>
        <Row class="search-area">
            <Col span="8">
            <Button type="primary" @click="addRole">新增</Button>
            </Col>
        </Row>
        <Card>
            <p slot="title">
                详情明细
            </p>
            <a href="#" slot="extra" @click.prevent="exportRoleList">
                <Icon type="android-open"></Icon>
                导出
            </a>
            <Table ref="roleTable" :loading="loading" :data="roleList" :columns="roleColumns" stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageNo" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <Modal
                v-model="createRoleModal"
                :title="modalTitle"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
                <FormItem label="角色名称">
                    <Input v-model="form.role_name" placeholder="请输入角色名称"></Input>
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
  import {listRole, editRole} from '../../api/userApi'

  export default {
    data() {
      return {
        loading: false,
        createRoleModal: false,
        modalTitle: '新增角色',
        ruleValidate: {},
        total: 0,
        pageNo: 0,
        roleList: [],
        roleColumns: [
          {title: 'ID', key: 'id'},
          {title: '角色名称', key: 'role_name'},
          {title: '时间', key: 'intime'}
        ],
        form: {
          state: null,
          role_name: null,
          super_type: null,
          op_type: null,
          mark_id: null
        }
      }
    },
    mounted() {
      this.listRole();
    },
    methods: {
      listRole() {
        listRole().then(result => {
          if (result.code && result.code === 200) {
            this.roleList = result.data;
            this.total = 10;
          }
        })
      },
      addRole() {
        this.form = {
          state: null,
          role_name: null,
          super_type: null,
          op_type: null,
          mark_id: null
        };
        this.createRoleModal = true;
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            editRole(this.form).then(result => {
              console.log(result)
            }).catch(error => {
              console.log(error)
            });
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      changePage() {
      },
      exportRoleList() {
      },
      ok() {
      },
      cancel() {
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import '../../style/common';
</style>