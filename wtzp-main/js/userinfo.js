$(function () {
    getUserInfo()
})

layer.config({
    skin: 'demo-class'
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    var name = user.username
    $('#username').html(name) //'欢迎&nbsp;&nbsp' +
    $('#email').html(user.email)
}

$('#userinfo').click(function () {
    location.href = './user/user_info.html'
})

var layer = layui.layer
$('#btnLogout').click(function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        //do something
        localStorage.removeItem('token')
        window.parent.location.href = '/login.html'
        layer.close(index);
    });
})

$('#return').click(function () {
    window.parent.location.href = '../'
})

$('#btn-username').click(function () {
    layer.open({
        type: 1,
        shadeClose:true,
        title: '修改用户名', 
        content: $('#update-username').html(),
        success: function (layero, index) {
            // console.log(layero, index);
            $('#new-username').on('submit', function (e) {
                e.preventDefault()
                var data = {
                    username: $('#new-username [name=new-username]').val(),
                }
                $.post('/my/userinfo', data, function (res) {
                    if (res.status !== 0) {
                        return layer.msg("更新失败" + res.message)
                    }
                    layer.msg("更新成功")
                    getUserInfo()
                    layer.closeAll('page');
                })
            })
        }
    });
}) 
 
$('#btn-password').click(function () {
    layer.open({
        type: 1,
        shadeClose:true,
        title: '修改密码',
        content: $('#update-password').html(),
        success: function (layero, index) {
            // 监听登录表单提交事件
            $('#new-password').submit(function (e) {
                e.preventDefault()
                if ($('#new-password [name=new-password]').val() != $('#new-password [name=renew-password]').val()) {
                    return layer.msg("密码不一致")
                }
                // 验证旧密码
                var data = {
                    username: $('#username').html(),
                    password: $('#new-password [name=old-password]').val(),
                }
                $.post('/api/login', data, function (res) {
                    if (res.status !== 0) {
                        return layer.msg("验证失败,旧密码错误")
                    }
                    // 验证旧密码成功,更新新密码
                    var data_up = {
                        password: $('#new-password [name=new-password]').val(),
                    }
                    $.post('/my/userinfo', data_up, function (res) {
                        if (res.status !== 0) {
                            return layer.msg("更新失败" + res.message)
                        }
                        layer.msg("更新成功")
                        layer.closeAll('page');
                    })
                })
            })
        }
    });
})
 
$('#btn-email').click(function () {
    layer.open({
        type: 1,
        shadeClose:true,
        title: '修改邮箱',
        content: $('#update-email').html(),
        success: function (layero, index) {
            // console.log(layero, index);
            $('#new-email').on('submit', function (e) {
                e.preventDefault()
                var data = {
                    email: $('#new-email [name=new-email]').val(),
                }
                $.post('/my/userinfo', data, function (res) {
                    if (res.status !== 0) {
                        return layer.msg("更新失败" + res.message)
                    }
                    layer.msg("更新成功")
                    getUserInfo()
                    layer.closeAll('page');
                })
            })
        }
    });
})


