<template>
  <transition name="el-zoom-in-center">
    <img v-if="show" v-show="loaded" :src="url" @load="onLoad" />
  </transition>
</template>

<script>

export default {
  props: {
    url: String,
    show: Boolean
  },
  data() {
    return {
      loaded: false,
    }
  },
  methods: {
    onLoad() {
      this.loaded = true;
    }
  },
}
</script>
