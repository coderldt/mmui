# redis

## 安装
1. cd /usr/local/sofrware
2. http://download.redis.io/releases/redis-3.2.8.tar.gz
3. tar xzf redis-3.2.8.tar.gz
4. cd redis-3.2.8
5. make
6. make install
7. ./utils/install_server.sh


## 启动
1. /usr/local/bin/redis-server /usr/local/software/redis-3.2.8/redis.conf

## 停止
1. /etc/init.d/redis_6379 stop

## 配置
### path /usr/local/software/redis-3.2.8/redis.conf
1. daemonize no -> yes 后台启动
2. bind 127.0.0.1 -> 0.0.0.0 支持远程连接


## 卸载
1. ps aux | grep redis   首先查看redis是否运行，如果运行先停止服务
2. ls /usr/local/bin/redis-*  查看user下redis的有关文件
3. rm -rf /usr/local/bin/redis-* 删除user下redis相关文件
4. rm -rf redis-3.2.8 删除我们redis的下载安装文件即可完成卸载