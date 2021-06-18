<template>
  <el-popover
    placement="top"
    trigger="hover"
    :show-arrow="false"
    :show-after="800"
    :width="300"
    popper-class="popper-class"
  >
    <CardImage :transition="false" :show="showImage" :url="card.image" />
    <template #reference>
      <el-badge @mouseover="setShow" :value="count || 0" :class="`badge-${color}`">
        <el-button @click="$emit('add-clicked')" :class="`card-button ${color}`">
          <div class="button-content">
            <div class="card-text">
              {{card.name}}
            </div>
            <div class="img-wrapper">
              <img loading="lazy" class="inline-img" :src="card.image"/>
            </div>
          </div>
        </el-button>
      </el-badge>
    </template>
  </el-popover>
</template>
<script>
import CardImage from './CardImage.vue'


export default {
  props: {
    card: Object,
    count: Number,
  },
  emits: ['add-clicked'],
  setup() {
    return {
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
      this.showImage = true;
    },
  },
  components: {
    CardImage,
  }
}
</script>
<style>
.button-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img-wrapper {
  overflow: hidden;
}
.inline-img {
  object-fit: cover;
  width: 52px;
  height: 40px;
  object-position: 50% 18%;
  transform: scale(1.2);
}
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
  width: 16rem;
  text-align: left !important;
  padding: .1rem !important;
  padding-left: .5rem !important;
}
.card-text {
  white-space: normal;
  max-width: 11.5rem;
}
</style>