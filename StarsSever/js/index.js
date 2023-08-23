// 在全局作用域中声明变量，从 localStorage读取变量，没有则赋值默认
let ip = localStorage.getItem('ip') || "192.168.4.1";
let port = localStorage.getItem('port') || "81";
let addr = localStorage.getItem('addr') || 1;
let start = localStorage.getItem('enableDevice') || false;

var connection_num = 1  //重连次数
var send_count = 1      //发送帧数计数
var res_count = 1       //接收帧数计数
var connection_flag = false //true打开WiFi断线重连
var CAN1_RX_DATA = [];
var CAN1_TX_DATA = [];


////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                   基础配置修改ip、port、addr
*
***********************************************************************************************************/
function update_ipport() {
    // 存储数据到 localStorage，刷新之后重新读取
    localStorage.setItem('ip', ip);
    localStorage.setItem('port', port);
    localStorage.setItem('addr', addr);
    // 获取显示 IP 和端口的元素
    let ipPortElement = document.getElementById("ipPort");

    // 将 IP 地址和端口号插入到元素中
    ipPortElement.textContent = ip + ":" + port + "  地址：" + addr;
}
update_ipport();

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                        websocket初始化
*
***********************************************************************************************************/
var connection = new WebSocket(`ws://${ip}:${port}/`, ['arduino']);
// var connection 
connection.onopen = function () {
    connection.send('Connect ' + new Date());
};
connection.onclose = function () {
    layer.msg("连接断开。。。");
    // setTimeout(function () {
    // connection = new WebSocket('ws://192.168.4.1:81/', ['arduino']);
    // }, 5000); // 5 seconds
};

connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
    layer.msg("连接出错，检查网络连接、ip：" + ip + " 端口：" + port + "、wifi连接是否打开");
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                      处理websocket接收事件
*
***********************************************************************************************************/
connection.onmessage = function (e) {
    // if (e.data == "Connected") document.getElementById("lj").value = "连接成功";

    // 将接收到的字符串转换为16进制格式
    var hexData = '';
    for (var i = 0, j = 0; i < e.data.length; i += 2, j++) {
        var hexByte = e.data.substr(i, 2);
        // CAN1_RX_DATA[j] = hexByte;
        hexData += hexByte + ' ';
    }
    console.log('Server (Hex):', hexData);

    // 移除字符串中的空格，并按空格分隔成数组
    const stringArray = hexData.replace(/\s/g, '').match(/.{2}/g);
    // 取前5个元素
    const extractedData = stringArray.slice(0, 5);
    const res_crc = stringArray.slice(5, 7).join(' ');
    // 将 res_crc 解析为整数
    const parsed_res_crc = parseInt(res_crc.replace(/\s/g, ''), 16);
    // 构建新的字符串并添加空格
    const result = extractedData.join(' ');
    CAN1_RX_DATA = result.split(' ').map(hex => parseInt(hex, 16));
    const crcValue = CRC16(CAN1_RX_DATA);
    // var res_msg_crc = crcValue.toString(16).toUpperCase().padStart(4, '0').replace(/(.{2})/g, "$1 ")

    if (crcValue === parsed_res_crc) {
        // console.log("接收的数据crc校验成功");
        document.getElementById('iFrame').contentWindow.updateValue(CAN1_RX_DATA[1] * 256 + CAN1_RX_DATA[2], CAN1_RX_DATA[3] * 256 + CAN1_RX_DATA[4]);
        $("#res_msg").val(hexData);
        $("#input_res_count").val(res_count++);
        if (CAN1_RX_DATA[1] * 256 + CAN1_RX_DATA[2] == 11)
            document.getElementById('iFrame').contentWindow.updata_main_dl(CAN1_RX_DATA[3] * 256 + CAN1_RX_DATA[4]);
    }
    else {
        console.log("接收的数据crc校验错误");
    }

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                      wifi图标相关功能
*
***********************************************************************************************************/
setInterval(function () {
    var wifi_status = connection.readyState
    // console.log(wifi_status);
    const $wifiIcon = $("#wifi");
    switch (wifi_status) {
        case WebSocket.CONNECTING://0
            layer.msg("正在尝试第" + connection_num++ + "次重连 ");
            $wifiIcon.css("color", "#ffb800"); //黄
            $wifiIcon.addClass("layui-anim-scalesmall-spring layui-anim-loop");
            break;
        case WebSocket.OPEN://1
            connection_num = 0
            $wifiIcon.css("color", "#07f52a"); //绿
            $wifiIcon.removeClass("layui-anim-scalesmall-spring layui-anim-loop");
            break;
        case WebSocket.CLOSED://3
            //connection = new WebSocket('ws://192.168.4.1:81/', ['arduino']);
            $wifiIcon.css("color", "#f80505"); //红
            $wifiIcon.removeClass("layui-anim-scalesmall-spring layui-anim-loop");
            // location.reload();
            connection_flag ? window.location.reload() : $wifiIcon.css("color", "#ffb800"); //黄;//判断为打开自动重连时再刷新重连
            break;
        default:
            $wifiIcon.css("color", "#f80505"); //红
            $wifiIcon.removeClass("layui-anim-scalesmall-spring layui-anim-loop");
            break;
    }
}, 3000);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                        websocket发送函数
*
***********************************************************************************************************/
function sendmsg(send_msg) {
    // 移除字符串中的空格，并按空格分隔成数组
    const stringArray = send_msg.replace(/\s/g, '').match(/.{2}/g);
    // 取前5个元素
    const extractedData = stringArray.slice(0, 5);
    // 构建新的字符串并添加空格
    const result = extractedData.join(' ');
    CAN1_TX_DATA = result.split(' ').map(hex => parseInt(hex, 16));
    const crcValue = CRC16(CAN1_TX_DATA);
    let send_msg_crc = crcValue.toString(16).toUpperCase().padStart(4, '0').replace(/(.{2})/g, "$1 ")
    $("#send_msg").val(result + " " + send_msg_crc);
    console.log("下发： " + result + " " + send_msg_crc);
    // 给目标元素追加「往下滑入」的动画
    // setTimeout(function () { $('#send_msg').addClass('layui-anim-fadein'); });
    // $('#send_msg').removeClass('layui-anim-fadein');
    try {
        connection.send(result + " " + send_msg_crc);
        $("#input_send_count").val(send_count++);
    } catch (error) {
        // layer.msg('发送消息时出错了:' + error)
        console.error('发送消息时出错了:', error);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                           右侧菜单
*
***********************************************************************************************************/
layui.use(['element', 'layer', 'util'], function () {
    var element = layui.element
        , layer = layui.layer
        , util = layui.util
        , $ = layui.$
    //头部事件
    util.event('lay-header-event', {
        //左侧菜单事件
        menuLeft: function (othis) {
            if ($('.layui-hide-sm').css('display') == 'inline-block') {

                $(this).toggleClass("layui-icon-shrink-right ")
                $(this).toggleClass("layui-icon-spread-left")
                if ($(this).hasClass("layui-icon-shrink-right")) {
                    $('.layui-side').css({ 'left': '0', 'transition': 'left 0.5s' })
                    $('.layui-logo').css({ 'left': '0', 'transition': 'left 0.5s' })
                    // $('.layui-body').css({ 'left': '200px', 'transition': 'left 0.5s' })
                    $('.layui-layout-left').css({ 'left': '200px', 'transition': 'left 0.5s' })
                    // $('.layui-footer').css({ 'left': '200px', 'transition': 'left 0.5s' })
                }
                else {
                    $('.layui-side').css({ 'left': '-200px', 'transition': 'left 0.5s' })
                    $('.layui-logo').css({ 'left': '-200px', 'transition': 'left 0.5s' })
                    $('.layui-body').css({ 'left': '0', 'transition': 'left 0.5s' })
                    $('.layui-layout-left').css({ 'left': '0', 'transition': 'left 0.5s' })
                    // $('.layui-footer').css({ 'left': '0', 'transition': 'left 0.5s' })
                }
            }

        },


        menuRight: function () {
            // 定义 HTML 内容
            var contentHTML = `
                <div style="padding: 15px;">
                    <label for="ip">IP：</label>
                    <input type="text" id="ip" value="${ip}"><br><br>
                    <label for="port">端口：</label>
                    <input type="text" id="port" value="${port}"><br><br>
                    <label for="addr">地址：</label>
                    <input type="text" id="addr" value="${addr}"><br><br>
                    <button id="submitBtn">确定</button>
                </div>
            `;

            // 打开右侧菜单
            layer.open({
                type: 1,
                title: '基础配置',
                content: contentHTML,
                area: ['260px', '100%'],
                offset: 'rt', // 右上角
                anim: 'slideLeft', // 从右侧抽屉滑出
                shadeClose: true,
                scrollbar: false
            });

            // 设置确定按钮点击事件,更新连接
            $('#submitBtn').click(function () {
                // 获取输入框的值
                ip = $('#ip').val();
                port = $('#port').val();
                addr = $('#addr').val();
                // layer.closeAll();
                update_ipport();//更新基础设置
                window.location.reload()//刷新生效
            });
        }

    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                          CRC校验
*
***********************************************************************************************************/
// CRC16 校验表
const crc_ta = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
    0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
    0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
    0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
    0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
    0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
    0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
    0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
    0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
    0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
    0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
    0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
    0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
    0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
    0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
    0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
    0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
    // ... 剩余部分省略
];

// 计算 CRC16 校验位
function CRC16(data) {
    let crc = 0;
    for (let i = 0; i < data.length; i++) {
        const index = ((crc >> 8) ^ data[i]) & 0xFF;
        crc = (crc << 8) ^ crc_ta[index];
    }
    return crc & 0xFFFF;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                           侧边栏
*
***********************************************************************************************************/
// iframe子页面点击事件，点击主体关闭侧边栏
var IframeOnClick = {
    resolution: 200,
    iframes: [],
    interval: null,
    Iframe: function () {
        this.element = arguments[0];
        this.cb = arguments[1];
        this.hasTracked = false;
    },
    track: function (element, cb) {
        this.iframes.push(new this.Iframe(element, cb));
        if (!this.interval) {
            var _this = this;
            this.interval = setInterval(function () { _this.checkClick(); }, this.resolution);
        }
    },
    checkClick: function () {
        if (document.activeElement) {
            var activeElement = document.activeElement;
            for (var i in this.iframes) {
                if (activeElement === this.iframes[i].element) {
                    if (this.iframes[i].hasTracked == false) {
                        this.iframes[i].cb.apply(window, []);
                        this.iframes[i].hasTracked = true;
                    }
                } else {
                    this.iframes[i].hasTracked = false;
                }
            }
        }
    }
};

//点击主体关闭侧边栏
IframeOnClick.track(document.getElementById("iFrame"), function () {
    if ($('.layui-hide-sm').css('display') == 'inline-block') {
        $("#icon-turn").addClass("layui-icon-spread-left")
        $("#icon-turn").removeClass("layui-icon-shrink-right")
        $('.layui-side').css({ 'left': '-200px', 'transition': 'left 0.5s' })
        $('.layui-logo').css({ 'left': '-200px', 'transition': 'left 0.5s' })

        $('.layui-body').css({ 'left': '0', 'transition': 'left 0.5s' })
        $('.layui-layout-left').css({ 'left': '0', 'transition': 'left 0.5s' })
        // $('.layui-footer').css({ 'left': '0', 'transition': 'left 0.5s' })
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                           头部关使能按钮
*
***********************************************************************************************************/
$('#stop').click(function () {
    // sendmsg('01 C0 04 55 AA 20 DF');
    sendWithRetries('01 C0 04 55 AA 20 DF');
    // read_with_id(11); // 启动发送帧数据的过程
    localStorage.setItem('enableDevice', false);

    layer.msg('关使能')

    // 在父页面中调用子页面函数
    document.getElementById('iFrame').contentWindow.updateValue(182, 88);
    document.getElementById('iFrame').contentWindow.disableDevice();//调用子页面的关使能

    // 给目标元素追加「往下滑入」的动画
    setTimeout(function () { $('#stop').addClass('layui-anim-scale'); });
    $('#stop').removeClass('layui-anim-scale');
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               验证通讯有效性
*
***********************************************************************************************************/
var sendAttempts = 0;   //当前重发次数
var maxSendAttempts = 10; //最大重发次数
var currentFrameIndex = 256;
// 发送数据
function sendWithRetries(sendData) {
    // 将地址值转换为两位的十六进制字符串
    let addrHex = parseInt(addr, 10).toString(16).padStart(2, '0');
    sendData = addrHex + sendData.substr(2);//将地址替换成设置的地址
    var sendAttempts = 0;
    function attemptToSend() {
        if (sendAttempts < maxSendAttempts) {
            sendmsg(sendData);
            sendAttempts++;
            setTimeout(function () {
                checkReceivedData(attemptToSend);
            }, 50); // 等待200毫秒后检查接收数据
        } else {
            console.log("通讯失败");
            if (connection.readyState != WebSocket.OPEN) {
                layer.msg("WiFi未连接");
            }
            $("#can_flag").css("background", "#f80505");
            $("#res_msg").css("color", "#f80505");
        }
    }
    attemptToSend();
}
// 检查接收到的数据
function checkReceivedData(retryCallback) {
    if (CAN1_RX_DATA.length >= 3) {
        var RxData = CAN1_RX_DATA.slice(0, 3).join(' ');
        var TxData = CAN1_TX_DATA.slice(0, 3).join(' ');
        if (RxData === TxData) {
            // console.log("通讯有效");
            // 在父页面中调用子页面函数
            // document.getElementById('iFrame').contentWindow.updateValue(CAN1_RX_DATA[1] * 256 + CAN1_RX_DATA[2], CAN1_RX_DATA[3] * 256 + CAN1_RX_DATA[4]);
            $("#can_flag").css("background", "#07f52a");
            $("#res_msg").css("color", "#000000");
            CAN1_RX_DATA = []; // 重置接收数据数组
        } else {
            retryCallback();
        }
    } else {
        retryCallback();
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               logo
*
***********************************************************************************************************/
var chartDom = document.getElementById('logo');
var myChart = echarts.init(chartDom);
var option;

option = {
    graphic: {
      elements: [
        {
          type: 'text', // 元素类型为文本
          left: 'center', // 文本元素的水平位置为居中
          top: 'center', // 文本元素的垂直位置为居中
          style: {
            text: '桂林星辰科技', // 文本内容
            fontSize: 25, // 字体大小
            fontWeight: 'normal', // 字体粗细
            lineDash: [0, 200], // 虚线的线段长度和间隔长度
            lineDashOffset: 0, // 虚线偏移量
            fill: 'transparent', // 文本的填充颜色（透明）
            stroke: '#fff', // 文本的描边颜色（白色）
            lineWidth: 1 // 描边的线宽
          },
          keyframeAnimation: {
            duration: 5000, // 动画的持续时间（毫秒）
            loop: true, // 是否循环播放动画
            keyframes: [
              {
                percent: 0.6, // 动画进度的百分比（0.7即70%）
                style: {
                  fill: 'transparent', // 填充颜色（透明）
                  lineDashOffset: 200, // 虚线偏移量
                  lineDash: [200, 0] // 虚线的线段长度和间隔长度
                }
              },
              {
                // 在动画进度为10%时停止
                percent: 0.8,
                style: {
                  fill: 'transparent' // 填充颜色（透明）
                }
              },
              {
                percent: 1, // 动画进度的百分比（1即100%）
                style: {
                  fill: '#fff' // 填充颜色（白色）
                }
              }
            ]
          }
        }
      ]
    }
  };

option && myChart.setOption(option);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               轮询
*
***********************************************************************************************************/

var idsToQuery = [11, 13, 15, 17, 5]; // 放入需要查询的 ID

function read_with_id(pa_id) {
    var message = addr.toString(16).padStart(2, '0') + pa_id.toString(16).padStart(4, '0') + " 00 00";
    sendWithRetries(message);
}

function write_with_id_val(pa_id, pa_val) {
    var message = addr.toString(16).padStart(2, '0') + (pa_id + 32768).toString(16).padStart(4, '0') + parseInt(pa_val, 10).toString(16).padStart(4, '0');
    sendWithRetries(message);
}

var currentIndex = 0; // 用于迭代查询的数组索引

// setInterval(function () {
//     read_with_id(idsToQuery[currentIndex++]);
//     if (currentIndex >= idsToQuery.length) {
//         currentIndex = 0; // 重新开始循环
//     }
// }, 100);
////////////////////////////////////////////////////////////////////////////////////////////////////////////