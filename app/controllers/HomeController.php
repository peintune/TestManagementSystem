<?php

class HomeController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function showWelcome()
	{
		return View::make('hello');
	}
    public function doLogin()
    {
        $name = Input::get('username');
        $password = Input::get('password');
        if($name=='hekun'){
            return View::make('home');
        }else{
           echo "user name not correct";
        }

    }
    public  function goHome(){

            return View::make('home');

    }
}
