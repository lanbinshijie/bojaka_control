<template>
  <div class="gmlist">
    <p class="cur" style="color: #fff">
      当前选择: user:{{ thisuser_name }} ip:{{ thisuser_ip }}
    </p>
    <el-table
      :data="userList"
      style="width: 100%"
      height="250"
      @row-click="selet"
    >
      <el-table-column fixed type="index" />
      <el-table-column prop="userinfo.username" label="用户名" />
      <el-table-column prop="userinfo.ip" label="IP" />
      <el-table-column prop="userinfo.system" label="系统" />
      <el-table-column prop="userinfo.address" label="地址" />
      <el-table-column prop="userinfo.v" label="版本" />
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import bus from "@/utils/bus.js";
export default {
  setup() {
    const data = reactive({
      userList: [],
      thisuser_ip: "",
      thisuser_name: "",
    });

    setInterval(() => {
      // console.log(myApi.get_userlist());
      data.userList = myApi.get_userlist();
    }, 1000);
    const selet = (row) => {
      data.thisuser_ip = row.userinfo.ip;
      data.thisuser_name = row.userinfo.username;
      bus.emit("seuser", { user: data.thisuser_name, ip: data.thisuser_ip });
    };

    return {
      ...toRefs(data),
      selet,
    };
  },
};
</script>

<style lang="less" scoped>
.gmlist {
  height: 50%;
  box-sizing: border-box;
  .cur {
    height: 40px;
  }
}
// ele样式覆盖
/deep/.el-table {
  background-color: #333 !important;
  border-top: 1px #fff solid;
  // background: red !important;
  height: calc(100%) !important;
}

/deep/.el-table__inner-wrapper {
  height: calc(100%) !important;
}
/deep/.el-table .cell {
  color: #fff !important;
  background: #333 !important;
}

/deep/.el-table.is-scrolling-none th.el-table-fixed-column--left,
.el-table.is-scrolling-none th.el-table-fixed-column--right {
  background: #333 !important;
}
/deep/.el-table:not(.el-table--border) .el-table__cell {
  background: #333 !important;
}
</style>
