<template>
  <el-popover
    placement="left"
    trigger="hover"
    :show-arrow="false"
    :show-after="500"
    :width="300"
    popper-class="popper-class"
  >
    <CardImage :show="showImage" :url="card.image" />
    <template #reference>
      <el-badge @mouseover="setShow" :value="count" :class="`badge-${color}`">
        <el-button size="mini" :class="`card-button ${color}`">{{card.name}}</el-button>
      </el-badge>
    </template>
  </el-popover>
</template>
<script>
import CardImage from './CardImage.vue'


export default {
  props: {
    card: Object,
  },
  setup(props) {
    return {
      count: props.count || 0,
      showImage: false,
    }
  },
  computed: {
    color () {
      const { stats: { resource } } = this.card;
      if (resource == 1) return 'red';
      if (resource == 2) return 'yellow';
      if (resource == 3) return 'blue';
      return '';
    }
  },
  methods: {
    setShow () {
      console.log('setting');
      this.showImage = true;
    },
  },
  components: {
    CardImage,
  }
}
</script>
<style>
.red {
  color: #A70005 !important;
}
.blue {
  color: #1982C4 !important;
}
.yellow {
  color: #E3B800 !important;
}
.badge- sup {
  background-color: black !important;
}
.badge-red sup {
  background-color: #A70005 !important;
}
.badge-blue sup {
  background-color: #1982C4 !important;
}
.badge-yellow sup {
  background-color: #E3B800 !important;
}
/* .el-popper.el-popover { */
.popper-class {
  background: none !important;
  color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
/* .el-popover .el-popper__arrow {
  display: none !important;
} */
.card-button {
  margin-bottom: .8rem !important;
  width: 13rem;
  text-align: left !important;
}
</style>