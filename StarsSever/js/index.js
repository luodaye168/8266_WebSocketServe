layui.use(['element', 'layer', 'util'], function () {
    var element = layui.element
        , layer = layui.layer
        , util = layui.util
        , $ = layui.$
        , dropdown = layui.dropdown;

    dropdown.render({
        elem: '.demo-dropdown-base', // 绑定元素选择器，此处指向 class 可同时绑定多个元素
        data: [{
            title: '位置环',
            id: 100,
            cmd: "01 80 21 00 01"
        }, {
            title: '速度环',
            id: 101,
            cmd: "01 80 21 00 02"
        }, {
            title: '力矩环',
            id: 102,
            cmd: "01 80 21 00 03"
        }],
        click: function (obj) {
            this.elem.find('span').text(obj.title);
            sendmsg(obj.cmd);
        }
    });
    //头部事件
    util.event('lay-header-event', {
        //左侧菜单事件
        // menuLeft: function (othis) {
        //     // layer.msg('展开左侧菜单的操作', { icon: 0 });
        //     $('.layui-side').css('display', 'none')
        //     $('.layui-body').css('left', '0')
        //     $('.layui-layout-left').css('left', '0')
        //     $('#icon-turn').toggleClass("layui-icon-shrink-right",500)
        //     $('#icon-turn').toggleClass("layui-icon-spread-left",500)

        // }

        menuRight: function () {  // 右侧菜单事件
            layer.open({
                type: 1,
                title: '基础配置',
                content: '<div style="padding: 15px;">ip,端口,用户，控制模式</div>',
                area: ['260px', '100%'],
                offset: 'rt', // 右上角
                anim: 'slideLeft', // 从右侧抽屉滑出
                shadeClose: true,
                scrollbar: false
            });
        }
    });

});

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

$(function () {
    var user_id = ''
    getUserInfo()
})

function getUserInfo() {
    console.log("getUserInfo()");
    // var CAN1_RX_DATA = [];
    // var connection = new WebSocket('ws://192.168.4.1:81/', ['arduino']);
    // connection.onopen = function () { connection.send('Connect ' + new Date()); };
    // connection.onclose = function () { document.getElementById("lj").value = "连接断开"; }
    // connection.onerror = function (error) {
    //     console.log('WebSocket Error ', error);
    //     document.getElementById("lj").value = "连接失败";
    // };
    // connection.onmessage = function (e) {
    //     if (e.data == "Connected") document.getElementById("lj").value = "连接成功";

    //     // 将接收到的字符串转换为16进制格式
    //     var hexData = '';
    //     for (var i = 0, j = 0; i < e.data.length; i += 2, j++) {
    //         var hexByte = e.data.substr(i, 2);
    //         CAN1_RX_DATA[j] = hexByte;
    //         hexData += hexByte + ' ';
    //     }
    //     console.log('Server (Hex):', hexData);

    //     // for (var i = 0; i < 7; console.log(CAN1_RX_DATA[i++]));

    //     //CAN1_RX_DATA[3]，CAN1_RX_DATA[4]合并成整数
    //     var result = parseInt(CAN1_RX_DATA[3], 16) * 256 + parseInt(CAN1_RX_DATA[4], 16);

    //     // 输出结果，这里使用toString(10)将结果转换成十进制字符串
    //     document.getElementById("Server").value += result.toString(10) + "\r\n";
    // };


}
//发送文本框的内容
function sendmsg(send_msg) {
    // 移除字符串中的空格，并按空格分隔成数组
    const stringArray = send_msg.replace(/\s/g, '').match(/.{2}/g);
    // 取前5个元素
    const extractedData = stringArray.slice(0, 5);
    // 构建新的字符串并添加空格
    const result = extractedData.join(' ');
    const integerArray = result.split(' ').map(hex => parseInt(hex, 16));
    const crcValue = CRC16(integerArray);
    let send_msg_crc = crcValue.toString(16).toUpperCase().padStart(4, '0').replace(/(.{2})/g, "$1 ")
    $("#send_msg").val(result + " " + send_msg_crc);
    console.log("下发： " + result + " " + send_msg_crc);


    // 给目标元素追加「往下滑入」的动画
    setTimeout(function () { $('#send_msg').addClass('layui-anim-fadein'); });
    $('#send_msg').removeClass('layui-anim-fadein');
    //connection.send(document.getElementById("msg").value);
}
// function renderAvatar(user) {
//     var name = user.username
//     $('.welcome').html(name) //'欢迎&nbsp;&nbsp' +
//     if (user.user_pic !== null) {
//         $('.layui-nav-img').attr('src', user.user_pic).show()
//         $('.text-avatar').hide()
//     } else {
//         $('layui-nav-img').hide()
//         var first = name[0].toUpperCase()
//         $('.text-avatar').html(first).show()

//     }
// }

// $('#userinfo').click(function () {
//     location.href = './user/user_info.html'
// })

//展开、收回侧边栏
$('#icon-turn').click(function () {
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
})

// iframe点击事件，点击主体关闭侧边栏
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
                if (activeElement === this.iframes[i].element) { // user is in this Iframe  
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


$('#stop').click(function () {
    sendmsg('01 C0 04 55 AA 20 DF');
    layer.msg('关使能')

    // 在子页面中调用函数
    document.getElementById('iFrame').contentWindow.updateValue(182, 88);

    // 给目标元素追加「往下滑入」的动画
    setTimeout(function () { $('#stop').addClass('layui-anim-scale'); });
    $('#stop').removeClass('layui-anim-scale');
})