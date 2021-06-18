<template>
  <span>
    <!-- {{byResource}} -->
    {{red}}
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

    const red = computed(() => {
      console.log('in comp');
      console.log(byResource);
      console.log(byResource.value);
      // { "1": [ [ "mordred-tide-red", 3 ], [ "spellblade-assault-red", 3 ] ] }
      // return byResource.value
      return byResource.value['1'].reduce((total,[, v]) => v + total, 0);
    });

    return {
      red,
      byResource,
    };
  },
}
</script>