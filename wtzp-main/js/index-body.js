function online(api_key, device_id) {
    var api = new OneNetApi(api_key);
    str = api.sendCommand(device_id, 'online?').done(function (data) {
        if (data.error == "succ" && data.errno == 0) {
            $('#' + device_id).html("<span style='color: rgb(82, 181, 129);'>在线</span>")
            $("#" + device_id + device_id).css("opacity", "1")
        }
        else if (data.errno == 10) {
            $('#' + device_id).html("<span style='color: rgb(128, 131, 133);'>离线</span>")
            $("#" + device_id + device_id).css("opacity", "0.6")
        }
        else if (data.errno == 100) {
            $('#' + device_id).html("<span style='color: rgb(217,48,37);'>断网啦</span>")
            $("#" + device_id + device_id).css("opacity", "0.6")
        }

        else {
            $('#' + device_id).html("<span style='color: rgb(217,48,37);'>错误码:" + data.errno + "</span>")
            $("#" + device_id + device_id).css("opacity", "0.6")
        }
    });
}
layui.use(['layer', 'laytpl', 'form'], function () {
    var layer = layui.layer
        , laytpl = layui.laytpl
        , form = layui.form
    $(function () {
        getdevice()
    })
    function getdevice() {
        console.log("getdevice() ");
        // $.ajax({
        //     method: 'GET',
        //     url: '/my/userinfo',
        //     success: function (res) {
        //         // console.log(res)
        //         if (res.status !== 0) {
        //             return layui.layer.msg('获取用户信息失败')
        //         }
        //         $.ajax({
        //             method: 'POST',
        //             url: '/my/device',
        //             data: { 'user_id': res.data.id },
        //             success: function (res) {
        //                 if (res.status !== 0) {
        //                     return layui.layer.msg('获取设备列表失败')
        //                 }
        //                 data = { device: res.data }
        //                 // console.log(data)
        //                 var getTpl = demo.innerHTML
        //                     , view = document.getElementById('view');
        //                 laytpl(getTpl).render(data, function (html) {
        //                     view.innerHTML = html;
        //                 });
        //                 $('.layui-panel').click(function () {
        //                     let btn_device_id = $(this).attr('btn-device-id')
        //                     let btn_api_key = $(this).attr('btn-api-key')
        //                     let btn_device_name = $(this).attr('btn-device-name')
        //                     let url = "/device.html?api_key:" + btn_api_key + "&device_id:" + btn_device_id + "&device_name:" + btn_device_name
        //                     window.parent.location.href = url
        //                     // window.open(url)
        //                     console.log(url)
        //                 })
        //             }
        //         })
        //     }
        // })
    }
});  //layui加载模块

// {
//     id: 3,
//     user_id: 50, //index
//     owner_id: 50,
//     device_id: "69798850",
//     device_name: "测试设备3号艾恩人民",
//     api_key: "Jv9=4GlC9mUikaJQgKt5HQl3qzc",
//     img_src: "/images/device/26.png",
// },

// {
//     id: 4,
//     user_id: 50, //index
//     owner_id: 50,
//     device_id: "698798853",
//     device_name: "测试设备4号",
//     api_key: "Jv9=4GlC9mUikaJQgKt5HQl3qzc=",
//     img_src: "/images/device/260.png",
// },
