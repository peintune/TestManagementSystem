<?php

class UserController extends BaseController
{

    /*
    |--------------------------------------------------------------------------
    | Default User Controller
    |--------------------------------------------------------------------------
    |create by hekun 2015-1-23
    |
    |
    */

    public function addNewUser()
    {

        $name = Input::get('username');
        $role = Input::get('role');
        $passwd=md5(123456);
        $user = DB::table('users')->where('name', $name)->get();
        if (count($user) < 1) {
        DB::table('users')->insert(
            array('name' => $name, 'create_timestamp' =>date('Y-m-d H:i:s', time()), 'update_timestamp' => date('Y-m-d H:i:s', time()), 'isActive' => 1,
                'role_id' => $role, 'passwd' => $passwd)
        );
            return "{'istatus':1,'info':'success'}";
        }else{
            return "{'istatus':0,'info':'user exist'}";
        }
    }


    /*
     * get all users
     * */
    public function getAllUsers()
    {

       $users= DB::table('users')->select('id','name')->get();
        if (count($users) > 0) {
            return $users;
        }else{
            return "{'istatus':0,'info':'users not exist'}";
        }
    }

    /*
     * check User exists
     * */
    public function checkUserExist()
    {
        $name = Input::get('username');
        $user = DB::table('users')->where('name', $name)->get();
        if (count($user) < 1) {
            return "{'istatus':0,'info':'users not exist'}";
        }else{
            return "{'istatus':1,'info':'users  exist'}";
        }
    }
 }
