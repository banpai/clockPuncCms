<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Card>
                <h4 slot="title">
                    <Icon type="android-archive"></Icon>
                    用户信息表
                </h4>
                <Row>
                    <Col span="18">
                    <Table :columns="excelColumns" height="390px" :data="data" size="small" ref="tableExcel"></Table>
                    </Col>
                    <Col span='6' class="padding-left-10">
                    <!--查询数据 start-->
                    <div class="margin-top-10 margin-left-10">
                        <Input placeholder="搜姓名或国籍或省份或城市…" style="width: 190px" v-model="searchName" />
                    </div>
                    <!--查询时间 start-->
                    <div class="margin-top-10 margin-left-10">
                        <DatePicker type="daterange" placement="bottom-end" placeholder="选择日期范围搜搜…" style="width: 190px" @on-change="dateChange" @on-clear="clearDate"></DatePicker>
                    </div>
                    <!--查询时间 end-->
                    <div class="margin-left-10 margin-top-20">
                        <span><Button type="primary" icon="search" @click="search">搜索</Button></span>
                    </div>
                    <!--查询数据 end-->
                    <!--下载表格 start-->
                    <div class="margin-top-10 margin-left-10">
                        <Input v-model="excelFileName" icon="document" placeholder="请输入文件名" style="width: 190px" />
                    </div>
                    <div class="margin-left-10 margin-top-20">
                        <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                        <Button type="primary" size="large" @click="exportExcel">下载表格数据</Button>
                    </div>
                    <!--下载表格 end-->
                    </Col>
                </Row>
                <div style="height: 30px;"></div>
                <!--分页的页数 start-->
                <template>
        <Page :total="total" @on-change="page"></Page>
</template>
<!--分页的页数 end-->
</Card>
</Row>
</div>
</template>

<script>
    import util from '@/libs/util.js';
    import table2excel from '@/libs/table2excel.js';
    export default {
        name: 'exportable-table',
        data() {
            return {
                data: [],
                excelColumns: [{
                        title: '昵称',
                        key: 'nickname',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.nickname)
                            ]);
                        }
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        render: (h, params) => {
                            var sexName = '男';
                            if (params.row.sex == 0) {
                                sexName = '女';
                            }
                            return h('div', [
                                h('strong', sexName)
                            ]);
                        }
                    },
                    {
                        title: '国籍',
                        key: 'country'
                    },
                    {
                        title: '省份',
                        key: 'province'
                    },
                    {
                        title: '城市',
                        key: 'city'
                    },
                    {
                        title: '加入日期',
                        key: 'createTime',
                        render: (h, params) => {
                            var createTime = params.row.createTime.substring(0, 10);
                            return h('div', [
                                h('strong', createTime)
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let query = {
                                                punchOpenid: params.row.openid,
                                                nickname: params.row.nickname 
                                            };
                                            util.openNewPage(this, 'punch', undefined, query);
                                            this.$router.push({
                                                name: 'punch',
                                                query: query
                                            });
                                        }
                                    }
                                }, '打卡记录'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let query = {
                                                friendsOpenid: params.row.openid,
                                                nickname: params.row.nickname
                                            };
                                            util.openNewPage(this, 'friends', undefined, query);
                                            this.$router.push({
                                                name: 'friends',
                                                query: query
                                            });
                                        }
                                    }
                                }, '好友')
                            ]);
                        }
                    }
                ],
                selectMinCol: 1,
                maxRow: 0,
                minRow: 1,
                maxCol: 0,
                minCol: 1,
                excelFileName: '',
                tableExcel: {},
                fontSize: 16,
                total: 0,
                data: [],
                startDate: '',
                endDate: '',
                searchName: ''
            };
        },
        methods: {
            exportExcel() {
                table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
            },
            // 初始化数据
            init(data) {
                // 初始化数据
                util.ajax.post('/api/clockPunch/cms/ShowData/getMembers', data).then(response => {
                    console.log(response.data);
                    this.total = response.data.total;
                    this.data = response.data.data;
                }).catch(error => {
                    this.$Message.warning('初始化数据失败');
                });
            },
            page(p) {
                // alert(p);
                var vm = this;
                var params = {
                    current_page: p,
                    startDate: vm.startDate,
                    endDate: vm.endDate,
                    searchName: vm.searchName
                };
                this.init(params);
            },
            // 时间改变
            dateChange(e) {
                this.startDate = e[0];
                this.endDate = e[1];
            },
            // 清除时间
            clearDate() {
                this.startDate = '';
                this.endDate = '';
            },
            // 搜索数据
            search() {
                // alert(p);
                var vm = this;
                var params = {
                    current_page: 1,
                    startDate: vm.startDate,
                    endDate: vm.endDate,
                    searchName: vm.searchName
                };
                this.init(params);
            }
        },
        mounted() {
            var vm = this;
            var params = {
                current_page: 1,
                startDate: vm.startDate,
                endDate: vm.endDate,
                searchName: vm.searchName
            };
            this.init(params);
        }
    };
</script>