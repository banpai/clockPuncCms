<style lang="less">
    @import '../../../styles/common.less';
    @import './image-editor.less';
</style>

<template>
    <div class="image-editor">
        <Row :gutter="10">
            <Col span="20">
            <Card>
                <p slot="title">
                    <Icon type="qr-scanner"></Icon>
                    邀请卡背景图
                </p>
                <Row :gutter="10">
                    <Col span="14" class="image-editor-con1">
                    <div class="cropper">
                        <img id="cropimg1" v-bind:src="img1" alt="">
                    </div>
                    </Col>
                    <Col span="10" class="image-editor-con2">
                    <p><b>x:</b>{{ cropdata1.x }}</p>
                    <p><b>y:</b>{{ cropdata1.y }}</p>
                    <p><b>width:</b>{{ cropdata1.w }}</p>
                    <p><b>heigh:</b>{{ cropdata1.h }}</p>
                    <p><b>deg:</b>{{ cropdata1.deg }}</p>
                    <p><b>scaleX:</b>{{ cropdata1.scaleX }}</p>
                    <p><b>scaleY:</b>{{ cropdata1.scaleY }}</p>
                    <div class="margin-top-10" style="text-align: center;">
                        <ButtonGroup>
                            <Button @click="cropper1.rotate(-90)" type="primary"><Icon :size="14" type="arrow-return-left"></Icon></Button>
                            <Button @click="cropper1.rotate(90)" type="primary"><Icon :size="14" type="arrow-return-right"></Icon></Button>
                            <Button @click="cropper1.zoom(0.1)" type="primary"><Icon :size="14" type="plus-round"></Icon></Button>
                            <Button @click="cropper1.zoom(-0.1)" type="primary"><Icon :size="14" type="minus-round"></Icon></Button>
                            <Button @click="cropper1.scaleX(-cropper1.getData().scaleX)" type="primary"><Icon :size="14" type="android-more-horizontal"></Icon></Button>
                            <Button @click="cropper1.scaleY(-cropper1.getData().scaleY)" type="primary"><Icon :size="14" type="android-more-vertical"></Icon></Button>
                        </ButtonGroup>
                    </div>
                    </Col>
                    <Col span="24" class="image-editor-con1">
                    <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                        <div id="preview1"></div>
                    </Row>
                    <div class="image-editor-con1-btn-con margin-top-10">
                        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                        <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                        <span><Button @click="handlecrop1" type="primary" icon="crop">预览</Button></span>
                    </div>
                    <Modal v-model="option1.showCropedImage">
                        <p slot="header">预览裁剪之后的图片</p>
                        <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;">
                    </Modal>
                    </Col>
                    <Col span="24" class="image-editor-con1">
                    <Form class="step-form" ref="step" :model="step" :rules="stepRules" :label-width="100">
                        <!-- <FormItem label="二维码位置:" style="display: none;">
                          <template>
                            <Select v-model="positioan" style="width:200px">
                                <Option v-for="item in positioanArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </template>
                        </FormItem>
                        <FormItem label="二维码大小:" style="display: none;">
                          <template>
                            <Select v-model="size" style="width:200px">
                                <Option v-for="item in sizeArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </template>
                        </FormItem> -->
                        <!--填写输入框 start-->
                        <FormItem label="鸡汤名言：" prop="wellknow">
                            <Input v-model="step.wellknow" type="text" :autosize="{minRows: 2,maxRows: 5}" placeholder="25个字内" />
                        </FormItem>
                        <!--填写输入框 end-->
                        <FormItem label="">
                            <Button :disabled="hasSubmit" @click="handleSubmit" style="width:100px;" type="primary">提交</Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Cropper from 'cropperjs';
    import util from '@/libs/util.js';
    export default {
        name: 'image-editor',
        data() {
            return {
              positioan: 5,
              size: 3,
              img1: '',
              cropper1: {},
              option1: {
                  showCropedImage: false,
                  cropedImg: ''
              },
              cropdata1: {
                  x: '',
                  y: '',
                  w: '',
                  h: '',
                  deg: '',
                  scaleX: '',
                  scaleY: ''
              },
              file: '',
              hasSubmit: false,
              currentStep: 0,
              status: 'wait',
              step: {
                wellknow: ''
              },
              stepRules: {
                  wellknow: [
                      { required: true, message: '请填写鸡汤名言', trigger: 'blur' }
                  ]
              }
            };
        },
        methods: {
            init() {
                var params = {};
                // 初始化数据
                util.ajax.post('/api/clockPunch/cms/ShowCard/getData', params).then(response => {
                    console.log(response.data);
                    this.img1 = response.data.host + response.data.image;
                    this.positioan = response.data.position;
                    this.size = response.data.size;
                    this.step.wellknow = response.data.wellKnow;
                    // this.$Message.success('上传成功！');
                }).catch(error => {
                    this.$Message.warning('初始化数据失败');
                });
            },
            handleSubmit() {
              var vmModel = this;
              this.$refs['step'].validate((valid) => {
                if(valid){
                  if(this.step.wellknow.length > 25){
                    this.$Message.warning('鸡汤名言限定25个字内！');
                  }else {
                    var vm = this;
                    let base64 = false;
                    if(this.cropper1.getCroppedCanvas()){
                      base64 = this.cropper1.getCroppedCanvas().toDataURL();
                    }
                    // console.log(this.cropper1.);
                    let param = {
                        fileVal: base64,
                        positioan: vm.positioan,
                        size: vm.size,
                        wellKnow: vm.step.wellknow
                    };
                    // 添加请求头
                    util.ajax.post('/api/clockPunch/cms/ShowCard/changeData', param)
                        .then(response => {
                            console.log(response.data);
                            this.$Message.success('上传成功！');
                        }).catch(error => {
                            this.$Message.warning('用户名密码错误！');
                        });
                  }
                }
              })
            },
            handleChange1(e) {
                let file = e.target.files[0];
                this.file = file;
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper1.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
                // var fileSize = file.size;
                // var size = fileSize / 1024;
                // console.log(size);
                // if (size > 1000) {
                //     this.$Message.warning('图片不能大于1M！');
                //     return;
                // } else {
                //     this.file = file;
                //     let reader = new FileReader();
                //     reader.onload = () => {
                //         this.cropper1.replace(reader.result);
                //         reader.onload = null;
                //     };
                //     reader.readAsDataURL(file);
                // }
                // alert('ok');
            },
            handlecrop1() {
                let file = this.cropper1.getCroppedCanvas().toDataURL();
                this.option1.cropedImg = file;
                this.option1.showCropedImage = true;
            },
            handlecropsave1() {
                let base64 = this.cropper1.getCroppedCanvas().toDataURL();
                let param = {
                    fileVal: base64
                };
                // //添加请求头
                // util.ajax.post('/api/clockPunch/cms/putImage', param)
                //     .then(response => {
                //         console.log(response.data);
                //         this.$Message.success('上传成功！');
                //     }).then(error => {
                //         this.$Message.warning('用户名密码错误！');
                //     });
            },
            handlerotatel() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.rotate(-30);
                }
            },
            handlerotater() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.rotate(90);
                }
            },
            handlezooml() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.zoom(0.1);
                }
            },
            handlezooms() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.zoom(-0.1);
                }
            },
            handlescalex() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.scaleX(-this.cropper3.getData().scaleX);
                }
            },
            handlescaley() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.scaleY(-this.cropper3.getData().scaleY);
                }
            },
            handleChange3(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper3.replace(reader.result, true); // 这里必须设置true这个参数，否则旋转会有bug
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlemovel() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(-10, 0);
                }
            },
            handlemover() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(10, 0);
                }
            },
            handlemoveu() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(0, -10);
                }
            },
            handlemoved() {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(0, 10);
                }
            },
            handlecrop3() {
                let file = this.cropper3.getCroppedCanvas().toDataURL();
                this.option3.cropedImg = file;
                this.option3.showCropedImage = true;
            }
        },
        mounted() {
            this.init();
            let img1 = document.getElementById('cropimg1');
            this.cropper1 = new Cropper(img1, {
                dragMode: 'move',
                preview: '#preview1',
                restore: false,
                autoCrop: true,
                center: false,
                highlight: false,
                // minCropBoxWidth: 1000,
                // maxCropBoxWidth: 10,
                cropBoxMovable: false,
                // cropBoxResizable : false,
                toggleDragModeOnDblclick: false
            });
            img1.addEventListener('crop', (e) => {
                this.cropdata1.x = parseInt(e.detail.x);
                this.cropdata1.y = parseInt(e.detail.y);
                this.cropdata1.w = parseInt(e.detail.width);
                this.cropdata1.h = parseInt(e.detail.height);
                this.cropdata1.deg = parseInt(e.detail.rotate);
                this.cropdata1.scaleX = parseInt(e.detail.scaleX);
                this.cropdata1.scaleY = parseInt(e.detail.scaleY);
            });
            // let img2 = document.getElementById('cropimg2');
            // this.cropper2 = new Cropper(img2, {
            //     dragMode: 'move',
            //     restore: false,
            //     center: false,
            //     highlight: false,
            //     cropBoxMovable: false,
            //     toggleDragModeOnDblclick: false
            // });
            // img2.addEventListener('crop', (e) => {
            //     this.cropdata2.x = parseInt(e.detail.x);
            //     this.cropdata2.y = parseInt(e.detail.y);
            //     this.cropdata2.w = parseInt(e.detail.width);
            //     this.cropdata2.h = parseInt(e.detail.height);
            //     this.cropdata2.deg = parseInt(e.detail.rotate);
            //     this.cropdata2.scaleX = parseInt(e.detail.scaleX);
            //     this.cropdata2.scaleY = parseInt(e.detail.scaleY);
            // });
        }
    };
</script>

<style>

</style>
