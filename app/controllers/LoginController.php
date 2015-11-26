<?php

class LoginController extends BaseController
{

    /*
    |--------------------------------------------------------------------------
    | Default Login Controller
    |--------------------------------------------------------------------------
    |create by hekun 2015-1-23
    |
    |
    */

    public function showWelcome()
    {
        return View::make('hello');
    }

    public function login()
    {

        $name = Input::get('username');
        $passwd = Input::get('password');
        $user = DB::table('users')->where('name', $name)->where('passwd', $passwd)->get();
        $codeName = md5($name . rand());
        if (count($user) > 0) {
            setcookie("uid", $codeName, time() + 3600 * 24);
            $_SESSION[$codeName] = 1;
            DB::update('update users set cookie =?  where name = ?', array($codeName, $name));

            return "{'istatus':1,'info':'login success'}";
        } else {
            return "{'istatus':0,'info':'user name or password error'}";
        }
    }

    public function checkUser()
    {
        $name = Input::get('username');
        $passwd = Input::get('password');
     //   $user = DB::table('users')->where('name', $name)->where('passwd', $passwd)->get();
        $user=  DB::table('users')
            ->join('groups','users.group_id','=','groups.id')
            ->where('users.name',$name)->where('users.passwd',$passwd)
            ->select('users.id as userId','users.name as userName','users.role_id','users.isActive','groups.id as groupId','groups.name as groupName')
            ->get();
        if (count($user) > 0) {
         //   return "{'istatus':1,'info':'username and password right'}";
            return $user;
        } else {
            return "{'istatus':0,'info':'username or password error'}";
        }
    }

    public function checkLogin()
    {
        if (!isset($_SESSION)) {
            return "{'istatus':0,'info':'not login'}";
        } else {
            if (empty($_COOKIE['uid'])) {
                return "{'istatus':0,'info':'not login'}";
            } else {
                $cookie = $_COOKIE["uid"];
                if (isset($_SESSION[$cookie])) {
                    return $user = DB::table('users')->where('cookie', $cookie)->select('id', 'name', 'role_id as roleId')->get();
                } else {
                    return "{'istatus':0,'info':'not login'}";
                }
            }
        }
    }

    public function logout()
    {

        if (!isset($_SESSION)) {
            return "{'istatus':1,'info':'logout'}";
        } else {
            if (empty($_COOKIE['uid'])) {
                return "{'istatus':1,'info':'logout'}";
            } else {
                $cookie = $_COOKIE["uid"];
                if (isset($_SESSION[$cookie])) {
                    unset($_SESSION[$cookie]);
                    return "{'istatus':1,'info':'logout'}";
                } else {
                    return "{'istatus':1,'info':'logout'}";
                }
            }
        }
    }
}
