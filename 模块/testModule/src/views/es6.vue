<template>
  <div>
    <div class="title">es6</div>
    <div>{{ data }}</div>
    <div>{{ name }}</div>
    <p>
      通过import导入的普通类型不可改变，引用数据类型可以改变
    </p>
  </div>

</template>

<script>
import { data, name, age, sett } from '../config/es/main1.js'
export default {
  setup() {
    return {
      data, name
    }
  }
}
</script>

<style>

</style>