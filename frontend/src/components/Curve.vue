<template>
  <span>
    <h3 class="curve-label">Resource Curve:</h3>
    <div class="curve-container">
      <label class="resource-label curve" for='red-bar'>Red</label>
      <meter
        class="curve"
        id='red-bar'
        min="0"
        :max="maxResource"
        :value="red"
        :low="red+.1"
        :high="red+.2"
        :optimum="red+.3"
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
        :low="yellow-.3"
        :optimum="yellow-.2"
        :high="yellow-.1"
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
      />
      <div class="curve">
        {{blue}}
      </div>
    </div>
    <h3 id="cost-label" class="curve-label">Cost:</h3>
    <div class="cost-curve">
      <div v-for="cost in byCost" :key="cost.key" class="curve-container">
        <label class="resource-label curve" :for='cost.key'>{{cost.key}}</label>
        <meter
          class="curve"
          :id='cost.key'
          min="0"
          :max="maxCost"
          :value="cost.value"
        />
        <div class="curve">
          {{cost.value}}
        </div>
      </div>
    </div>
  </span>
</template>
<script>
import { keyBy, groupBy, orderBy } from 'lodash';
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
      return groupBy(Object.entries(cards.value), ([k]) => {
        return cardObj[k].stats.resource;
      });
    });

    const byCost = computed(() => {
      const grouped = groupBy(Object.entries(cards.value), ([k]) => {
        return cardObj[k].stats.cost || 'other';
      });

      return orderBy(
        Object.entries(grouped).map(([key, v]) => ({ key, value: v.reduce(
          (acc, [,v]) => acc+v,
          0
        ) })),
      'key', 'desc')
    });

    const maxCost = computed(() => {
      return Math.max(...byCost.value.map(({ value }) => value));
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
      byCost,
      maxCost
    };
  },
}
</script>
<style>
.resource-label {
  min-width: 43px;
  justify-content: right;
}
meter {
  margin-left: .5rem;
  margin-right: .5rem;
  min-width: 0px;
}
.curve {
  flex: 1;
  display: flex;
}
.curve-container {
  display: flex;
}
h3 {
  margin-bottom: .4rem;
}
.curve-label {
  margin: 0;
}
#cost-label {
  margin-top: 2rem;
}
</style>