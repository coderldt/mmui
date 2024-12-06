## 安装 docker
1. sudo yum update -y
2. sudo yum install -y yum-utils device-mapper-persistent-data lvm2
3. sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
4. sudo yum install -y docker-ce docker-ce-cli containerd.io
5. sudo systemctl start docker
6. sudo systemctl enable docker

