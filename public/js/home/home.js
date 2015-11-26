/**
 * Created by hekun on 15-1-7.
 */

var Global=null;
Ext.application({
    name   : 'MyApp',
    bodyStyle:"background-image:url('/img/loginBackground.jpg');padding:55px 5px 0",
    launch : function() {

        /*
        * set global info
        * */
       Global=new pinganfang.ats.global.Global();

        Ext.Ajax.request({
            url: 'checkLogin',
            method:'POST',
            success: function (response) {
                var response= Ext.util.JSON.decode(response.responseText);
                if(response.length>0){
                    Global.userId=response[0].id;
                    Global.username=response[0].name;
                    Global.userRole=response[0].roleId;
                    Global.isLogin=true;
                    Global.roleName=response[0].roleId==1?'admin':'user';
                }
            }
        });



        /*
        * device manage
        * */

         var deviceButton=Ext.get("deviceBt");
        deviceButton.on({
          click:function(){
              var manage= new pinganfang.ats.device.Manage();
              var windowId=manage.getWindowId();

            var deviceWindow=  Ext.getCmp(windowId);

              if(null==deviceWindow||typeof (deviceWindow)=="undefined"){
                  manage.showDiviceWindow();
                  //Ext.getCmp(windowId).show();
              }else if(Ext.getCmp(windowId).hidden){
                  Ext.getCmp(windowId).show();
              }else{
                  Ext.getCmp(windowId).hide();
              }
          }
        });


        /*
        * project manage
        * */
        var projectButton=Ext.get("projectBt");


        /*
        * user login
        * */
        var userButton=Ext.get("userBt");
        userButton.on({
            click:function(){
                var login= new pinganfang.ats.user.User();
                var loginWindowId=login.getWindowId();

                var loginWindow=  Ext.getCmp(loginWindowId);
                if(null==loginWindow||typeof (loginWindow)=="undefined"){
                   login.showLoginWindow();
                  // Ext.getCmp(loginWindowId).show();
                }else if(Ext.getCmp(loginWindowId).hidden){
                    Ext.getCmp(loginWindowId).show();
                }else{
                    Ext.getCmp(loginWindowId
                    ).hide();
                }
            }
        });


        /*
         * user login
         * */
        var toolsButton=Ext.get("toolsBt");
        toolsButton.on({
            click:function(){
                var tools= new pinganfang.ats.tools.Tools();
                var toolsWindowId=tools.getWindowId();

                var toolsWindow=  Ext.getCmp(toolsWindowId);
                if(null==toolsWindow||typeof (toolsWindow)=="undefined"){
                    tools.showToolsWindow();
                    // Ext.getCmp(loginWindowId).show();
                }else if(Ext.getCmp(toolsWindowId).hidden){
                    Ext.getCmp(toolsWindowId).show();
                }else{
                    Ext.getCmp(toolsWindowId
                    ).hide();
                }
            }
        });


    }
})