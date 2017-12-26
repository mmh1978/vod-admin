<template>
    <div>
        <Card>
            <Form ref="form" inline>
                <Row>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_product_name" placeholder="产品" disabled>
                        <span slot="prepend">产品</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_umac" placeholder="MAC" disabled>
                        <span slot="prepend">MAC</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_media_ver" placeholder="歌曲版本" disabled>
                        <span slot="prepend">歌库版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_app_ver" placeholder="软件版本" disabled>
                        <span slot="prepend">软件版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_disk_size" placeholder="总空间" disabled>
                        <span slot="prepend">总空间</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_disk_space" placeholder="剩余空间" disabled>
                        <span slot="prepend">剩余空间</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_color"></i-switch>
                        <span class="span">点歌颜色</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_room_open" placeholder="开台">
                        <span slot="prepend">开台</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_SuperAuthorityStatus"></i-switch>
                        <span  class="span">超级权限状态</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_user_super_pwd" :disabled="super_status" placeholder="用户超级密码">
                        <span slot="prepend">用户超级密码</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_super_pwd_date"  :disabled="super_status" placeholder="超级权限截止日期">
                        <span slot="prepend">超级权限截止日期</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_superpwd_hour"  :disabled="super_status" placeholder="超级权限离线时间">
                        <span slot="prepend">超级权限离线时间</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_tvview_status"></i-switch>
                        <span  class="span">使用遥控器</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_shut_record"></i-switch>
                        <span  class="span">记录关机</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_view_pwd"></i-switch>
                        <span  class="span">密码锁状态</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_score_status"></i-switch>
                        <span  class="span">打分开关</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_wechat_status"></i-switch>
                        <span class="span">微信开关</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_tuning"></i-switch>
                        <span class="span">调音设置</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_center_control"></i-switch>
                        <span class="span">中控状态</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_table_state"></i-switch>
                        <span class="span">桌号</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_carrousel_play"></i-switch>
                        <span class="span">轮播状态</span>
                        </Input>
                    </FormItem>
                    </Col>
                    
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_room_status"></i-switch>
                        <span class="span">房台功能开关</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_room_close"></i-switch>
                        <span class="span">关台</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <i-switch v-model="vodinfo.vod_shout_down"></i-switch>
                        <span  class="span">关机</span>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_SongStyle" placeholder="点歌方式">
                        <span slot="prepend">点歌方式</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_user_pwd" placeholder="密码锁密码">
                        <span slot="prepend">密码锁密码</span>
                        </Input>
                    </FormItem>
                    </Col>
                     <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_superpwd_offlinehour" placeholder="本地可用时间">
                        <span slot="prepend">本地可用时间</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.login_ip" placeholder="IP地址" disabled>
                        <span slot="prepend">IP地址</span>
                        </Input>
                    </FormItem>
                    </Col> 
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_table_limit" placeholder="桌号歌曲数量">
                        <span slot="prepend">桌号歌曲数量</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_user_city" placeholder="用户所在城市">
                        <span slot="prepend">状态</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_language" placeholder="语言" disabled>
                        <span slot="prepend">语言</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_resolution" placeholder="分辨率" disabled>
                        <span slot="prepend">分辨率</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_zoom_x" placeholder="缩放X" disabled>
                        <span slot="prepend">缩放X</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_zoom_y" placeholder="缩放Y" disabled>
                        <span slot="prepend">缩放y</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_offset_x" placeholder="偏移量X" disabled>
                        <span slot="prepend">偏移量X</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_offset_y" placeholder="偏移量Y" disabled>
                        <span slot="prepend">偏移量Y</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_theme_ver" placeholder="主题版本" disabled>
                        <span slot="prepend">主题版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_rank_ver" placeholder="榜单版本" disabled>
                        <span slot="prepend">榜单版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_push_ver" placeholder="图片版本" disabled>
                        <span slot="prepend">图片版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_picture_ver" placeholder="图片版本" disabled>
                        <span slot="prepend">图片版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_carrousel_ad_ver" placeholder="广告版本" disabled>
                        <span slot="prepend">图片版本</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_carrousel_volume" placeholder="轮播音量">
                        <span slot="prepend">轮播音量</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_singing_volume" placeholder="已选音量">
                        <span slot="prepend">已选音量</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_mic_volume" placeholder="麦克风音量">
                        <span slot="prepend">麦克风音量</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_room_add" placeholder="续台">
                        <span slot="prepend">续台</span>
                        </Input>
                    </FormItem>
                    </Col>
                    
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_umac" placeholder="密码锁的密码">
                        <span slot="prepend">密码锁的密码</span>
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                        <Input v-model="vodinfo.vod_umac" placeholder="超级密码时间">
                        <span slot="prepend">超级密码时间</span>
                        </Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    
                </Row>
            </Form>
            <div style="text-align: center">
                <Button type="success" @click="handleSubmit('form')">保存</Button>
            </div>
        </Card>
    </div>
</template>
<script>
    import {editVodUser} from '../../api/vodApi'

  export default {
    props: {
        vodinfo: ""
    },
    data(){
        return{
            super_status:false
        }
    },
    methods: {
      handleSubmit(name) {
//        this.$refs[name].validate((valid) => {
//          if (valid) {
            editVodUser(this.vodinfo).then(result => {
              if (result.ret && result.ret === 1) {
                this.$Message.success('修改成功!');
              } else {
                this.$Message.error('修改失败！')
              }
            }).catch(error => {
              this.$Message.error(error.msg);
            });
//          } else {
//            this.$Message.error('Fail!');
//          }
//        })
      }
    },
    watch: {
        'vodinfo.vod_SuperAuthorityStatus':function(val, oldVal){
            if(val){
                this.super_status=false;
            }else{ 
                this.super_status=true;
            }
        }
    }
  }
</script>
<style lang="scss" scoped>
   .ivu-form-item{
       width: 210px;
   }
   .span{
       margin-left: 20px;
   }
</style>