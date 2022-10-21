<template>
  <div class="settings">
    <p>请先设置监听ip和端口</p>
    <input type="text" placeholder="IP" v-model="ip" />
    <input type="text" placeholder="端口" v-model="port" />
    <button @click="set">设置监听端口</button>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  setup() {
    const data = reactive({
      ip: "",
      port: "",
    });
    const set = () => {
      myApi.set_ip_port(data.ip, data.port);
    };
    return {
      set,
      ...toRefs(data),
    };
  },
};
</script>

<style lang="less" scoped>
.settings {
  padding-left: 70px;
  color: #fff;
  font-size: 20px;
}
</style>
