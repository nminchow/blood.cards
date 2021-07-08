<template>
  <span>Sort:
    <el-select v-model="sort" placeholder="Select">
      <el-option
        v-for="(option, index) in sortOptions"
        :key="option.name"
        :label="option.name"
        :value="index"
      />
    </el-select>
    <ul class="cards">
      <li v-for="card in orderedCards" :key="card.identifier">
        <CardName
          :disabled="disabled"
          @add-clicked="clicked(card.identifier)"
          :count="pool[card.identifier]"
          :card="card"
        />
      </li>
    </ul>
  </span>
</template>
<script>
import { computed, toRefs, ref } from 'vue';
import CardName from './CardName.vue'
import { orderBy } from 'lodash';


const sortOptions = [
  {
    name: 'Alphabetical, Pitch',
    sort: (cards) => orderBy(cards, ['name', 'stats.resource']),
  },
  {
    name: 'Pitch, Alphabetical',
    sort: (cards) => orderBy(cards, ['stats.resource', 'name']),
  },
  {
    name: 'Pitch, Cost',
    sort: (cards) => orderBy(cards, ['stats.resource', 'stats.cost', 'name'], ['asc', 'desc', 'asc']),
  },
]

export default {
  props: {
    cards: Array,
    pool: Object,
    disabled: Boolean,
  },
  emits: ['add-clicked'],
  setup(props, context) {

    const { disabled, cards, pool } = toRefs(props);

    const clicked = (identifier) => {
      context.emit('add-clicked', identifier);
    };

    const sort = ref(1);

    const orderedCards = computed(() => {
      return sortOptions[sort.value].sort(cards.value);
    });


    return {
      pool,
      disabled,
      orderedCards,
      clicked,
      sort,
      sortOptions,
    };
  },
  components: {
    CardName,
  },
}
</script>