<template>
  <div class="home">
    <Tools />
    <Gmlist />
    <SendBox />
  </div>
</template>

<script>
import Tools from "@/components/Tools.vue";
import Gmlist from "@/components/Gmlist.vue";
import SendBox from "@/components/SendBox.vue";
export default {
  components: {
    Tools,
    Gmlist,
    SendBox,
  },
  setup() {},
};
</script>

<style lang="less" scoped>
.home {
  padding-left: 70px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
