<template>
  <span>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8">
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
      <el-col :xs="24" :sm="6" :lg="4">
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
      <el-col :xs="8" :sm="6" :lg="4">
        <el-select class="fill search" :filterable="true" v-model="cost" multiple placeholder="Cost">
          <el-option
            v-for="item in costOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="8" :sm="6" :lg="4">
        <el-select class="fill search" :filterable="true" v-model="pitch" multiple placeholder="Pitch Value">
          <el-option
            v-for="item in [1, 2, 3]"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="8" :sm="6" :lg="4">
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
        <Card :url="result.item.image" />
      </div>
    </ul>
  </span>
</template>
<script>
import Card from './Card.vue'
import cards from '../minimal.json';
import { debounce, chain, throttle } from 'lodash';
import fuse from 'fuse.js'

const cardFuse = new fuse(cards, {
  keys: ['name', 'identifier', 'keywords', 'stats.cost', 'stats.resource', 'stats.defense'],
  threshold: 0.2,
  useExtendedSearch: true,
});

const toUpperString = (x) => x.toString().toUpperCase();

const keywordOptions = chain(cards).map('keywords').flatten().uniq().sortBy().value().filter(Boolean);
const costOptions = chain(cards).map('stats.cost').compact().map(toUpperString).uniq().value().sort();
const defenseOptions = chain(cards).map('stats.defense').compact().map(toUpperString).uniq().value().sort();

export default {
  data() {
    return {
      search: '',
      keywords: [],
      pitch: [],
      cost: [],
      defense: [],
      keywordOptions,
      costOptions,
      defenseOptions,
      displayed: 15,
      results: [],
      displayedResults: [],
      searchFuse: null,
      loadMore: null,
    }
  },
  components: {
    Card,
  },
  beforeMount() {
    const getResults = () => {
      const { search, keywords, cost, defense, pitch } = this;

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

      const pitchMatch = pitch.length ? [{
        $or: pitch.map(pitch => ({ 'stats.resource': `=${pitch}`}))
      }] : [];

      const defenseMatch = defense.length ? [{
        $or: defense.map(defense => ({ 'stats.defense': `=${defense}`}))
      }] : [];


      this.results = cardFuse.search({
        $and: [
          ...filters,
          ...costMatch,
          ...textMatch,
          ...pitchMatch,
          ...defenseMatch,
        ],
      });

      this.displayed = 0;
      this.displayedResults = this.results.slice(0, 15);
    };

    this.searchFuse = debounce(getResults, 500);

    const loadMore = () => {
      this.displayed += 15;
      console.log('grabbing', this.displayed, this.displayed + 15);
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