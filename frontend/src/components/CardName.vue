<template>
  <el-badge :value="count" :class="`badge-${color}`">
    <el-button size="mini" :class="`card-button ${color}`">{{card.name}}</el-button>
  </el-badge>
</template>
<script>
export default {
  props: {
    card: Object,
  },
  setup(props) {
    return {
      card: props.card,
      count: props.count || 0,
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
.card-button {
  margin-bottom: .8rem !important;
  width: 13rem;
  text-align: left !important;
}
</style>