<style lang="less">
    @import '../../../styles/loading.less';
    @import './text-kefu.less';
</style>

<template>
    <div>
        <Card shadow>
          <!--每日打卡 start-->
          <Col span="24" style="margin-top: 15px;">
            <TimePicker :steps="[0, 5, 60]" type="time" :value="time" @on-change="cgtime" @on-clear="clear" placeholder="每日提醒用户早起时间设置" style="width: 168px"></TimePicker>
          </Col>
          <Button style="margin-top: 15px;" type="primary" @click="change">修改</Button>
        </Card>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'text-editor',
    data () {
        return {
            spinShow: true,
            time: '',
            timemodel: ''
        };
    },
    methods: {
        init () {
            this.spinShow = false;
            var vm = this;
            //添加请求头
            util.ajax.post('/api/clockPunch/cms/runtime/getData', {}).then(res => {
              console.log(res.data);
              if(res.data.time){
                vm.time = res.data.time;
              }
            }).catch(error => {
                if(error){
                  vm.$Message.warning('数据加载失败！');
                }
            });
        },
        change(){
          var vm = this;
          // alert(JSON.stringify(vm.time));
          util.ajax.post('/api/clockPunch/cms/runtime/upload', {
            time: vm.time
          }).then(res => {
            console.log(res.data);
            if(res.data.err_code === 0){
              this.$Message.success('上传成功！');
            }
          }).catch(error => {
              if(error){
                vm.$Message.warning('数据加载失败！');
              }
          });
        },
        cgtime(t){
          this.time = t;
        },
        clear(){
          this.time = -1;
        }
    },
    created () {
        this.init();
    },
    destroyed () {

    }
};
</script>

<style>

</style>
