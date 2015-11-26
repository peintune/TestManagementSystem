/**
 * Created by hekun on 15-1-16.
 */
Ext.namespace("pinganfang.ats.tools");


pinganfang.ats.tools.Tools = function () {
    var toolsWindow;
    toolsWindow = Ext.getCmp("toolsWindow");

    /**
     * store begin
     */
    var bidStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "12", "name": '用户中心-短信登录'},
            {"id": "4", "name": '用户中心-经纪人注册'},
            {"id": "44", "name": '用户中心-添加银行卡'},
            {"id": "44", "name": '用户中心-提现绑卡'},
            {"id": "9", "name": '用户中心-更改手机号码（旧）'},
            {"id": "8", "name": '用户中心-更改手机号码（新）'},
            {"id": "41", "name": '更改支付密码'},
            {"id": "42", "name": '用户中心-找回支付密码'},
            {"id": "6", "name": '用户中心-找回登录密码'},
            {"id": "4", "name": '用户中心-注册'}

        ]
    });


    /**
     * component begin
     */

    var searchBt = Ext.create('Ext.Button', {
        text: '获取短信验证码',
        style: 'margin-left:60px;margin-top:10px;',
        handler: function () {
            Ext.getCmp('smsCode').setText("数据查询中……");
            Ext.Ajax.request({
                url: 'getSmsCode',
                method:"GET",
                params: {
                    mobile: Ext.getCmp('mobile').getValue()
                },
                success: function (response) {
                    var response =response.responseText;

                    Ext.getCmp('smsCode').setText(response);
                  //  alert(response);
                },
                failure: function (response2, options) {
                    Ext.MessageBox.alert('失败', '没有短信信息');
                    Ext.getCmp('smsCode').setText("");
                }
            });
        }
    });


    var searchBtOnline = Ext.create('Ext.Button', {
        text: '获取短信验证码',
        style: 'margin-top:10px;margin-left:60px;',
        colspan : 1,
        handler: function () {
            Ext.getCmp('smsCodeOnline').setText("数据查询中……");
            Ext.Ajax.request({
                url: 'getSmsOnline',
                method:"GET",
                params: {
                    mobile: Ext.getCmp('mobileOnline').getValue()
                   // bid:Ext.getCmp("bidField").getValue()==""?Ext.getCmp("bidComb").getValue():Ext.getCmp("bidField").getValue()
                },
                success: function (response) {
                    Ext.Ajax.request({
                        url: 'readSMS',
                        method:"GET",
                        params: {
                            logfile: response.responseText
                            // bid:Ext.getCmp("bidField").getValue()==""?Ext.getCmp("bidComb").getValue():Ext.getCmp("bidField").getValue()
                        },
                        success: function (response2) {
                            Ext.getCmp('smsCodeOnline').setText(response2.responseText);
                        },
                        failure: function (response2, options) {
                            Ext.MessageBox.alert('失败', '没有短信信息');
                            Ext.getCmp('smsCodeOnline').setText("");
                        }
                    })

                }
            });
        }
    });


    var sTokenBt = Ext.create('Ext.Button', {
        text: '获取sToke',
        style: 'margin-left:60px;margin-top:10px;',
        handler: function () {
            Ext.getCmp('sTokenCode').setText("数据查询中……");
            Ext.Ajax.request({
                url: 'getSToken',
                method:"GET",
                params: {
                    mobile: Ext.getCmp('mobileOfToken').getValue()
                },
                success: function (response) {
                    var response = Ext.util.JSON.decode(response.responseText);
                    Ext.getCmp('sTokenCode').setText(response[0].sToken);
                },
                failure: function (response2, options) {
                    Ext.MessageBox.alert('失败', '没有想关用户的sToken');
                    Ext.getCmp('sTokenCode').setText("");
                }
            });
        }
    });

    var sTokenBtOnline = Ext.create('Ext.Button', {
        text: '获取sToke',
        style: 'margin-left:60px;margin-top:10px;',
        handler: function () {
            Ext.getCmp('sTokenOnline').setText("数据查询中……");
            Ext.Ajax.request({
                url: 'getSTokenOnline',
                method:"GET",
                params: {
                    mobile: Ext.getCmp('mobileOfTokenOnline').getValue()
                },
                success: function (response) {
                    Ext.Ajax.request({
                        url: 'readSMS',
                        method:"GET",
                        params: {
                            logfile: response.responseText
                        },
                        success: function (response2) {
                            Ext.getCmp('sTokenOnline').setText(response2.responseText);
                        },
                        failure: function (response2, options) {
                            Ext.MessageBox.alert('失败', '没有想关用户的sToken');
                            Ext.getCmp('sTokenOnline').setText("");
                        }
                    })
                }
            });
        }
    });


    var flushMemoryBt = Ext.create('Ext.Button', {
        text: '清除缓存',
        style: 'margin-left:60px;margin-top:10px;',
        handler: function () {
            Ext.getCmp('flushStatus').setText("服务器缓存清除中……");
            Ext.Ajax.request({
                url: 'getFlushMemory',
                method:"GET",
                success: function (response) {
                  //  var response = Ext.util.JSON.decode(response.responseText);
                    Ext.getCmp('flushStatus').setText("测试服务器缓存清除状态："+response.responseText);
                }
            });
        }
    });


   var flushMemoryPanel= {
        // LTR even when example is RTL so that the code can be read
        rtl: true,
            title: '清除缓存',
        layout: 'border',
        style: 'margin-top:20px;',
        items:[
        {
            title:'线下缓存清除',
            region: 'north',
            layout: {
                type: 'table',
                columns: 1,
                style: 'margin-top:20px;'
            },
            xtype:'panel',
            items:[
                flushMemoryBt,
                {
                    style: 'margin-top:40px;margin-left:60px',
                    xtype: 'label',
                    forId: 'flushStatus',
                    id:'flushStatus',
                    text: '测试服务器缓存清除状态：'
                }
            ]
        },
        {
            region: 'south'
            }

    ]
        //   html: '<p style="font-family:verdana;color:red;text-align:center">请注意：只显示当前手机号最新的短信记录</p>'
    }


    var bidComb = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '业务选择',
        colspan : 1,
        store: bidStore,
        matchFieldWidth:false,
        id: 'bidComb',
        hidden :true,
        editable: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        emptyText: '选择业务'
    });
    var codeOperatePanel=new pinganfang.ats.tools.CodeOperate();
        codeOperatePanel .init();
    var toolsTabPanel=Ext.create('Ext.tab.Panel', {
        region: 'center',
        id:'tabPanel',
        items:  [{
            // LTR even when example is RTL so that the code can be read
            rtl: true,
            title: '短信验证码获取',
            layout: 'border',
            style: 'margin-top:20px;',

            items:[
                {
                    title:'线下短信验证码获取',
                    region: 'north',
                    layout: {
                        type: 'table',
                        columns: 2,
                        style: 'margin-top:10px;'
                    },
                    xtype:'panel',
                    items:[
                        {
                            style: 'margin-top:10px;',
                            xtype: 'textfield',
                            id: 'mobile',
                            fieldLabel: '手机号',
                            emptyText: '请输入手机号码'
                        },searchBt,
                        {
                            style: 'margin-top:10px;margin-bottom:10px;background:green;',
                            xtype: 'label',
                            forId: 'smsCodeText',
                            text: '短信验证码：'
                        },
                        {
                            style: 'margin-top:10px;margin-left:-120px;margin-bottom:10px;',
                            xtype: 'label',
                            forId: 'smsCode',
                            id:'smsCode',
                            text: ''
                        }
                    ]
                },

                {
                    title:'线上短信验证码获取',
                    region: 'center',
                    layout: {
                        type: 'table',
                        columns: 2,
                        style: 'margin-top:30px;'
                    },
                    xtype:'panel',
                    items:[
                        {
                            style: 'margin-top:10px;',
                           xtype: 'textfield',
                           id: 'mobileOnline',
                            fieldLabel: '手机号',
                           emptyText: '请输入手机号码'
                        },searchBtOnline,
                        {
                            style: 'margin-top:10px;background:green;',
                            xtype: 'label',
                            forId: 'smsCodeTextOnline',
                            text: '短信验证码：'
                        },
                        {
                            style: 'margin-top:10px;margin-left:60px',
                            xtype: 'label',
                            forId: 'smsCodeOnline',
                            id:'smsCodeOnline',
                            text: ''
                        }
                    ]
                }  ,{
                    region: 'south',
                    html: '<p style="font-family:verdana;color:red;text-align:center">请注意：只显示当前手机号最新的短信记录</p>'
                }


//                {
//                    title:'线上短信验证码获取',
//                    layout: {
//                        type: 'table',
//                        columns: 3
//                    },
//                    style: 'margin-top:30px;',
//                    region: 'center',
//                    xtype:'panel',
//                    items:[
//                        {
//                            style: 'margin-top:10px;',
//                            xtype: 'textfield',
//                            colspan : 3,
//                            id: 'mobileOnline',
//                            fieldLabel: '手机号',
//                            emptyText: '请输入手机号码'
//                        },bidComb,
//                        {
//                            style: 'margin-left:60px;margin-top:10px;',
//                            xtype: 'textfield',
//                            labelWidth:130,
//                            colspan : 2,
//                            id: 'bidField',
//                            fieldLabel: '或者输入业务bid',
//                            emptyText: '如：12',
//                            hidden :true
//                        },
//                        searchBtOnline,
//                        {
//                            style: 'margin-top:10px;background:green;',
//                            xtype: 'label',
//                            colspan : 1,
//                            forId: 'smsCodeTextOnline',
//                            text: '短信验证码：'
//                        },
//                        {
//                            style: 'margin-top:10px;margin-left:60px',
//                            xtype: 'label',
//                            colspan : 1,
//                            forId: 'smsCodeOnline',
//                            id:'smsCodeOnline',
//                            text: ''
//                        }
//                    ]
//                }


            ]
            //   html: '<p style="font-family:verdana;color:red;text-align:center">请注意：只显示当前手机号最新的短信记录</p>'
        },{
            // LTR even when example is RTL so that the code can be read
            rtl: true,
            title: '用户sToken获取',
            layout: 'border',
            style: 'margin-top:20px;',
            items:[
                {
                    title:'线下sToken获取',
                    region: 'north',
                    layout: {
                        type: 'table',
                        columns: 2,
                        style: 'margin-top:20px;'
                    },
                    xtype:'panel',
                    items:[
                        {
                            style: 'margin-top:10px;',
                            xtype: 'textfield',
                            id: 'mobileOfToken',
                            fieldLabel: '手机号',
                            emptyText: '请输入手机号码'
                        },sTokenBt,
                        {
                            style: 'margin-top:10px;background:green;',
                            xtype: 'label',
                            text: 'sToken值：'
                        },
                        {
                            style: 'margin-top:10px;margin-left:-120px',
                            xtype: 'label',
                            forId: 'sTokenCode',
                            id:'sTokenCode',
                            text: ''
                        }
                    ]
                },
                {
                    title:'线上sToken获取',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    style: 'margin-top:70px;',
                    region: 'center',
                    xtype:'panel',
                    items:[
                        {
                            style: 'margin-top:10px;',
                            xtype: 'textfield',
                            id: 'mobileOfTokenOnline',
                            fieldLabel: '手机号',
                            emptyText: '请输入手机号码'
                        },sTokenBtOnline,
                        {
                            style: 'margin-top:10px;background:green;',
                            xtype: 'label',
                            text: 'sToken值：'
                        },
                        {
                            style: 'margin-top:10px;margin-left:-120px',
                            xtype: 'label',
                            forId: 'sTokenOnline',
                            id:'sTokenOnline',
                            text: ''
                        }
                    ]
                },{
                    region: 'south',
                    html: '<p style="font-family:verdana;color:red;text-align:center">请注意：只显示当前手机号最新的sToken记录</p>'
                }

            ]
        },
            flushMemoryPanel,
            Global.isLogin==true?codeOperatePanel.getCodeOperateTabPanel():{
                title: '代码更新',
                html: '<p style="font-family:verdana;color:red;text-align:center">请注意：请先登录才能使用此功能</p>'
            }]
    });

    if (typeof (toolsWindow) == "undefined") {
    toolsWindow = Ext.create('Ext.window.Window', {
        title: '实用工具',
        style:'opacity: 0.97',
        header: {
            titlePosition: 2,
            titleAlign: 'center'
        },
        closable: true,
        closeAction: 'hide',
        id: "toolsWindow",
        maximizable: false,
        minimizable: true,
        width: 900,
        minWidth: 700,
        height: 500,
        listeners: {
            minimize: function () {
                var me = this;
                me.hide();
            },
            "close": function () {
                Ext.MessageBox.confirm("警告", "确认关闭此窗口吗?", function (btn) {
                    if (btn == 'yes') {
                        toolsWindow.destroy();
                    } else {
                        toolsWindow.show();
                    }
                });
            }
        },
        layout: {
            type: 'border',
            padding: 5
        },
       items: [
//            {region: 'west',
//            title: 'Navigation',
//            width: 200,
//            split: true,
//            collapsible: true,
//            floatable: false
//        }, {
           toolsTabPanel]
    });
    }

    return{
        init: function () {
            // toolsWindow.show();
        },
        showToolsWindow: function () {
           // toolsWindow.show();
        },
        getWindowId: function () {
            return toolsWindow.getId();
        }
    }
}