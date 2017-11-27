<style lang="less">
    @import '../../../styles/loading.less';
    @import '../../../styles/common.less';
    @import './image-editor.less';
</style>

<template>
    <div>
      <Card>
          <p slot="title">
              <Icon type="ios-analytics"></Icon>
              更换客服的头像
          </p>
          <div style="height: 100px;">
              <Col span="8">
                  <Card>
                      <Upload
                          ref="upload"
                          :show-upload-list="false"
                          :default-file-list="defaultList"
                          :on-success="handleSuccess2"
                          :format="['jpg','jpeg','png']"
                          :max-size="1024"
                          :on-format-error="handleFormatError2"
                          :on-exceeded-size="handleMaxSize"
                          :before-upload="handleBeforeUpload2"
                          multiple
                          type="drag"
                          :action="uploadUrl"
                          style="display: inline-block;width:58px;">
                          <div style="width: 58px;height:58px;line-height: 58px;">
                              <Icon type="camera" size="20"></Icon>
                          </div>
                      </Upload>
                      <Modal title="查看图片" v-model="visible">
                          <img :src="imgName" v-if="visible" style="width: 100%">
                      </Modal>
                  </Card>
              </Col>
              <Col span="16" class="padding-left-10">
                <Card>
                    <div style="height: 65px;">
                        <div class="admin-upload-list" v-for="item in uploadList" :key="item.url">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="admin-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                    </div>
                </Card>
              </Col>
          </div>
      </Card>
      <Spin fix v-if="spinShow">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载组件中...</div>
      </Spin>
    </div>
</template>

<script>
import tinymce from 'tinymce';
import util from '@/libs/util.js';
export default {
    name: 'text-editor',
    data () {
        return {
          host: '',
          uploadUrl: '',
          image: '',
          spinShow: false,
            stepList1: [],
            stepData: {
                title: '',
                describe: '',
                content: ''
            },
            step: {
                opinion: '',
                remark: ''
            },
            stepRules: {
                opinion: [{
                    required: true,
                    message: '请输入天数',
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入标题内容',
                    trigger: 'blur'
                }]
            },
            hasSubmit: false,
            currentStep: 0,
            status: 'wait',
            defaultList: [],
            imgName: '',
            visible: false,
            uploadList: []
        };
    },
    methods: {
        init () {
          var vm = this;
          this.host = util.ajaxUrl;
          this.uploadUrl = util.ajaxUrl + '/api/clockPunch/cms/uploadKefuImg';
          console.log(util.ajaxUrl);
          //添加请求头
          util.ajax.post('/api/clockPunch/cms/getKefuData', {}).then(res => {
            console.log(res.data);
            if(res.data){
              if(res.data.image){
                var datapic = {
                  url: (util.ajaxUrl + res.data.image),
                  name: res.data.image,
                  status: 'finished'
                };
                // alert(JSON.stringify(datapic));
                vm.uploadList.push(datapic);
              }
            }
          }).catch(error => {
              if(error){
                vm.$Message.warning('数据加载失败！');
              }
          });
        },
        handleSubmit () {
          // 获取数据并且上传
          var vm = this;
          this.$refs['step'].validate((valid) => {
              if (valid) {
                  // console.log(this.cropper1.);
                  var image = false;
                  // alert(vm.defaultList);
                  if(vm.uploadList[0]){
                    image = vm.uploadList[0].name;
                  }
                  let param = {
                      content: tinymce.get('tinymceEditer').getContent(),
                      title: vm.step.opinion,
                      subtitle: vm.step.remark,
                      image: image
                  };
                  // alert(JSON.stringify(param))
                  //添加请求头
                  util.ajax.post('/api/clockPunch/cms/putProgectData', param)
                      .then(response => {
                          console.log(response.data);
                          this.$Message.success('上传成功！');
                      }).catch(error => {
                          this.$Message.warning('用户名密码错误！');
                      });
              }
          });
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            });
        },
        handleBeforeUpload (file) {
            this.$Notice.warning({
                title: '文件准备上传',
                desc: '文件 ' + file.name + ' 准备上传。'
            });
        },
        handleProgress (event, file) {
            this.$Notice.info({
                title: '文件正在上传',
                desc: '文件 ' + file.name + ' 正在上传。'
            });
        },
        handleSuccess (evnet, file) {
            this.$Notice.success({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传成功。'
            });
        },
        handleError (event, file) {
            this.$Notice.error({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传失败。'
            });
        },
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess2 (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
            console.log(res);
            console.log(file);
            if (res.url) {
              file.url = (util.ajaxUrl + res.url);
              file.name = res.url;
            }
        },
        handleFormatError2 (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 1M。'
            });
        },
        handleBeforeUpload2 () {
            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 1 张图片。'
                });
            }
            return check;
        }
    },
    created () {
        this.init();
    },
    destroyed () {
        tinymce.get('tinymceEditer').destroy();
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
};
</script>

<style>

</style>
