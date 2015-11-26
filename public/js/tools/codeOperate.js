/**
 * Created by hekun on 15-3-17.
 */
Ext.namespace("pinganfang.ats.tools");

pinganfang.ats.tools.CodeOperate = function () {

    var isNewUser=true;

    var addCodeRepBt = Ext.create('Ext.Button', {
        text: '增加或关联测试环境',
        style: 'margin-left:60px;margin-top:10px;',
        handler: function () {
            Ext.Ajax.request({
                url: 'checkResp',
                method:"GET",
                params: {
                    testName: Ext.getCmp('addCodeRep').getValue()
                },
                success: function (response) {
                  //  var response =response.responseText;

                //    Ext.getCmp('smsCode').setText(response);
                    //  alert(response);
                }
            });
        }
    });

    var codeOperatePanel= {
        rtl: true,
        title: '测试环境代码操作',
        layout: 'border',
        style: 'margin-top:20px;',
        items:[
            {
                region: 'north',
                layout: {
                    type: 'table',
                    columns: 1,
                    style: 'margin-top:20px;'
                },
                xtype:'panel',
                items:[
                    ,addCodeRepBt

                ]
            },
            {
                region: 'south'
            }

        ]
    }

    var addCodeRepertoryPanel= {
        rtl: true,
        title: '测试环境代码操作',
        layout: 'border',
        style: 'margin-top:20px;',
        items:[
            {
                region: 'north',
                layout: {
                    type: 'table',
                    columns: 1,
                    style: 'margin-top:20px;'
                },
                xtype:'panel',
                items:[
                    {
                        style: 'margin-top:10px;',
                        xtype: 'textfield',
                        labelWidth:200,
                        width:500,
                        id: 'addCodeRep',
                        fieldLabel: '新建或关联一个测试环境',
                        emptyText: '请输入测试环境的名字,如:hekun'
                    },addCodeRepBt
                ]
            },
            {
                region: 'south',
      html: '<p style="font-family:verdana;color:red;text-align:center">请注意：若测试服务器没有当前测试环境，会在测试服务器新建一个</p>'
            }

        ]

    }

    return{
        init: function () {
            Ext.Ajax.request({
                url: 'getUserRep',
                method: 'GET',
                success: function (response) {
                    if(typeof (response.responseText)!="string"){
                        response=Ext.util.JSON.decode(response.responseText);
                    }else{
                        response=response.responseText;
                    }
                   if(response.indexOf("istatus':0")!=-1){
                       isNewUser=true;
                    }else{
                       isNewUser=false;

                    }
                }
            });
           //return addCodeRepertoryPanel;
        },
        getCodeOperateTabPanel: function () {
            if(isNewUser){
                return addCodeRepertoryPanel;
            }else{
                return codeOperatePanel;
            }
        }
    }
}