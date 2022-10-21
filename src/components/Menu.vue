<template>
  <div class="menu">
    <router-link to="/home">List</router-link>
    <router-link to="/attack">攻击</router-link>
    <router-link to="/update" @click="test_update">升级</router-link>
    <router-link to="/settings">设置</router-link>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  setup() {
    const test_update = () => {
      myApi.testupdate("samur", "183.211.120.1");
    };
    return {
      test_update,
    };
  },
};
</script>

<style lang="less" scoped>
.menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 70px;
  height: 100%;
  // background: red;
  border-right: 1px #fff solid;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  a {
    width: 100%;
    height: 59px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    text-decoration: none;
    box-sizing: border-box;
    border: 2px #fff solid;
    color: #fff;
    &.router-link-exact-active {
      color: skyblue;
      border: 2px skyblue solid;
    }
  }
}
</style>
