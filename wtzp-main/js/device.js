
//layui加载模块
layui.use(['layer', 'laytpl', 'form'], function () {
    var layer = layui.layer
        , laytpl = layui.laytpl
        , form = layui.form
    $(function () {
        get_device_page()
    })
    function get_device_page() {
        $.ajax({
            method: 'POST',
            url: '/my/sensor',
            data: { 'device_id': device_id },
            success: function (res) {
                data = { sensor: res.data }
                // console.log(data)
                var getTpl1 = sensor_tpl.innerHTML
                    , view1 = document.getElementById('sensor_view');
                laytpl(getTpl1).render(data, function (html) {
                    view1.innerHTML = html;
                });
                // form.render();
            }
        })

        $.ajax({
            method: 'POST',
            url: '/my/switch',
            data: { 'device_id': device_id },
            success: function (res) {
                data = { switch: res.data }
                // console.log(data)
                var getTpl = switch_tpl.innerHTML
                    , view = document.getElementById('switch_view');
                laytpl(getTpl).render(data, function (html) {
                    view.innerHTML = html;
                });
                // var stream_name = ''
                $('.layui-input-block').click(function (e) {
                    let on_key = $(this).attr('on-key')
                    let off_key = $(this).attr('off-key')
                    stream_name = $(this).attr('stream-name')
                    // console.log($('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').hasClass('layui-form-onswitch'))
                    var api = new OneNetApi(api_key);
                    // console.log(api_key)
                    //判断是手动点击还是模拟点击
                    if (e.hasOwnProperty('originalEvent') && live_flag == true) {
                        // if ($('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').hasClass('layui-form-onswitch')) {
                        //     console.log(stream_name + "开" + on_key)
                        //     send_key = on_key
                        // }
                        // else {
                        //     console.log(stream_name + "关" + off_key)
                        //     send_key = off_key
                        // }
                        $('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').hasClass('layui-form-onswitch') ? send_key = on_key : send_key = off_key;

                        console.log('发送:' + send_key)
                        //下发指令
                        api.sendCommand(device_id, send_key).done(function (data) {
                            data.error != 'succ' ? layer.msg(下发指令失败) : console.log('发送:' + send_key + '成功');
                        });
                    }
                    else if (e.hasOwnProperty('originalEvent') && live_flag == false) {
                        layer.msg('设备不在线')
                    }
                })
                $('.layui-card-body').on('click', '#btn-add_sensor', function (e) {
                    // $('#btn-add_sensor').click(function () {
                    // layer.msg('添加传感器')
                    if ($('.edit_div').css('display') === 'block') {
                        layer.msg('页面编辑中不可添加')
                    }
                    else {
                        layer.open({
                            type: 1,
                            title: '添加传感器',
                            shadeClose: true,
                            content: $('#add_sensor_tpl').html(),
                            success: function (layero, index) {
                                // console.log(layero, index);
                                $('#add_sensor_form').on('submit', function (e) {
                                    e.preventDefault()
                                    // console.log(device_id,stream_name)
                                    var data = {
                                        device_id,
                                        stream_name: $('#add_sensor_form [name=stream_name]').val(),
                                        sensor_name: $('#add_sensor_form [name=sensor_name]').val(),
                                        unit: $('#add_sensor_form [name=unit]').val(),
                                    }
                                    // console.log(data)
                                    $.post('/my/insert_sensor', data, function (res) {
                                        if (res.status !== 0) {
                                            console.log(res.message)
                                            return layer.msg(res.message)
                                        }
                                        layer.msg("添加传感器成功")
                                        get_device_page()
                                        layer.closeAll('page');
                                    })
                                })
                            }
                        });
                    }
                })

                $('.layui-card-body').on('click', '#btn-add_switch', function (e) {
                    // $('#btn-add_switch').click(function () {
                    // layer.msg('添加开关')
                    if ($('.edit_div').css('display') === 'block') {
                        layer.msg('页面编辑中不可添加')
                    }
                    else {
                        layer.open({
                            type: 1,
                            title: '添加开关',
                            shadeClose: true,
                            content: $('#add_switch_tpl').html(),
                            success: function (layero, index) {
                                // console.log(layero, index);
                                $('#add_switch_form').on('submit', function (e) {
                                    e.preventDefault()
                                    // console.log(device_id,stream_name)
                                    var data = {
                                        device_id,
                                        high_low: $("input[name='pin']:checked").val(),
                                        on_key: $('#add_switch_form [name=on_key]').val(),
                                        off_key: $('#add_switch_form [name=off_key]').val(),
                                        stream_name: $('#add_switch_form [name=stream_name]').val(),
                                        switch_name: $('#add_switch_form [name=switch_name]').val(),
                                    }
                                    // console.log(data)
                                    $.post('/my/insert_switch', data, function (res) {
                                        if (res.status !== 0) {
                                            console.log(res.message)
                                            return layer.msg(res.message)
                                        }
                                        layer.msg("添加开关成功")
                                        get_device_page()
                                        layer.closeAll('page');
                                    })
                                })
                            }
                        });
                        form.render();
                    }
                })





                //点击edit_div编辑对应stream
                $('.edit_div').click(function () {
                    let id = $(this).attr('db_id')
                    let db_name = $(this).attr('db_name')
                    let name = $(this).attr('name')
                    if (db_name == 'wrqs_sensor') {
                        // layer.msg('更新传感器' + id + name)
                        layer.open({
                            type: 1,
                            shadeClose: true,
                            title: '修改 ' + name + ' 名',
                            content: $('#update-sensor-tpl').html(),
                            success: function (layero, index) {
                                // console.log(layero, index);
                                $('#new-sensor-form').on('submit', function (e) {
                                    e.preventDefault()
                                    var data = {
                                        sensor_name: $('#new-sensor-form [name=new-sensor-name]').val(),
                                        id
                                    }
                                    // console.log(data)
                                    $.post('/my/update_sensor', data, function (res) {
                                        if (res.status !== 0) {
                                            return layer.msg("更新失败" + res.message)
                                        }
                                        layer.msg("更新成功")
                                        $('.edit_icon').removeClass('layui-icon-auz');
                                        $('.edit_icon').addClass('layui-icon-edit');
                                        get_device_page()
                                        layer.close(index);
                                    })
                                })

                                $('.btn-del').click(function () {
                                    layer.confirm('确认删除' + name + '?', { icon: 3, title: '提示' }, function (index) {
                                        // console.log('删除' + id)
                                        $.post('/my/delete_sensor', { id: id }, function (res) {
                                            if (res.status !== 0) {
                                                console.log(res.message)
                                                return layer.msg("删除失败" + res.message)
                                            }
                                            get_device_page()
                                            layer.closeAll(function () {
                                                layer.msg("删除成功")
                                                $('.edit_icon').removeClass('layui-icon-auz');
                                                $('.edit_icon').addClass('layui-icon-edit');
                                            });
                                        })
                                        // layer.close(index);
                                    });
                                })

                            }
                        });

                    }
                    else if (db_name == 'wrqs_switch') {
                        // layer.msg('更新开关' + id + name)
                        layer.open({
                            type: 1,
                            shadeClose: true,
                            title: '修改 ' + name + ' 名',
                            content: $('#update-switch-tpl').html(),
                            success: function (layero, index) {
                                // console.log(layero, index);
                                $('#new-switch-form').on('submit', function (e) {
                                    e.preventDefault()
                                    var data = {
                                        switch_name: $('#new-switch-form [name=new-switch-name]').val(),
                                        id
                                    }
                                    // console.log(data)
                                    $.post('/my/update_switch', data, function (res) {
                                        if (res.status !== 0) {
                                            return layer.msg("更新失败" + res.message)
                                        }
                                        layer.msg("更新成功")
                                        $('.edit_icon').removeClass('layui-icon-auz');
                                        $('.edit_icon').addClass('layui-icon-edit');
                                        get_device_page()
                                        layer.close(index);
                                    })
                                })

                                $('.btn-del').click(function () {
                                    layer.confirm('确认删除' + name + '?', { icon: 3, title: '提示' }, function (index) {
                                        // console.log('删除' + id)
                                        $.post('/my/delete_switch', { id: id }, function (res) {
                                            if (res.status !== 0) {
                                                console.log(res.message)
                                                return layer.msg("删除失败" + res.message)
                                            }
                                            get_device_page()
                                            layer.closeAll(function () {
                                                layer.msg("删除成功")
                                                $('.edit_icon').removeClass('layui-icon-auz');
                                                $('.edit_icon').addClass('layui-icon-edit');
                                            });
                                        })
                                        // layer.close(index);
                                    });
                                })

                            }
                        });

                    }
                    // console.log($(this).html(), id, db_name, name)
                })

                // 开发中
                $('.layui-icon-log,.layui-icon-next').click(function () {
                    if ($('.edit_div').css('display') === 'none') {
                        layer.msg('开发中...')
                    }
                    else {
                        layer.msg('页面编辑中此元素不可用')
                    }
                })
                form.render();
            }
        })
    }

});



//右上角编辑图标
$('.edit_icon').click(function () {
    // console.log(e)
    //     console.log('hello')
    //     layer.msg('点击绿色背景文字修改对应组件')
    //     //切换.edit_div显示隐藏
    //     show = $('.edit_div').css('display')
    //     $('.edit_div').css('display', show == 'none' ? 'block' : 'none')
    //     //切换编辑保存图标
    //     $(this).toggleClass('layui-icon-auz')
    //     $(this).toggleClass('layui-icon-edit');
    //     //切换开关是否可点击
    //     // console.log($('input').attr('disabled'))
    //     $('input').attr('disabled') == undefined ? $('input').attr('disabled', 'true') : $('input').removeAttr('disabled');
    if ($(this).hasClass('layui-icon-edit')) {
        layer.msg('点击绿色背景文字修改对应组件')
        $('.edit_icon').removeClass('layui-icon-edit');
        $('.edit_icon').addClass('layui-icon-auz');
        $('.edit_div').css('display', 'block')
    }
    else if ($(this).hasClass('layui-icon-auz')) {
        layer.msg('编辑完成')
        $('.edit_icon').removeClass('layui-icon-auz');
        $('.edit_icon').addClass('layui-icon-edit');
        $('.edit_div').css('display', 'none')
    }
})

//定义设备在线标志位
var live_flag = false
//从url获取参数
function getQueryVariable(variable) {
    // variable = decodeURI(variable)
    var query = window.location.search.substring(1);
    query = decodeURI(query)
    var vars = query.split("&");//数据分隔符
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split(":");//键值对分隔符
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
const api_key = getQueryVariable('api_key')
const device_id = getQueryVariable('device_id')
const device_name = getQueryVariable('device_name')
//打印url传过来的三个参数
// console.log(api_key, device_id, device_name)
//将url传过来的设备名写进头部span
$('#device_name').html(device_name)
//点击左上角<图标回到首页
$('#return').click(function () {
    window.parent.location.href = '/index.html'
})

//定义询问设备是否在线函数，
function online(api_key, device_id) {
    var api = new OneNetApi(api_key);
    str = api.sendCommand(device_id, 'online?').done(function (data) {
        //将设备在线状态写进头部span
        if (data.error == "succ" && data.errno == 0) {
            live_flag = true
            $('#online').html("<span style='color: rgb(250,250,250);'>(在线)</span>")
            $('.layui-form-item input+div').css("background-color", "")
        }
        else if (data.errno == 10) {
            live_flag = false
            $('#online').html("<span style='color: #FFB800;'>(离线)</span>")
            $('.layui-form-item input+div').css("background-color", "rgb(200,200,200)")
            // $('.layui-panel').css("color", "#f0f0f0")
            // $(".layui-form-item input").attr('disabled', 'true');
        }
        else {
            $('#online').html("<span style='color: rgb(217,48,37);'>(错误码:" + data.errno + ")</span>")
        }
    });
}
//询问设备是否在线
online(api_key, device_id)
setInterval(function () { online(api_key, device_id) }, 5000)

//high_low为3时，请求的是传感器的数据,1或0请求开关
function getdata(stream_name, high_low) {
    var api = new OneNetApi(api_key);
    api.getDataStreams(device_id).done(function (data) {
        var jsonObject = data
        // console.log(jsonObject.error)
        //为数据流名称绑定id
        if (jsonObject.error == 'timeout') {
            return layer.msg('出错啦')
        }
        var stream_id = -1
        for (var i = 0; i < data.data.length; i++) {
            if ((jsonObject.data)[i].id == stream_name)
                stream_id = i
        };
        //如果没有该stream_name则stream_id为undefined
        if (stream_id === -1) {
            // console.log("存在非法的控制台未定义的数据流：" + stream_name)
            // layer.msg("存在非法的控制台未定义的数据流：" + stream_name)
            $('#' + stream_name).html('<span style="color: red; font-size: 12px;">非法stream !</span>')
            $('#' + stream_name + '+ span').html('')
            $('#' + stream_name + stream_name).css("color", "red")

        }
        else if (stream_id != -1) {
            if (high_low != 3 && (jsonObject.data)[stream_id].current_value == high_low) {
                // console.log(stream_name, "开", $('.layui-form-item input:checkbox[name=' + stream_name + ']').is(":checked"))
                if (!$('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').hasClass('layui-form-onswitch')) {
                    $('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').click()
                }
            }
            else if (high_low != 3 && (jsonObject.data)[stream_id].current_value != high_low) {
                // console.log(stream_name, "关", $('.layui-form-item input:checkbox[name=' + stream_name + ']').is(":checked"))
                if ($('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').hasClass('layui-form-onswitch')) {
                    $('.layui-form-item input:checkbox[name=' + stream_name + ']+.layui-unselect').click()
                }
            }
            else if (high_low == 3) {
                $('#' + stream_name).html((jsonObject.data)[stream_id].current_value)
            }
        }
    })
}

