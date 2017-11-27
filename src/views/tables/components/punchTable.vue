<style lang="less" scoped>
  @import "../../../styles/common.less";
  @import "./../components/table.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Card>
        <h4 slot="title">
          <Icon type="android-archive"></Icon>
          打卡记录表
        </h4>
        <Row>
          <Col span="18">
          <Table :columns="excelColumns" height="390px" :data="data" size="small" ref="tableExcel"></Table>
          </Col>
          <Col span='6' class="padding-left-10">
          <!--查询数据 start-->
          <div class="margin-top-10 margin-left-10" style="display: none;">
            <Input placeholder="搜姓名或国籍或省份或城市…" style="width: 190px" v-model="searchName" />
          </div>
          <!--查询时间 start-->
          <div class="margin-top-10 margin-left-10">
            <TimePicker @on-change="timeChange" @on-clear="clearTime" format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="选择时间范围搜搜…" style="width: 190px"></TimePicker>
          </div>
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
  import util from "@/libs/util.js";
  import table2excel from "@/libs/table2excel.js";
  export default {
    name: "exportable-table",
    data() {
      return {
        data: [],
        time: [],
        excelColumns: [{
            title: "昵称",
            key: "nickname",
            render: (h, params) => {
              var nickname = this.nickname;
              return h("div", [
                h("Icon", {
                  props: {
                    type: "person"
                  }
                }),
                h("strong", nickname)
              ]);
            }
          },
          {
            title: "打卡时间",
            key: "punchTime"
          },
          {
            title: "打卡日期",
            key: "punchDate",
            width: 150
          }
        ],
        selectMinCol: 1,
        maxRow: 0,
        minRow: 1,
        maxCol: 0,
        minCol: 1,
        excelFileName: "",
        tableExcel: {},
        fontSize: 16,
        total: 0,
        data: [],
        startDate: "",
        endDate: "",
        searchName: "",
        nickname: ""
      };
    },
    methods: {
      exportExcel() {
        table2excel.transform(
          this.$refs.tableExcel,
          "hrefToExportTable",
          this.excelFileName
        );
      },
      // 初始化数据初始化数据
      init(data) {
        // 初始化数据
        util.ajax
          .post("/api/clockPunch/cms/ShowData/getPunchDate", data)
          .then(response => {
            console.log(response.data);
            this.total = response.data.total;
            this.data = response.data.data;
          }).catch(error => {
            this.$Message.warning('初始化数据失败');
          });
      },
      /**
       * 加载数据的封装 
       */
      doDate(p) {
        var current_page = 1;
        if (p) {
          current_page = p;
        }
        var vm = this;
        if (this.$route.query.nickname) {
          this.nickname = this.$route.query.nickname;
        }
        // alert(this.$route.query.nickname);
        var openid = "";
        if (this.$route.query.punchOpenid) {
          openid = this.$route.query.punchOpenid;
        }
        var params = {
          current_page: current_page,
          openid: openid,
          startDate: vm.startDate,
          endDate: vm.endDate,
          startTime: vm.time[0],
          endTime: vm.time[1],
          searchName: vm.searchName
        };
        return Promise.resolve(params)
      },
      page(p) {
        this.doDate(p).then(params => {
          this.init(params);
        })
      },
      // 时间改变
      dateChange(e) {
        this.startDate = e[0];
        this.endDate = e[1];
      },
      // 修改时间啊
      timeChange(e) {
        this.time = e;
      },
      // 清除时间
      clearDate() {
        this.startDate = "";
        this.endDate = "";
      },
      clearTime() {
        this.time = [];
      },
      // 搜索数据
      search() {
        this.doDate().then(params => {
          this.init(params);
        })
      }
    },
    mounted() {
      this.doDate().then(params => {
        this.init(params);
      })
    },
    watch: {
      '$route' () {
        if (this.$route.query.punchOpenid && this.$route.query.nickname) {
          this.doDate().then(params => {
            this.init(params);
          })
        }
      }
    }
  };
</script>