/**
 * Created by hekun on 15-1-16.
 */
Ext.namespace("pinganfang.ats.user");


pinganfang.ats.user.User = function () {
    var loginWindow;
    loginWindow = Ext.getCmp("loginWindow");


    /*
     * stores begins
     * */


    /*
     * components begins
     * */

    var resetBt = Ext.create('Ext.Button', {
        text: '重置',
        handler: function () {
            Ext.getCmp('username').reset();
            Ext.getCmp('password').reset();
        }
    });

    var loginPanel=Ext.create('Ext.form.Panel', {
        labelWidth:150,
        monitorValid:true,
        baseCls:'x-plain',
        style: 'margin-top:30px;margin-left:1px;',
        defaults:{
            width:150
        },
        defaultType:'textfield',
        items:[
            {
                fieldLabel:'用户名',
                id:'username',
                name:'userName',
                allowBlank:false,
                width:250,
                blankText:'please input username'
            },{
                fieldLabel:'密码',
                id:'password',
                name:'password',
                width:250,
                inputType:'password',
                allowBlank:false,
                blankText:'please input password'
            }
        ],
        buttons:[
            {
                text:'登录',
                formBind:true,
                type:'submit',
                handler:function(){
                    Ext.Ajax.request({
                        url: 'login',
                        params: {
                            username: Ext.getCmp('username').value,
                            password: hex_md5(Ext.getCmp('password').getValue())
                        },
                        success: function (response) {

                            var response= Ext.util.JSON.decode(response.responseText);

                            loginPanel.hide();
                            location="javascript:location.reload()";

                        }
                    });
}

            },resetBt
        ]

    })

    var addNewUserBt = Ext.create('Ext.Button', {
        text: '增加新用户',
        id: 'addUserbt',
        handler: function () {
            Ext.Ajax.request({
                url: 'addNewUser',
                method:'POST',
                params: {
                    username: Ext.getCmp('newUserName').value,
                    role: roleCombox.getValue()
                },
                success: function (response) {
                    var response= Ext.util.JSON.decode(response.responseText);
                    if(response.istatus!=1){
                        Ext.Msg.alert('警告',"增加新用户失败，"+response.info);
                    }else{
                        Ext.Msg.alert("成功",'增加新用户成功');
                    }

                }
            });

        }
    });

    var roleStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {"id": "1", "name": 'Admin'},
            {"id": "2", "name": 'User'}

        ]
    });

    var roleCombox = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '用户角色',
        store: roleStore,
        id: 'roleCombo',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
        valueField: 'id',
        emptyText: '选择用户角色'
    });

    var resetRoleBt = Ext.create('Ext.Button', {
        text: '重置',
        handler: function () {
            Ext.getCmp('newUserName').reset();
            roleCombox.reset();
        }
    });


    var addNewUserWindow = Ext.create("Ext.window.Window", {
        title: '增加',
        id: "addUser",
        layout: "form",
        resizable: false,
        closeAction: "hide",
        width:350,
        height:200,
        modal:true,
        minimizable: true,
        listeners: {
            minimize: function () {
                var me = this;
                me.hide();
            },
            "close": function () {
                Ext.MessageBox.confirm("警告", "确认关闭这个窗口吗?", function (btn) {
                    if (btn == 'yes') {
                        loginWindow.destroy();
                    } else {
                        loginWindow.show();
                    }
                });
            }
        },

        items: [
            {
                xtype: 'textfield',
                id: 'newUserName',
                fieldLabel: 'User Name'
            },
            roleCombox
        ],
        buttons:[
            addNewUserBt,resetRoleBt]
    });

    var userInfoPanel=Ext.create('Ext.Panel', {
        labelWidth:350,
        monitorValid:true,
        layout: 'border',
        style: 'margin-top:30px;margin-left:1px;',
        items:[
            { region:'north',
                xtype: 'label',
                id: 'label1',
                text: 'Welcome : '+Global.username,
                width:300

            },
            {region:'center',
                xtype: 'label',
                id: 'label2',
                hidden:false,
                text:'your role is : '+Global.roleName,
                width:250
            }
        ],
        buttons:[
            {
                text:'注销',
                formBind:true,
                handler:function(){
                    Ext.Ajax.request({
                        url: 'logout',
                        method:'POST',

                        success: function (response) {
                            var response= Ext.util.JSON.decode(response.responseText);
                                loginWindow.hide();
                                location="javascript:location.reload()";
                                Global.userId=null;
                               Global.username=null;
                               Global.userRole=null;
                              Global.isLogin=false;
                        }
                    });
                }

            },
            {
                text:'增加新用户',
                formBind:true,
                hidden:Global.userRole==1?false:true,
                handler:function(){
                    addNewUserWindow.show();
                }

            }

        ]

    })

    if (typeof (loginWindow) == "undefined") {
        loginWindow = Ext.create("Ext.window.Window", {
            title: '登录',
            id: "loginWindow",
            layout: "fit",
            resizable: false,
            closeAction: "hide",
            width:350,
            height:200,
            modal:true,
            minimizable: true,
            listeners: {
                minimize: function () {
                    var me = this;
                    me.hide();
                },
                "close": function () {
                    Ext.MessageBox.confirm("警告", "确定关闭此窗口？", function (btn) {
                        if (btn == 'yes') {
                            loginWindow.destroy();
                        } else {
                            loginWindow.show();
                        }
                    });
                }
            },

            items: Global.isLogin==true?userInfoPanel:loginPanel
        });
    }
    return{
        init: function () {
            // deviceWindow.show();
        },
        showLoginWindow: function () {
            loginWindow.show();
        },
        getWindowId: function () {
            return loginWindow.getId();
        }
    }
}