$(function () {
var user_id = ''
    getUserInfo()
})

function getUserInfo() {
    console.log("getUserInfo()");
    // $.ajax({
    //     method: 'GET',
    //     url: '/my/userinfo',
    //     success: function (res) {
    //         // console.log(res.data.id)
    //         if (res.status !== 0) {
    //             return layui.layer.msg('获取用户信息失败')
    //         }
    //         user_id = res.data.id
    //         renderAvatar(res.data)
    //     }
    // })
}

function renderAvatar(user) {
    var name = user.username
    $('.welcome').html(name) //'欢迎&nbsp;&nbsp' +
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
}

// $('#userinfo').click(function () {
//     location.href = './user/user_info.html'
// })


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

// iframe点击事件
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
// 添加设备
$('.add_device').click(function () {
    layer.open({
        type: 1,
        title: '添加设备',
        shadeClose:true,
        content: $('#add_device_tpl').html(),
        success: function (layero, index) {
            // console.log(layero, index);
            $('#add_device_form').on('submit', function (e) {
                e.preventDefault()
                var data = {
                    user_id,
                    owner_id:user_id,
                    api_key: $('#add_device_form [name=api_key]').val(),
                    device_id:$('#add_device_form [name=device_id').val(),
                    device_name:$('#add_device_form [name=device_name]').val()
                }
                console.log(data)
                // $.post('/my/insert_device', data, function (res) {
                //     if (res.status !== 0) {
                //         console.log(res.message)
                //         return layer.msg("数据不合法,请确认输入的api_key和device_id与onenet平台是否一致")
                //     }
                //     layer.msg("添加成功")
                //     $('#iFrame').attr('src', $('#iFrame').attr('src'));
                //     layer.closeAll('page');
                // })
            })
        }
    });
})

$('.ing').click(function () {
        layer.msg('开发中...')
    })