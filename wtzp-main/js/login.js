$(function () {
    //点击注册显示注册box,隐藏登录box
    $('#link_reg').on('click', function () {
        return layer.msg('暂不开放注册功能')
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击登录显示登录box,隐藏注册box
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //导入layer
    var layer = layui.layer
    //监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        //禁用默认提交事件
        e.preventDefault()
        //判断密码两次输入是否一致
        if ($('#form_reg [name=password]').val() != $('#form_reg [name=repassword]').val()) {
            return layer.msg("密码不一致")
        }
        // 构建要提交的data
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        // 发生post请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("注册成功，请登录")
            // 注册成功模拟点击去登录按钮
            $('#link_login').click()
        })
    })
    // 监听登录表单提交事件
    $('#form_login').submit(function (e) {
        // console.log("sss"+$(this).serialize())
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // data序列化  xx:xx&xx:xx
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败,账号或密码错误')
                }
                layer.msg('登录成功')
                // 登录成功把返回的token缓存到浏览器
                localStorage.setItem('token', res.token)
                // 跳转到首页
                location.href = '/index.html'
            }
        })
    })
})

