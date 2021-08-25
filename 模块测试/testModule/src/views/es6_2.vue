<template>
  <div>
    <div>es6_2</div>
    <div>{{ msg.num }}</div>
    <div> {{ msg.age }} </div>
    <div> {{ name1 }} </div>
    <input type="number" @change="addAge">
    <input type="text" @change="changeName">
    <p>
      通过import导入的普通类型不可改变，引用数据类型可以改变
    </p>
  </div>
</template>

<script>
import { data, name, age, sett } from '../config/es/main1.js'
import { reactive, ref } from 'vue'
export default {
  setup() {
    const msg = reactive(data)
    const name1 = ref(name)

    const addAge = (e) => {
      console.log(e?.target?.value);
      msg.age += Number(e?.target?.value) || 1
    }

    const changeName = (e) => {
      name1.value = e.target.value
    }
    return {
      msg, name1, addAge, changeName
    }
  }
}
</script>

<style>

</style>