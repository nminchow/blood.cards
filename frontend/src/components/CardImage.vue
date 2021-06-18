<template>
  <transition v-if="transition" name="el-zoom-in-center">
    <img v-if="show" v-show="loaded" :src="url" @load="onLoad" />
  </transition>
  <img v-else v-show="loaded" :src="url" @load="onLoad" />
</template>

<script>

export default {
  props: {
    url: String,
    show: Boolean,
    transition: Boolean
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
