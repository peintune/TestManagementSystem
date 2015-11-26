<?php
{
    /**
 * Created by PhpStorm.
 * User: hekun
 * Date: 15-1-29
 * Time: 下午5:16
 */

    require("smtp2.php");


    $smtpemailto = "*@qq.com";
    $mailsubject = "测试邮件发送";
    $mailbody = "PHP+MySQL";
    $mailtype = "HTML";
    $smtp = new smtp();
    $smtp->debug = TRUE;
    $smtp->sendmail($smtpemailto, $mailsubject, $mailbody, $mailtype);



}