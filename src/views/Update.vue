<template>
  <div class="update">
    <h2>升级_注意是全部升级</h2>
    <el-radio-group v-model="up_type">
      <el-radio label="default" size="large">直链模式_提供直链</el-radio>
      <el-radio label="lanzouyun" size="large"
        >蓝奏云模式_提供蓝奏云链接</el-radio
      >
    </el-radio-group>
    <el-input v-model="url" placeholder="新版本链接" />
    <el-button type="success" @click="update_btn">下达升级命令</el-button>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  setup() {
    const data = reactive({
      up_type: "",
      url: "",
      url1: "",
    });
    const update_btn = () => {
      myApi.update(data.up_type, data.url);
    };
    return {
      ...toRefs(data),
      update_btn,
    };
  },
};
</script>

<style lang="less" scoped>
.update {
  padding-left: 70px;
  height: 100%;
  // background: red;
  color: #fff;
}
.el-radio {
  color: #fff;
}
.el-button {
  margin-top: 50px;
}
</style>
