<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

//Route::get('/', function()
//{
//	return View::make('home');
//});

Route::get('/','HomeController@goHome');

//Route::get('login','HomeController@goHome');
Route::get('login',function()
{
	return View::make('login');
});

Route::post('login','LoginController@postLogin');

Route::get('users',function(){
//return 'Users!';
$users=User::all();
echo $users;
//return "dfd";
return View::make('users');
//die();
//return View::make('users'->with('users',$users));
});

// route to show the login form
Route::get('home', array('uses' => 'HomeController@doLogin'));


Route::post('addDevice', 'DeviceManageController@addNewDevices');

Route::post('searchDevices', 'DeviceManageController@listDevices');

Route::post('login', 'LoginController@login');

Route::post('checkLogin', 'LoginController@checkLogin');

Route::post('logout', 'LoginController@logout');

Route::post('addNewUser', 'UserController@addNewUser');

Route::post('checkUser', 'LoginController@checkUser');

Route::get('checkUser', 'LoginController@checkUser');

Route::get('getAllUsers', 'UserController@getAllUsers');

Route::post('transferDevice', 'DeviceManageController@transferDevice');

Route::post('checkUserExist', 'UserController@checkUserExist');

Route::post('acceptDevice', 'DeviceManageController@acceptDevice');

Route::post('rejectDevice', 'DeviceManageController@rejectDevice');

Route::get('getSmsCode','ToolsController@getSmsCode');

Route::get('getSmsOnline','ToolsController@getSmsOnline');

Route::get('readSMS','ToolsController@readLogFile');

Route::get('getSmsCodeOnline','ToolsController@getSmsCodeOnline');

Route::get('getSToken','ToolsController@getSToken');

Route::get('getSTokenOnline','ToolsController@getSTokenOnline');

Route::get('getFlushMemory','ToolsController@getFlushMemory');

Route::get('getUserRep','ToolsController@getUserRep');

Route::get('addOrReleateRep','ToolsController@getCloneResp');

Route::get('checkResp','ToolsController@checkRepExist');


// route to process the form


