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