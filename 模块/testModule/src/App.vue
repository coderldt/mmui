<template>
  <div>
    <router-link to="/">common</router-link> ｜
    <router-link :to="{ name: 'first_2' }">common_2</router-link> ｜
    <router-link :to="{ name: 'second'}" >es6</router-link> ｜
    <router-link :to="{ name: 'second_2'}" >es6_2</router-link>
    <router-view></router-view>
  </div>
</template>

<script setup>
</script>

<style>
</style>
