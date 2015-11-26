<?php
/**
 * Created by PhpStorm.
 * User: hekun
 * Date: 15-3-13
 * Time: 下午4:28
 */

namespace bll;

class AutoloadFile
{
    public static function bllLoad($classname)
    {
        $filename = "../app/bll/" . $classname . "php";
        if (file_exists($filename)) {
            require_once $filename;
        }
    }
}

?>