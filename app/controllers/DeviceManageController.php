<?php
require("smtp.php");
class DeviceManageController extends BaseController
{


    /*
    |--------------------------------------------------------------------------
    | Default Home DeviceManageController
    |--------------------------------------------------------------------------
    |add by hekun 2015/1/21

    */
    /*
     * add new device into db
     * */
    public function addNewDevices()
    {
        $deviceId = Input::get('deviceId');
        $deviceName = Input::get('deviceName');
        $deviceSerials = Input::get('deviceSerials');
        $deviceMac = Input::get('deviceMac');
        $osVersion = Input::get('osVersion');
        $releaseVersion = Input::get('releaseVersion');
        $resolution = Input::get('resolution');
        $ram = Input::get('ram');
        $device = DB::table('devices')->where('deviceId', $deviceId)->get();

        if (count($device) < 1) {
            DB::table('devices')->insert(
                array('deviceId' => $deviceId, 'deviceName' => $deviceName, 'deviceSerials' => $deviceSerials, 'deviceMac' => $deviceMac,
                    'osVersion' => $osVersion, 'releaseVersion' => $releaseVersion, 'resolution' => $resolution, 'ram' => $ram, 'department' => "dispatchCenter",
                    'createtime' => date('Y-m-d H:i:s', time()), 'status' => 0, 'currentOwner' => "dispatchCenter",'lastOwner' => "dispatchCenter")
            );
            return "{'istatus':1,'info':'success'}";
        } else {
            return "{'istatus':0,'info':'device exist'}";
        }

    }

    /*
     * find device by conditions
     * */
    public function listDevices()
    {
        $deviceId = Input::get('deviceId');
        $osVersion = Input::get('osVersion');
        $status = Input::get('status');
        $owner = Input::get('owner');
        $sqlString="select * from devices ";
        if($deviceId!=''){
            $sqlString=$sqlString."where deviceId=".$deviceId;
        }
        if($osVersion!=''){
            if($deviceId!=''){
            $sqlString=$sqlString." and  osVersion=".$osVersion;
            }else{
                $sqlString=$sqlString." where osVersion=".$osVersion;
            }
        }
        if($status!=''){
            if($deviceId!=''||$osVersion!=''){
            $sqlString=$sqlString." and  status=".$status;
            }else{
                $sqlString=$sqlString." where status=".$status;
            }
        }

        if($owner!=''){
            if($deviceId!=''||$osVersion!=''||$status!=''){
                $sqlString=$sqlString." and  currentOwner='".$owner."'";
            }else{
                $sqlString=$sqlString." where currentOwner='".$owner."'";
            }
        }

        $results = DB::select($sqlString);

        return $results;

    }

    /*
     * transform the device to another device owner
     * */

    public function transferDevice()
    {
        $deviceId = Input::get('deviceId');
        $lastOwner = Input::get('lastOwner');
        $currentOwner = Input::get('currentOwner');
        $deviceTransfer = DB::table('deviceTransfer')->where('deviceId', $deviceId)->where('isAccept', 0)->get();
        $status=1;
        if($currentOwner=='dispatchCenter'){
            $status=0;
        }
        DB::update('update devices set currentOwner = ?,modifitime=?,status=? where deviceId = ?', array($currentOwner,date('Y-m-d H:i:s', time()),$status,$deviceId));
        if(count($deviceTransfer)<1){
            DB::table('deviceTransfer')->insert(
                array('deviceId' => $deviceId, 'modifitime' =>  date('Y-m-d H:i:s', time()), 'currentOwner' => $currentOwner, 'lastOwner' => $lastOwner,
                    'isAccept' => 0)
            );


            /*
     * send email notification
     * */
            $device = DB::table('devices')->where('deviceId', $deviceId)->pluck('deviceName');
            $smtpemailto = $currentOwner."@*.com.cn";
            if($currentOwner=="dispatchCenter"){
                $smtpemailto="*@*.com.cn";
            }
            $mailsubject = "测试设备转让通知";
            $mailbody = "<p>你好，".$currentOwner.":</p>"."<p>   ".$lastOwner."将设备 '".$device."',deviceId: '".$deviceId."' 转送给了你。<p/>"."<p>  请在系统http://192.168.10.19:88 中接收</p>"."<p>   请勿回复此邮件，测试设备管理系统</p>";
            $mailtype = "HTML";
            $smtp = new smtp();
            $smtp->debug = TRUE;
            $smtp->sendmail($smtpemailto, $mailsubject, $mailbody, $mailtype);

            return "{'istatus':1,'info':'success'}";
        }else{
            DB::update('update deviceTransfer set currentOwner = ?, modifitime=? where deviceId = ? and isAccept=0', array($currentOwner,date('Y-m-d H:i:s', time()),$deviceId));
            return "{'istatus':1,'info':'success'}";
        }

    }


    /*
     * accept device
     * */

    public function acceptDevice()
    {
        $deviceId = Input::get('deviceId');
        $currentOwner = Input::get('currentOwner');
        $lastOwner = Input::get('lastOwner');
        $status=1;
        if($currentOwner=='dispatchCenter'){
            $status=0;
        }
        DB::update('update devices set lastOwner = ?,modifitime=?,status=? where deviceId = ?', array($currentOwner,date('Y-m-d H:i:s', time()),$status,$deviceId));
        DB::update('update deviceTransfer set lastOwner = ?, modifitime=?,isAccept=1 where deviceId = ? and isAccept=0', array($currentOwner,date('Y-m-d H:i:s', time()),$deviceId));

        /*
         * send email notification
         * */
        $device = DB::table('devices')->where('deviceId', $deviceId)->pluck('deviceName');
        $smtpemailto = $lastOwner."@*.com.cn";
        if($lastOwner=="dispatchCenter"){
            $smtpemailto="*@*.com.cn";
        }
        $mailsubject = "测试设备转出成功";
        $mailbody = "<p>你好，".$lastOwner.":</p>"."<p>   ".$currentOwner."将设备  '".$device."',deviceId: '".$deviceId."' 成功接收了。<p/>"."<p>   请勿回复此邮件，测试设备管理系统</p>";
        $mailtype = "HTML";
        $smtp = new smtp();
        $smtp->debug = TRUE;
        $smtp->sendmail($smtpemailto, $mailsubject, $mailbody, $mailtype);
            return "{'istatus':1,'info':'success'}";
    }

    /*
   * reject device
   * */

    public function rejectDevice()
    {
        $deviceId = Input::get('deviceId');
        $lastOwner = Input::get('lastOwner');
        $currentOwner = Input::get('currentOwner');
        $status=1;
        if($lastOwner=='dispatchCenter'){
            $status=0;
        }
        DB::update('update devices set currentOwner = ?,modifitime=?,status=? where deviceId = ?', array($lastOwner,date('Y-m-d H:i:s', time()),$status,$deviceId));
        DB::update('update deviceTransfer set currentOwner = ?, modifitime=?,isAccept=1 where deviceId = ? and isAccept=0', array($lastOwner,date('Y-m-d H:i:s', time()),$deviceId));

        /*
     * send email notification
     * */
        $device = DB::table('devices')->where('deviceId', $deviceId)->pluck('deviceName');
        $smtpemailto = $lastOwner."@*.com.cn";
        if($lastOwner=="dispatchCenter"){
            $smtpemailto="*@*.com.cn";
        }
        $mailsubject = "设备转出失败";
        $mailbody =  $mailbody = "<p>你好，".$lastOwner.":</p>"."<p>   ".$currentOwner."将设备 '".$device."',deviceId: '".$deviceId."' 拒绝接收。<p/>"."<p>   请勿回复此邮件，测试设备管理系统</p>";;
        $mailtype = "HTML";
        $smtp = new smtp();
        $smtp->debug = TRUE;
        $smtp->sendmail($smtpemailto, $mailsubject, $mailbody, $mailtype);
        return "{'istatus':1,'info':'success'}";
    }
}
