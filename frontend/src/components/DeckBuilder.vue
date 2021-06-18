<template>
  <span>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="6" :lg="4">
        <el-select class="fill search" :filterable="true" v-model="hero" placeholder="Hero">
          <el-option
            v-for="item in heroOptions"
            :key="item.identifier"
            :label="item.name"
            :value="item.identifier">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <!-- hacks to properly bind to input event for mobile -->
        <el-input placeholder="Deck Name" class="fill" v-model="name"></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="14">
        <h2>Deck</h2>
        <div>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :xs="12" :sm="12" :lg="12">
              <div v-if="hero">
                <img class="hero-image" :src="getCard(hero).image">
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12">
              <div v-if="hero">
                <Curve :cards="cards"/>
              </div>
            </el-col>
          </el-row>
          <ul class="cards">
            <li v-for="card in Object.entries(this.deck.cards).map(([id, count]) => getCard(id))" :key="card.identifier" class="search-item">
              <CardName
                @add-clicked="add(card.identifier)"
                :count="cards[card.identifier]"
                :card="card"
                placement="right"
              />
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <h2>Add Cards</h2>
        <el-input placeholder="Filter" v-model="optionFilter" class="input-with-select">
          <template #prepend>
            <el-select style="width:8rem" v-model="optionTypeFilter" placeholder="Select">
              <el-option
                v-for="filter in Object.keys(cardFilters)"
                :key="filter"
                :label="filter"
                :value="filter"
              />
            </el-select>
          </template>
        </el-input>
        <ul class="cards">
          <li v-for="card in validCards" :key="card.identifier" class="search-item">
            <CardName
              @add-clicked="add(card.identifier)"
              :count="cards[card.identifier]"
              :card="card"
              placement="left"
            />
          </li>
        </ul>
      </el-col>
    </el-row>
    <br/>
  </span>
</template>
<script>
import { reactive, ref, computed } from 'vue'
import rison from 'rison';
import { keyBy, chain, debounce } from 'lodash';
import cards from '../minimal.json';
import fuse from 'fuse.js'
import CardName from './CardName.vue'
import Curve from './Curve.vue'

const cardObj = keyBy(cards, 'identifier');

const heroOptions = chain(cards).filter(({ keywords }) => keywords.includes('hero')).sortBy('name').value();

const cardFilters = {
  All: {
    filter: () => true,
  },
  Weapons: {
    filter: ({ keywords }) => keywords.includes('weapon')
  },
  Equipment: {
    filter: ({ keywords }) => keywords.includes('equipment')
  },
  Instants: {
    filter: ({ keywords }) => keywords.includes('instant')
  },
  Items: {
    filter: ({ keywords }) => keywords.includes('item')
  },
  ["Non-Attack Actions"]: {
    filter: ({ keywords }) => keywords.includes('action') && !keywords.includes('attack')
  },
  ['Attack Actions']: {
    filter: ({ keywords }) => keywords.includes('attack')
  },
  ['Attack Reactions']: {
    filter: ({ keywords }) => keywords.includes('attack') && keywords.includes('reaction')
  },
  ['Defense Reactions']: {
    filter: ({ keywords }) => keywords.includes('defense') && keywords.includes('reaction')
  },
}

export default {
  setup() {
    const cards = reactive({});
    const hero = ref();
    const name = ref('');
    const description = ref('');
    const optionFilter = ref('');
    const optionTypeFilter = ref('All');
    const purgeCards = ref();

    const deck = computed(() => {
      return {
        hero: hero.value,
        cards: { ...cards },
        name: name.value,
        description: description.value,
      };
    });

    return {
      deck,
      cards,
      hero,
      name,
      description,
      heroOptions,
      optionFilter,
      cardFilters,
      optionTypeFilter,
      purgeCards,
    }
  },
  beforeMount() {
    const purgeCards = () => {
      Object.entries(this.cards).filter(([, value]) => !value).map(([k]) => {
        delete this.cards[k];
      });
    };
    this.purgeCards = debounce(purgeCards, 5000);
  },
  computed: {
    // this isn't firing when cards changes (because its an object). Proxy cards with a deep watcher? Switch to composition api?
    validCards: function() {
      // TODO optionFilter should probably be the output of debouncing an "option filter raw" to make input more smooth
      if( !this.hero ) return [];
      const { keywords } = cardObj[this.hero];
      const invalid = ['', 'hero', 'young']
      const validKeywords = keywords.filter(k => !invalid.includes(k));
      const pool = cards.filter(({ keywords, banned }) => {
        if (banned) return false;
        return !keywords.includes('hero') && keywords.find(k => [...validKeywords, 'generic'].includes(k));
      }).filter(cardFilters[this.optionTypeFilter].filter);

      if (!this.optionFilter) return pool;

      const cardFuse = new fuse(pool, {
        keys: ['name'],
        threshold: 0.2
      });

      const result = cardFuse.search(this.optionFilter).map(({ item }) => item);

      return result;
    }
  },
  watch: {
    // TODO: create debounced function that purges 0-d cards after some time (5 seconds or so)
    deck (data) {
      const query = {...this.$route.query, data: rison.encode(data)};
      this.$router.replace({ path: '/deck', query });
      this.purgeCards();
    }
  },
  mounted() {
    // todo: only do this if we have the param. If we have an ID, set from firestore
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { hero, cards, name } = rison.decode(Object.fromEntries(urlSearchParams.entries()).data || '()');
    if (hero) this.hero = hero;
    if (cards) Object.entries(cards).map(([k, v]) => this.cards[k] = v);
    if (name) this.name = name;
    // this.deck = rison.decode(this.$route.params.data || '()');
    // console.log(this.$route.params.data);
  },
  methods: {
    add(identifier) {
      const count = this.cards[identifier] || 0;
      const setValue = () => {
        if (count >= 3) return 0;
        return count + 1;
      };
      this.cards[identifier] = setValue();
    },
    getCard(identifier) {
      return cardObj[identifier];
    }
  },
  components: {
    CardName,
    Curve
  }
}
</script>
<style>
.hero-image {
    object-fit: scale-down;
    max-width: 100%
}
.cards {
  list-style-type:none;
  margin-left: 0;
  padding-left: 0;
}
</style>