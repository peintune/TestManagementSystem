<?php

/**
 * Created by PhpStorm.
 * User: hekun
 * Date: 15-3-16
 * Time: 上午9:23
 */
class codeOperateBll
{

    public function cloneResp($testName)
    {
        $isExist=$this->isRepExist($testName);
        if($isExist){

         }else{
            $this->getNewRep();
            $repository=file("../app/script/*/repository.list");
            $repositoryOld=file("../app/script/*/repository.list.old");
            $laravel=file("../app/script/*/laravel.list");
            $ss="";
            foreach($repository as $line => $content){
                $ss=$ss."**".$content;
            }
           // return $isExist;
         }
        return $isExist;
    }


    public function isRepExist($repName){

       $logFile= $this->checkRepExist($repName);
       // $content = file_get_contents($logFile);
        return print_r($logFile);

    }

/*
     * 判断测试环境仓库是否存在
     * */
    public function checkRepExist($repName)
    {
        $logfile="/home/apacheUser/temp4autotestsys/".time().rand(11,99).".log";
        ini_set("expect.timeout",3);
        ini_set("expect.loguser","Off");
        ini_set("expect.logfile",$logfile);
        $cases = array (
            array (0 => "yes/no", 1 => "YESNO", EXP_EXACT),
            array (0 => "10.18's password:", 1 => "PASSWORD", EXP_EXACT),
            array (0 => "$", 1 => "EXPECTSHELL", EXP_EXACT)
        );
        $stream=expect_popen("ssh www@*.*.*.18");
        $i=0;
        $result="";
        while(true){
            switch ( expect_expectl($stream,$cases,$match)){
                case "YESNO":
                    fwrite($stream,"yes\r");
                    break;
                case "PASSWORD":
                    fwrite($stream,"www\r");
                    break;
                case "EXPECTSHELL":
                        if($i==1){
                            break 2;
                        }else{
                           fwrite($stream,"mkdir /data1/www/*/$repName\r");
                            fwrite($stream,"mkdir /data1/www/*/$repName\r");
                            fwrite($stream,"mkdir /data1/www/*/cloud/$repName\r");
                            $i=$i+1;
                    break;
                        }
                case EXP_TIMEOUT:
                case EXP_EOF:
                    break 2;
                default:
                    break 2;

            }
        }
        fclose($stream);
        return $logfile;





//        $result = exec("sudo /usr/bin/expect ../app/script/checkRepExist ".$repName,$result1);
//        $isExist = false;
//        foreach($result1 as $item)
//            if(strstr($item,"File exists")){
//                $isExist=true;
//                break;
//            };
//        return $isExist;
    }

    /*
     * 获得远端最新的仓库
     * */
    public function getNewRep()
    {
        $result1="";
        if(file_exists("../app/script/*/repository.list")){
            exec("sudo expect ../app/script/getNewRep noNeedClone",$result1);

        }else{
            exec("sudo expect ../app/script/getNewRep clone",$result1);
        }
    }
}