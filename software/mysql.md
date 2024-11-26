## 安装 mysql
1. 检查并卸载旧版本的 MySQL 或 MariaDB
``` bash
  rpm -qa | grep mariadb
  sudo rpm -e --nodeps <包名>  # 卸载MariaDB
  sudo rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64
  rpm -qa | grep mysql
  sudo yum remove mysql mysql-server mysql-libs mysql-devel  # 卸载MySQL
```

2. 下载 mysql 安装包
wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm

3. 下载 rpm 文件
sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm

3.1 提示验证签名错误
warning: mysql57-community-release-el7-11.noarch.rpm: Header V3 DSA/SHA1 Signature, key ID 5072e1f5: NOKEY

解决
``` bash
  rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
  sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm
  # 设置完成后 sudo rpm -ivh 还是报错, 不管直接运行下面(不太清除)
  yum install mysql-server -y
```

4. 启动 mysql
systemctl start mysqld

5. 查看 mysql 状态
systemctl status mysqld

6. 查看密码
cat /var/log/mysqld.log | grep password

7. 登录修改密码
``` shell
  mysql -uroot -p
  ALTER USER 'root'@'localhost' IDENTIFIED BY '你的密码';
```


8. 新增用户并授权 * 访问
``` shell
  CREATE USER 'newuser'@'%' IDENTIFIED BY 'newpassword';
  FLUSH PRIVILEGES;
```

9. 开机自启(没有执行, 但好像已经开机自启了)
sudo systemctl enable mysqld
