<template>
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="120">
        <FormItem label="产品" prop="product">
            <Select v-model="form.selectedProd">
                <Option v-for="item in form.productList" :value="item.id" :key="item.id">{{ item.product_name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="产品组名称" prop="productName">
            <Input v-model="form.productName" placeholder="请输入产品组名称"></Input>
        </FormItem>
        <FormItem label="MAC地址" prop="selectedMac">
            <select2 :options="form.macOptions" v-model="form.selectedMac">
                <option disabled value="0">请选择</option>
            </select2>
        </FormItem>
        <FormItem label="歌曲ID" prop="selectedSongId">
            <select2 :options="form.songOptions" v-model="form.selectedSongId">
                <option disabled value="0">请选择</option>
            </select2>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('form')">提交</Button>
        </FormItem>
    </Form>
</template>
<script>
  import Select2 from '../components/Select2.vue'
  import {getProductList} from '../../api/commonApi'

  export default {
    data() {
      return {
        form: {
          selectedProd: '',
          productList: [],
          product: '',
          productName: '',
          selectedMac: 1,
          macOptions: [
            {id: 1, text: 'Hello'},
            {id: 2, text: 'World'}
          ],
          selectedSongId: 1,
          songOptions: [
            {id: 1, text: 'Hello'},
            {id: 2, text: 'World'}
          ],
        },
        ruleValidate: {
          product: [
            {required: true, message: '请选择产品', trigger: 'change'}
          ],
          productName: [
            {required: true, message: '请输入产品组名', trigger: 'blur'}
          ],
          selectedMac: [
            {required: true, message: '请输入mac地址', trigger: 'blur'}
          ],
          selectedSongId: [
            {required: true, message: '请输入歌曲ID', trigger: 'blur'}
          ],
        }
      }
    },
    components: {
      Select2
    },
    mounted() {
      this.getProductList();
    },
    methods: {
      getProductList() {
        getProductList().then(result => {
          if (result.code && result.code === 200) {
            this.form.productList = result.data;
          }
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
  }
</script>
