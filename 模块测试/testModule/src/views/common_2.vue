<template>
  <div>
    common
  </div>
</template>

<script>
// import data from '../config/common/index1'

export default {
  data() {
    return {

    }
  },
  setup() {
    const data = require('../config/common/main1.js')
    console.log(data);
  }
}
</script>

<style>

</style>