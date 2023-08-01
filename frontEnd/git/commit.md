## commit 提交规范

### 前提
  - node >= 14.20.1
### 步骤
#### commitizen 全局按照，提交commit格式插件
  - 全局安装 commitizen cz-conventional-changelog
  - echo '{"path": "cz-conventional-changelog"}' > ~/.czrc
#### husky commitlint 校验 commit 内容格式
  - yarn add husky @commitlint/cli @commitlint/config-conventional
  - echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
  - npx husky install // 生成 husky 文件
  - npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
#### 自定义
[链接](https://blog.csdn.net/weixin_52834435/article/details/126253581)
``` json
  // package.json
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
      // "path": "./node_modules/cz-customizable"
    }
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
```

## 版本控制和生成Changelog
  - 全局安装 conventional-changelog-cli
  - 本地安装 standard-version 必须全局有包，不然会安装失败，在项目中使用需小心
  - script "release": "standard-version"

## 注意
> 新下载的项目 需要 "prepare": "husky install"，才能校验