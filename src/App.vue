<template>
  <Menu />

  <!-- <router-view></router-view> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script>
import Menu from "@/components/Menu.vue";
export default {
  components: {
    Menu,
  },
  setup() {},
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #333;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
