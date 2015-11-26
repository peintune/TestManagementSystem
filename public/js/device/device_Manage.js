/**
 * Created by hekun on 15-1-16.
 */
Ext.namespace("pinganfang.ats.device");


pinganfang.ats.device.Manage = function () {
    var deviceWindow;
    deviceWindow = Ext.getCmp("deviceWindow");


    /*
     * stores begins
     * */
    var resolutionStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "1", "name": '1136*640'},
            {"id": "2", "name": '960*640'},
            {"id": "3", "name": '1920*1080'},
            {"id": "4", "name": '1280*720'},
            {"id": "5", "name": '2048*1536'},
            {"id": "6", "name": '854*480'}
        ]
    });

    var osVersionStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "1", "name": 'Ios'},
            {"id": "2", "name": 'Android'}

        ]
    });

    var statusStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "0", "name": 'Free'},
            {"id": "1", "name": 'Busy'}

        ]
    });
    var ramStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "8G", "name": '8G'},
            {"id": "16G", "name": '16G'},
            {"id": "32G", "name": '32G'},
            {"id": "64G", "name": '64G'},
            {"id": "128G", "name": '128G'},
            {"id": "256G", "name": '256G'}
        ]
    });

    var devicesStore = new Ext.data.JsonStore({
        url: 'searchDevices',
        fields: ['deviceId',
            {name: 'deviceName'},
            'deviceSerials', 'deviceMac',
            {name: 'osVersion', convert: osConvert},
            'releaseVersion', 'resolution', 'ram', 'department',
            {name: 'status', convert: statusConvert},
            'currentOwner', 'lastOwner']
    });

    var allUsersStore = new Ext.data.JsonStore({
        fields: [
            'id',
            'name'
        ]
    });
    Ext.Ajax.request({
        url: 'getAllUsers',
        method: 'GET',
        success: function (response) {
            var response = Ext.util.JSON.decode(response.responseText);
            allUsersStore.loadData(response);
        }
    });

    /*
     * convert begains
     * */

    function osConvert(v) {
        var osVersion = osVersionStore.getById(v).get("name");
        return osVersion;
    }

    function statusConvert(v) {
        var status = statusStore.getById(v).get("name");
        return status;
    }

    /*
     * components begins
     * */

    var searchBt = Ext.create('Ext.Button', {
        text: '搜索设备',
        handler: function () {
            Ext.Ajax.request({
                url: 'searchDevices',
                params: {
                    deviceId: Ext.getCmp('deviceId').value,
                    osVersion: osVersionCombox.getValue(),
                    status: statusCombox.getValue(),
                    owner:ownerCombox.getValue()

                },
                success: function (response) {
                    var response = Ext.util.JSON.decode(response.responseText);
                    devicesStore.loadData(response);
                    // process server response here
                }
            });
        }
    });

    var resetBt = Ext.create('Ext.Button', {
        text: '重置搜索条件',
        handler: function () {
            Ext.getCmp('deviceId').reset();
            osVersionCombox.reset();
            statusCombox.reset();
            ownerCombox.reset();
        }
    });

    var resetNewBt = Ext.create('Ext.Button', {
        text: '重置信息',
        handler: function () {
            Ext.getCmp('newDeviceId').reset();
            Ext.getCmp('newDeviceName').reset();
            Ext.getCmp('newSerials').reset();
            Ext.getCmp('newMac').reset();
            Ext.getCmp('releaseVersion').reset();
            newOsVersionComb.reset();
            resolutionCombox.reset();
            ramCombox.reset();
        }
    });

    var addBt = Ext.create('Ext.Button', {
        text: '增加新设备',
        id: 'addbt',
        handler: function () {

            if (Ext.getCmp('newDeviceId').value == '' || Ext.getCmp('newDeviceName').getValue() == '' ||
                Ext.getCmp('newSerials').getValue() == '' || Ext.getCmp('newMac').getValue() == '' ||
                newOsVersionComb.getValue() == '' || Ext.getCmp('releaseVersion').getValue() == '' ||
                resolutionCombox.getValue() == '' || ramCombox.getValue() == '') {
                Ext.Msg.alert("警告", '请输入完整的设备信息');
            } else {
                Ext.Ajax.request({
                    url: 'addDevice',
                    params: {
                        deviceId: Ext.getCmp('newDeviceId').value,
                        deviceName: Ext.getCmp('newDeviceName').getValue(),
                        deviceSerials: Ext.getCmp('newSerials').getValue(),

                        deviceMac: Ext.getCmp('newMac').getValue(),
                        osVersion: newOsVersionComb.getValue(),
                        releaseVersion: Ext.getCmp('releaseVersion').getValue(),
                        resolution: resolutionCombox.getValue(),
                        ram: ramCombox.getValue()
                    },
                    success: function (response) {

                        var response = Ext.util.JSON.decode(response.responseText);
                        alert(response);
                        // process server response here
                    }
                });
            }

        }
    });

    var acceptBt = Ext.create('Ext.Button', {
        text: '接收设备',
        id: 'acceptBt',
        handler: function () {
            var selection = deviceGridPanel.getSelectionModel().getSelection();

            if (Global.userRole == 1 || Global.username == selection[0].data.currentOwner) {
                Ext.Ajax.request({
                    url: 'acceptDevice',
                    method:'POST',
                    params: {
                        deviceId: selection[0].data.deviceId,
                        currentOwner: selection[0].data.currentOwner,
                        lastOwner: selection[0].data.lastOwner
                    },
                    success: function (response) {

                        Ext.Ajax.request({
                            url: 'searchDevices',
                            params: {
                                deviceId: Ext.getCmp('deviceId').value,
                                osVersion: osVersionCombox.getValue(),
                                status: statusCombox.getValue()

                            },
                            success: function (response) {
                                var response = Ext.util.JSON.decode(response.responseText);
                                devicesStore.loadData(response);
                                // process server response here
                            }
                        });
                    }
                });
            } else {
                Ext.Msg.alert("警告", '你没有权限操作这台设备');
            }
            }
    });


    var rejectBt = Ext.create('Ext.Button', {
        text: '拒绝接收设备',
        id: 'rejectBt',
        handler: function () {

            var selection = deviceGridPanel.getSelectionModel().getSelection();

            if (Global.userRole == 1 || Global.username == selection[0].data.currentOwner) {
                Ext.Ajax.request({
                    url: 'rejectDevice',
                    method:'POST',
                    params: {
                        deviceId: selection[0].data.deviceId,
                        lastOwner: selection[0].data.lastOwner,
                        currentOwner: selection[0].data.currentOwner

                    },
                    success: function (response) {

                        Ext.Ajax.request({
                            url: 'searchDevices',
                            params: {
                                deviceId: Ext.getCmp('deviceId').value,
                                osVersion: osVersionCombox.getValue(),
                                status: statusCombox.getValue()

                            },
                            success: function (response) {
                                var response = Ext.util.JSON.decode(response.responseText);
                                devicesStore.loadData(response);
                                // process server response here
                            }
                        });
                    }
                });
            } else {
                Ext.Msg.alert("警告", '你没有权限操作这台设备');
            }

        }
    });

    var statusCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '状态',
        store: statusStore,
        id: 'statusComb',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
        valueField: 'id',
        emptyText: 'select device status'
    });

    var ownerCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '持有者',
        store: allUsersStore,
        id: 'ownerComb',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
        valueField: 'name',
        emptyText: 'select owner'
    });

    var ramCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '内存',
        store: ramStore,
        id: 'ramComb',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
        valueField: 'id',
        emptyText: 'select device RAM'
    });

    var resolutionCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '分辨率',
        store: resolutionStore,
        id: 'resolutionComb',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
        valueField: 'id',
        emptyText: 'select device resolution'
    });

    var osVersionCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '系统',
        store: osVersionStore,
        id: 'osComb',
        editable: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        emptyText: 'select os Version'
    });

    var newOsVersionComb = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '系统',
        store: osVersionStore,
        id: 'newOsComb',
        editable: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        emptyText: 'select os Version'
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        saveBtnText: '转让',
        cancelBtnText: "取消",
        autoCancel: false,
        clicksToMoveEditor: 1,
        autoCancel: false,
        listeners: {
            edit: function (e) {
                if (Global.userRole == 1 || e.context.record.data.lastOwner == Global.username) {
                    var selection = deviceGridPanel.getSelectionModel().getSelection();
                        Ext.Ajax.request({
                            url: 'checkUserExist',
                            method:'POST',
                            params: {
                                username: selection[0].data.currentOwner
                            },
                            success: function (response) {
                                var response= Ext.util.JSON.decode(response.responseText);
                                if(response.istatus!=1){
                                    Ext.Msg.alert("警告!",'当前用户不存在!!!');
                                }else{
                                    Ext.Ajax.request({
                                        url: 'transferDevice',
                                        method:'POST',
                                        params: {
                                            deviceId: selection[0].data.deviceId,
                                            lastOwner: selection[0].data.lastOwner,
                                            currentOwner: selection[0].data.currentOwner
                                        },
                                        success: function (response) {

                                            Ext.Ajax.request({
                                                url: 'searchDevices',
                                                params: {
                                                    deviceId: Ext.getCmp('deviceId').value,
                                                    osVersion: osVersionCombox.getValue(),
                                                    status: statusCombox.getValue()

                                                },
                                                success: function (response) {
                                                    var response = Ext.util.JSON.decode(response.responseText);
                                                    devicesStore.loadData(response);
                                                    // process server response here
                                                }
                                            });
                                        }
                                    });
                                }

                            }
                        });

                } else {
                    Ext.Msg.alert('Error', "你没有权限操作这个设备，或者检查是否登录");
                }

            }
        }
    });

    var deviceGridPanel = Ext.create('Ext.grid.Panel', {
        title: '设备列表(双击单个设备进行转让操作)',
        store: devicesStore,
        columns: [
            { text: '设备ID', dataIndex: 'deviceId', width: 100},
            { text: '设备名字', dataIndex: 'deviceName', width: 180},
            { text: '系统', dataIndex: 'osVersion', width: 100 },
            { text: '发布版本', dataIndex: 'releaseVersion', width: 130 },
            { text: '状态', dataIndex: 'status', width: 100 },
            { text: '前一持有者', dataIndex: 'lastOwner', width: 140},
            {
                text: '当前持有者',
                dataIndex: 'currentOwner',
                width: 140,
                field: {
                    xtype: 'combobox',
                    typeAhead: true,
                    forceSelection: true,
                    displayField: 'name',
                    store: allUsersStore,
                    editable: true,
                    valueField: 'name',
                    lazyRender: true,
                    triggerAction: 'all',
                    editor: {
                        allowBlank: false
                    }
                }},

            { text: '部门', dataIndex: 'department', width: 150, hidden: true },
            { text: '设备序列号', dataIndex: 'deviceSerials', hidden: true },
            { text: 'Mac地址', dataIndex: 'deviceMac', hidden: true  },
            { text: '分辨率', dataIndex: 'resolution', hidden: true  },
            { text: '内存', dataIndex: 'ram,', hidden: true  }
        ],
        plugins: [rowEditing],
        height: 550,
        width: 900

    });


    /*
     * create  main panels
     * */
    var searchPanel = Ext.create('Ext.panel.Panel', {
        title: '搜索设备',
        split: true,
        collapsible: true,
        collapseDirection: 'left',
        style: 'margin:10px',
        frame: true,
        animate: true,
        layout: 'form',
        style: 'margin-top:10px;',
        items: [
            {
                xtype: 'textfield',
                id: 'deviceId',
                fieldLabel: '设备ID',
                emptyText: 'input device id'
            },
            osVersionCombox,
            statusCombox,
            ownerCombox
        ],
        buttons: [
            searchBt, resetBt]

    });

    var addNewPanel = Ext.create('Ext.panel.Panel', {
        title: '增加新设备',
        split: true,
        collapsible: true,
        hidden: Global.userRole == 1 ? false : true,
        collapseDirection: 'left',
        frame: true,
        animate: true,
        layout: 'form',
        style: 'margin:20px',
        style: 'margin-top:20px;',
        items: [
            {
                xtype: 'textfield',
                id: 'newDeviceId',
                fieldLabel: '设备ID',
                emptyText: 'for example:4'
            },
            {
                xtype: 'textfield',
                id: 'newDeviceName',
                fieldLabel: '设备名字',
                emptyText: 'for example:samsun s4'
            },
            {
                xtype: 'textfield',
                id: 'newSerials',
                fieldLabel: '设备序列号',
                emptyText: 'for example:DLXM2VLWFCM5'
            },
            {
                xtype: 'textfield',
                id: 'newMac',
                fieldLabel: 'Mac地址',
                emptyText: 'for example:f0:f6:1c:d9:72:9e'
            },
            newOsVersionComb,
            {
                xtype: 'textfield',
                id: 'releaseVersion',
                fieldLabel: '发布版本',
                emptyText: 'for example:4.1'
            },
            resolutionCombox,
            ramCombox
        ],
        buttons: [
            addBt, resetNewBt]

    });


    var deviceListPanel = Ext.create('Ext.panel.Panel', {

        layout: {
            type: 'form',
            align: 'stretch',
            padding: 5
        },
        items: [
            deviceGridPanel,

            acceptBt, rejectBt
        ]
    });

    if (typeof (deviceWindow) == "undefined") {
        deviceWindow = Ext.create("Ext.window.Window", {
            title: '设备管理',
            style:'opacity: 0.97;',
            id: "deviceWindow",
            layout: "column",
            columnWidth: .7,
            resizable: false,
            closeAction: "hide",
            minimizable: true,
            listeners: {
                minimize: function () {
                    var me = this;
                    me.hide();
                },
                "close": function () {
                    Ext.MessageBox.confirm("警告", "确认关闭这边窗口吗?", function (btn) {
                        if (btn == 'yes') {
                            //   deviceWindow.close();
                            deviceWindow.destroy();
                        } else {
                            deviceWindow.show();
                        }
                    });
                }
            },

            items: [

                {
                    columnWidth: 7,
                    items: [searchPanel, addNewPanel]
                },

                {
                    columnWidth: .7,
                    items: [deviceListPanel]
                }

            ]
        });
    }
    return{
        init: function () {
            // deviceWindow.show();
        },
        showDiviceWindow: function () {
            deviceWindow.show();
        },
        getWindowId: function () {
            return deviceWindow.getId();
        }
    }
}