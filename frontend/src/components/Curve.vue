<template>
  <span>
    <div class="curve-container">
      <label class="resource-label curve" for='red-bar'>Red</label>
      <meter
        class="curve"
        id='red-bar'
        min="0"
        :max="maxResource"
        :value="red"
        :low="red+1"
        :high="red+2"
        :optimum="red+3"
      />
      <div class="curve">
        {{red}}
      </div>
    </div>
    <div class="curve-container">
      <label class="resource-label curve" for='yellow-bar'>Yellow</label>
      <meter
        class="curve"
        id='yellow-bar'
        min="0"
        :max="maxResource"
        :value="yellow"
        :low="yellow-3"
        :optimum="yellow-2"
        :high="yellow-1"
      />
      <div class="curve">
        {{yellow}}
      </div>
    </div>
    <div class="curve-container">
      <label class="resource-label curve" for='blue-bar'>Blue</label>
      <meter
        class="curve"
        id='blue-bar'
        min="0"
        :max="maxResource"
        :value="blue"
        :low="blue-1"
        :optimum="blue"
        :high="blue+1"
      />
      <div class="curve">
        {{blue}}
      </div>
    </div>
  </span>
</template>
<script>
import { keyBy, groupBy } from 'lodash';
import cards from '../minimal.json';
import { computed, toRefs } from 'vue';
const cardObj = keyBy(cards, 'identifier');

export default {
  props: {
    cards: Object
  },
  setup(props) {
    const { cards } = toRefs(props);

    const byResource = computed(() => {
      const result = groupBy(Object.entries(cards.value), ([k]) => {
        return cardObj[k].stats.resource;
      });
      console.log(result);
      return result;
    });

    const computeSumByResource = (key) => () => (byResource.value[key] || []).reduce((total,[, v]) => v + total, 0);

    const red = computed(computeSumByResource('1'));
    const yellow = computed(computeSumByResource('2'));
    const blue = computed(computeSumByResource('3'));

    const maxResource = computed(() => Math.max(red.value, blue.value, yellow.value) * 1.5);

    return {
      red,
      yellow,
      blue,
      maxResource,
      byResource,
    };
  },
}
</script>
<style>
.resource-label {
  justify-content: right;
}
meter {
  margin-left: .5rem;
  margin-right: .5rem;
}
.curve {
  flex: 1;
  display: flex;
}
/* .curve:first-child > span { margin-right: auto; } */

/* .curve:last-child  > span { margin-left: auto;  } */
.curve-container {
  display: flex;
}
</style>