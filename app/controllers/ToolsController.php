<?php

use Illuminate\Support\Facades\DB;

class ToolsController extends BaseController
{

    /*
    |--------------------------------------------------------------------------
    | Default Tools Controller
    |--------------------------------------------------------------------------
    |create by hekun 2015-1-23
    |
    |
    */

        /*
         * get sms code
         * */
    public function getSmsCode()
    {

        $mobile = Input::get('mobile');

//        $smsString = DB::connection('qa_queue_db_0')->select("select sCallBack from t_queue_5 where sCallBack like '%" . $mobile . "%' order by iCreateTime desc limit 1;");
//         $jsonEncodeString=explode("\\\\u3011\\\\u9a8c\\\\u8bc1\\\\u7801",json_encode($smsString[0]))[1];
//        $smsCode=explode("\\\\",$jsonEncodeString)[0];
        //   $smsString = DB::connection('qa_service_db')->select("select sMessage from t_sms where sCellPhone like '%" . $mobile . "%' order by iAutoID desc limit 1;");
        // DB::disconnect('qa_queue_db_0');


        //  $smsString = DB::connection('online_service_db')->select("select sMessage from t_sms where sCellPhone like '%" . $mobile . "%' order by iAutoID desc limit 1;");
        $smsString = DB::connection('qa_queue_db_0')->select("select sCallBack from t_queue_5 where sCallBack like '%" . $mobile . "%' order by iCreateTime desc limit 1;");
        $jsonEncodeString = explode('sMsg\":\"', json_encode($smsString[0]))[1];
        $jsonEncodeString2 = explode('iPriority', $jsonEncodeString)[0];
        $jsonEncodeString2 = str_replace("\\\\", "\\", $jsonEncodeString2);
        $result = substr($jsonEncodeString2, 0, -5);
        // $jsonEncodeString=explode("\\\\u3011\\\\u9a8c\\\\u8bc1\\\\u7801",json_encode($smsString[0]))[1];
        // $smsCode=explode("\\\\",$jsonEncodeString)[0];
        // DB::disconnect('online_queue_db_0');
        //return json_encode($jsonEncodeString2);
        return $this->decodeUnicode($result);


    }


    /*
 * get sms code
 * */
    public function getSmsCodeOnline()
    {

        $sMobile=Input::get('mobile');
        $bid=Input::get('bid');
       // $bid=12;
        //get cookie
        $cookie_jar = tempnam('./tmp','JSESSIONID');
        $url = "http://*.*.com/sh/site/login.html";
        $fields = array(
            'act'=>'submit' ,
            'username'=>'*' ,
            'password'=>'*'
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_jar);
        curl_setopt($ch, CURLOPT_POST, 1);
         curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        ob_start();
        curl_exec($ch);
        curl_close($ch);
        $return= ob_get_contents();
        ob_clean();

        //get smscode
        $urlGetCode = "http://*e.*com/*/common/*/sms.html?sMobile=".$sMobile."&bid=".$bid;
        $curl = curl_init();
        //设置抓取的url
        curl_setopt($curl, CURLOPT_URL, $urlGetCode);
        //设置头文件的信息作为数据流输出
        //curl_setopt($curl, CURLOPT_HEADER, 1);
        curl_setopt($curl, CURLOPT_COOKIEFILE, $cookie_jar);
        //设置获取的信息以文件流的形式返回，而不是直接输出。
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        //执行命令
        $data = curl_exec($curl);
        //关闭URL请求
        curl_close($curl);

        return $data;

    }

    /*
* get sms with the php-expect
* */
    public function getSmsOnline(){
        $mobile = Input::get('mobile');
        $logfile="/home/apacheUser/temp4autotestsys/".time().rand(11,99).".log";
        ini_set("expect.timeout",3);
        ini_set("expect.loguser","Off");
        ini_set("expect.logfile",$logfile);
        $cases = array (
            array (0 => "yes/no", 1 => "YESNO", EXP_EXACT),
            array (0 => "'s password:", 1 => "PASSWORD", EXP_EXACT),
            array (0 => "bash-4.1$", 1 => "EXPECTSHELL", EXP_EXACT),
            array (0 => "选择服务器:",1 => "SERVER",EXP_EXACT),
            array (0 => "请选择账号:",1=>"ZHANGHAO",EXP_EXACT),
            array (0 => "mysql>",1=>"MYSQL",EXP_EXACT),
            array (0 => "(\-{5})\+(\d|\D)*",1=>"MATCH",EXP_REGEXP),
            array(0=>"in set",1=>"INSET",EXP_EXACT)
        );
        $stream=expect_popen("ssh*7@1*53");
        while(true){
            switch ( expect_expectl($stream,$cases)){
                case "YESNO":
                    fwrite($stream,"yes\r");
                    break;
                case "PASSWORD":
                    fwrite($stream,"*\r");
                    break;
                case "SERVER":
                    fwrite($stream,"0\n");
                    usleep (300000);
                    fwrite($stream,"\r");
                    usleep(100000);
                    break;
                case "ZHANGHAO":
                    fwrite($stream,"0\r");
                    break;
                case "EXPECTSHELL":
                    fwrite($stream,"mysql -u ** -*@l1 -h *\r");
                    break 2;
                case EXP_TIMEOUT:
                case EXP_EOF:
                    break 2;
                default:
                    break 2;

            }
        }
        $time=0;
        while(true){
            switch ( expect_expectl($stream,$cases,$match)){
                case "EXPECTSHELL":
                    fwrite($stream,"mysql *\r");
                    break;
                case "MYSQL":
                    if($time<2){
                        fwrite($stream,"use service_db;\r");
                        fwrite($stream,"select sMessage from t_sms_log where sMobile=$mobile order by iAutoID desc limit 1;\r");
                        $time=$time+1;
                    }
                    break;
                case EXP_TIMEOUT:
                case EXP_EOF:
                    break 2;
                default:
                    break 2;

            }
        }
        fclose($stream);
     return $logfile;
    }

    /*
* get sToken code
* */
    public function readLogFile()
    {

        $logfile = Input::get('logfile');
        $content = file_get_contents($logfile);
        $message=explode("----------+","$content");
        $smessageTrue=explode("|",$message[2]);
        unlink($logfile);
        return $smessageTrue[1];

    }

    /*
* get sToken code
* */
    public function getStoken()
    {

        $mobile = Input::get('mobile');

        $smsString = DB::connection('qa_user_db')->select("select sToken from t_user_login_status where iUserID=(select iAutoID from
        t_user where sMobile= " . $mobile . ") order by iAutoID desc limit 1;");
        return json_encode($smsString);

    }


    /*
* get sToken online
* */
    public function getSTokenOnline()
    {

        $mobile = Input::get('mobile');
        $logfile="/home/apacheUser/temp4autotestsys/".time().rand(11,99).".log";
        ini_set("expect.timeout",3);
        ini_set("expect.loguser","Off");
        ini_set("expect.logfile",$logfile);
        $cases = array (
            array (0 => "yes/no", 1 => "YESNO", EXP_EXACT),
            array (0 => "'s password:", 1 => "PASSWORD", EXP_EXACT),
            array (0 => "bash-4.1$", 1 => "EXPECTSHELL", EXP_EXACT),
            array (0 => "选择服务器:",1 => "SERVER",EXP_EXACT),
            array (0 => "请选择账号:",1=>"ZHANGHAO",EXP_EXACT),
            array (0 => "mysql>",1=>"MYSQL",EXP_EXACT)
        );
        $stream=expect_popen("ssh *@1*");
        while(true){
            switch ( expect_expectl($stream,$cases)){
                case "YESNO":
                    fwrite($stream,"yes\r");
                    break;
                case "PASSWORD":
                    fwrite($stream,"*\r");
                    break;
                case "SERVER":
                    fwrite($stream,"0\n");
                    usleep (300000);
                    fwrite($stream,"\r");
                    usleep(100000);
                    break;
                case "ZHANGHAO":
                    fwrite($stream,"0\r");
                    break;
                case "EXPECTSHELL":
                    fwrite($stream,"mysql -u*@l1 *P*\r");
                    break 2;
                case EXP_TIMEOUT:
                case EXP_EOF:
                    break 2;
                default:
                    break 2;

            }
        }
        $time=0;
        while(true){
            switch ( expect_expectl($stream,$cases)){
                case "EXPECTSHELL":
                    fwrite($stream,"mysql*@l1 -h 1*\r");
                    break;
                case "MYSQL":
                    if($time<2){
                        fwrite($stream,"use user_db;\r");
                        fwrite($stream,"select sToken from t_user_login_status where iUserID=(select iAutoID from
        t_user where sMobile= " . $mobile . ") order by iAutoID desc limit 1;\r");
                        $time=$time+1;
                    }
                    break;
                case EXP_TIMEOUT:
                case EXP_EOF:
                    break 2;
                default:
                    break 2;

            }
        }
        fclose($stream);
        return $logfile;
    }


    /*
* get sToken online
* */
    public function getFlushMemory()
    {
        $result= exec("sudo /usr/bin/expect ../app/script/flush_memory",$result1);
        $message="flush memory failed!";
        foreach($result1 as $item)
            if(strstr($item,"OK")){
                $message="flush memory success!";
                break;
            };
        return $message;

    }

    /*
* get getCloneResp
* */
    public function getCloneResp()
    {
        try{
        $testName=Input::get('testName');
        $codeOperate=App::make("codeOperateBll");
        $result=$codeOperate->cloneResp($testName);
    }catch(Exception $e){
            return $e;
            return "failed";
        }
       return $result;
    }

    /*
* check the repexist
* */
    public function checkRepExist()
    {
        try{
            $testName=Input::get('testName');
            $codeOperate=App::make("codeOperateBll");
            $result=$codeOperate->checkRepExist($testName);
        }catch(Exception $e){
            return $e;
            return "failed";
        }
        return $result;
    }

    /*
* get getUserRep
* */
    public function getUserRep()
    {
        $userId=Input::get('userId');
        $userRep= DB::table('user_repertory')->where('userId', $userId)->get();
        if(count($userRep)>0){
            return $userRep;
        }else{
            return "{'istatus':0,'info':'user doesn't exist'}";
        }
    }


    function decodeUnicode($str)
    {
        return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', create_function('$matches', 'return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");'), $str);
    }


    function unicode_decode($name)
    {
        $pattern = '/([\w]+)|(\\\u([\w]{4}))/i';
        preg_match_all($pattern, $name, $matches);
        if (!empty($matches)) {
            $name = '';
            for ($j = 0; $j < count($matches[0]); $j++) {
                $str = $matches[0][$j];
                if (strpos($str, '\\u') === 0) {
                    $code = base_convert(substr($str, 2, 2), 16, 10);
                    $code2 = base_convert(substr($str, 4), 16, 10);
                    $c = chr($code) . chr($code2);
                    $c = iconv('UCS-2', 'UTF-8', $c);
                    $name .= $c;
                } else {
                    $name .= $str;
                }
            }
        }
        return $name;
    }

}
