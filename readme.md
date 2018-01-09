
## 介绍：
这个测试管理系统是基于laravel开发的，前端JS用的是extjs的控件。主要用到了extjs的窗口控件，把整个网页做出和苹果(mac)界面类似的界面。

## 快速安装搭建：
#### 在linux服务器上安装php,mysql,apache
```
sudo apt-get update
sudo apt-get install apache2
sudo apt-get install php5
sudo apt-get install php5-gd
sudo apt-get install mycrypt php5-mcrypt
sudo php5enmod mcrypt

```
在 /etc/php/module-available中创建mcrypt.ini

不熟悉的同学可以参考其他更详细的安装步骤：

http://www.banwagong.me/90.html

http://www.linuxidc.com/Linux/2015-08/121986.htm

#### 下载TestManagementSystem

-下载TestManagementSystem解压后制项目到/var/www下面去

- 修改对于数据库配置信息

- 修改/etc/apachec2/avalable-sites

- 重启apache,nginx,php

```
/etc/init.d/nginx start
/etc/init.d/php7.0-fpm start
```

## 通过浏览器打开系统(端口设置在你的apache中设置)：
http://localhost:8080

## 网页界面：

![网页界面](https://github.com/peintune/TestManagementSystem/edit/master/0109_1.jpg)

个人技术博客：blog.jpmovie.cn
