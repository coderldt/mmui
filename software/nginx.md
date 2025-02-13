## 安装nginx
1. 安装 nginx 依赖库, GCC，PCRE，zlib，OpenSSL
yum install -y gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel

2. 下载 nginx 压缩包
wget http://nginx.org/download/nginx-1.16.1.tar.gz

3. 解压 nginx 压缩包
tar -zxvf nginx-1.16.1.tar.gz

4. 进入nginx资源文件，配置 confifigure
./configure

5. 执行make 和 make install
make && make install

6. 启动nginx服务
cd /usr/local/nginx-1.16.1/sbin
./nginx

- 重启 ./nginx -s relaod

## nginx 自动启动
1. 创建 nginx.servise 文件
sudo vi /etc/systemd/system/nginx.service

2. 内容填写
[Unit]
Description=The nginx HTTP and reverse proxy server
After=network.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
Restart=always

[Install]
WantedBy=multi-user.target


3. 重新加载systemd守护进程
sudo systemctl daemon-reload

4. 添加 nginx 自动启动
sudo systemctl enable nginx

5. 检查 nginx 状态
sudo systemctl status nginx

