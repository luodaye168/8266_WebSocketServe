var laytpl = layui.laytpl

$(function () {
    getdevice()
})
function getdevice() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            $.ajax({
                method: 'POST',
                url: '/my/device',
                data: { 'user_id': res.data.id },
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('获取设备列表失败')
                    }
                    // console.log(res.data)
                    data = { device: res.data }
                    var getTpl = tbody.innerHTML
                        , view = document.getElementById('view');
                    laytpl(getTpl).render(data, function (html) {
                        view.innerHTML = html;
                    });

                    $('.btn-edit').on('click', function () {
                        let btn_device_id = $(this).attr('device-id')
                        let btn_device_name = $(this).attr('device-name')
                        console.log(btn_device_id)
                        //更新
                        layer.open({ 
                            type: 1,
                            shadeClose:true,
                            title: '修改 '+btn_device_name+' 设备名',
                            content: $('#update-device-tpl').html(),
                            success: function (layero, index) {
                                // console.log(layero, index);
                                $('#new-device-form').on('submit', function (e) {
                                    e.preventDefault()
                                    var data = {
                                        device_name: $('#new-device-form [name=new-device-name]').val(),
                                        id: btn_device_id
                                    }
                                    console.log(data)
                                    $.post('/my/update_device', data, function (res) {
                                        if (res.status !== 0) {
                                            return layer.msg("更新失败" + res.message)
                                        }
                                        layer.msg("更新成功")
                                        getdevice()
                                        layer.close(index);
                                    })
                                })
                            }
                        });

                    })

                    $('.btn-del').on('click', function () {
                        let btn_device_id = $(this).attr('device-id')
                        let btn_device_name = $(this).attr('device-name')
                        layer.confirm('确认删除 '+btn_device_name+'?', { icon: 3, title: '提示' }, function (index) {
                            console.log(btn_device_id)
                            //删除api
                            $.ajax({
                                method: 'POST',
                                url: '/my/delete_device',
                                data: { 'id': btn_device_id },
                                success: function (res) {
                                    if (res.status !== 0) {
                                        return layui.layer.msg('删除设备失败')
                                    }
                                    layer.msg('删除设备成功')
                                    getdevice()
                                }
                            });
                            layer.close(index);
                        });
                    })
                }
            })
        }
    })

}




