<?php
{
    /**
 * Created by PhpStorm.
 * User: hekun
 * Date: 15-1-29
 * Time: 下午5:16
 */

require("smtp.php");


$smtpusermail = "设备管理";
//收件人邮箱


$smtpemailto = "*@*.com.cn";


$mailsubject = "设备变更提醒";
//邮件内容
$mailbody = "PHP+MySQL";//邮件格式（HTML/TXT）,TXT为文本邮件


$mailtype = "TXT";//这里面的一个true是表示使用身份验证,否则不使用身份验证.
$smtp = new smtp();//是否显示发送的调试信息$smtp->debug = TRUE;
//发送邮件
$smtp->sendmail($smtpemailto, $smtpusermail, $mailsubject, $mailbody, $mailtype);


}