<template>
  <span>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="18" :xl="12">
        <!-- hacks to properly bind to input event for mobile -->
        <div class="el-input el-input--suffix search">
          <input
            class="el-input__inner"
            placeholder="Search For a Card"
            v-model="search"
            @input="(x) => search = x.target.value"
            clearable
          />
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="9" :sm="7" :xl="5">
        <el-select class="fill search" :filterable="true" v-model="sets" multiple placeholder="Set">
          <el-option
            v-for="item in setOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="6" :sm="4" :xl="2">
        <el-select class="fill search" :filterable="true" v-model="rarities" multiple placeholder="Rarity">
          <el-option
            v-for="item in rarityOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="9" :sm="7" :xl="5">
        <el-select class="fill search" :filterable="true" v-model="keywords" multiple placeholder="Keyword">
          <el-option
            v-for="item in keywordOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="8" :sm="6" :xl="4">
        <el-select class="fill search" :filterable="true" v-model="cost" multiple placeholder="Cost">
          <el-option
            v-for="item in costOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="8" :sm="6" :xl="4">
        <el-select class="fill search" :filterable="true" v-model="pitch" multiple placeholder="Pitch Value">
          <el-option
            v-for="item in [1, 2, 3]"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="8" :sm="6" :xl="4">
        <el-select class="fill search" :filterable="true" v-model="defense" multiple placeholder="Defense">
          <el-option
            v-for="item in defenseOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <ul class="grid" v-infinite-scroll="load">
      <div class="item" v-for="result in displayedResults" :key="result.item.identifier">
        <CardImage :transition="true" :show="true" :url="result.item.image" />
      </div>
    </ul>
  </span>
</template>
<script>
import CardImage from './CardImage.vue'
import cards from '../minimal.json';
import { debounce, chain, throttle } from 'lodash';
import fuse from 'fuse.js'

const cardFuse = new fuse(cards, {
  keys: ['name', 'identifier', 'keywords', 'stats.cost', 'stats.resource', 'stats.defense', 'set', 'rarity'],
  threshold: 0.2,
  useExtendedSearch: true,
});

const toUpperString = (x) => x.toString().toUpperCase();

const keywordOptions = chain(cards).map('keywords').flatten().uniq().sortBy().value().filter(Boolean);
const setOptions = chain(cards).map('set').uniq().sortBy().value().filter(Boolean);
const costOptions = chain(cards).map('stats.cost').compact().map(toUpperString).uniq().value().sort();
const rarityOptions = chain(cards).map('rarity').compact().map(toUpperString).uniq().value().sort();
const defenseOptions = chain(cards).map('stats.defense').compact().map(toUpperString).uniq().value().sort();

export default {
  data() {
    return {
      search: '',
      sets: [],
      keywords: [],
      pitch: [],
      cost: [],
      rarities: [],
      defense: [],
      setOptions,
      keywordOptions,
      costOptions,
      rarityOptions,
      defenseOptions,
      displayed: 15,
      results: [],
      displayedResults: [],
      searchFuse: null,
      loadMore: null,
    }
  },
  components: {
    CardImage,
  },
  beforeMount() {
    const getResults = () => {
      const { search, keywords, cost, defense, pitch, sets, rarities } = this;

      const filters = keywords.length ? [{
        $or: keywords.map(keyword => ({ keywords: `=${keyword}`}))
      }] : [];

      const textMatch = search.length ? [{
        $or: [
          { identifier: search },
          { name: search },
        ],
      }] : [];

      const costMatch = cost.length ? [{
        $or: cost.map(cost => ({ 'stats.cost': `=${cost}`}))
      }] : [];

      const rarityMatch = rarities.length ? [{
        $or: rarities.map(rarity => ({ 'rarity': `=${rarity}`}))
      }] : [];

      const pitchMatch = pitch.length ? [{
        $or: pitch.map(pitch => ({ 'stats.resource': `=${pitch}`}))
      }] : [];

      const defenseMatch = defense.length ? [{
        $or: defense.map(defense => ({ 'stats.defense': `=${defense}`}))
      }] : [];

      const setMatch = sets.length ? [{
        $or: sets.map(set => ({ 'set': `="${set}"`}))
      }] : [];


      this.results = cardFuse.search({
        $and: [
          ...filters,
          ...costMatch,
          ...rarityMatch,
          ...textMatch,
          ...pitchMatch,
          ...defenseMatch,
          ...setMatch,
        ],
      });

      this.displayed = 0;
      this.displayedResults = this.results.slice(0, 15);
    };

    this.searchFuse = debounce(getResults, 500);

    const loadMore = () => {
      this.displayed += 15;
      this.displayedResults.push(...this.results.slice(this.displayed, this.displayed + 15));
    }

    // throttle to prevent a bunch of loads triggering when first set up
    this.loadMore = throttle(loadMore, 200);
  },
  watch: {
    search(newVal, oldVal) {
      if(newVal.length && newVal.length < oldVal.length) return;
      this.searchFuse();
    },
    keywords() {
      this.searchFuse();
    },
    cost() {
      this.searchFuse();
    },
    pitch() {
      this.searchFuse();
    },
    defense() {
      this.searchFuse();
    },
    sets() {
      this.searchFuse();
    },
    rarities() {
      this.searchFuse();
    }
  },
  methods: {
    load () {
      this.loadMore();
    }
  }
}
</script>
<style>
.fill {
  width: 100%;
}
.search {
  margin-bottom: 1.5rem;
}
.grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: -0.5rem;
  padding: 0rem;
}
.item {
  margin: 0.5rem;
  text-align: center;
}
</style>