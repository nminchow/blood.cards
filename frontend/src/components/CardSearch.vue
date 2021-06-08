<template>
  <span>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-input
          placeholder="Search For a Card"
          v-model="search"
          class="search"
          clearable
        />
      </el-col>
      <el-col :xs="24" :sm="6" :lg="4">
        <el-select class="fill search" filterable="true" v-model="keywords" multiple placeholder="Filter By Keyword">
          <el-option
            v-for="item in keywordOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <span class="grid">
      <div class="item" v-for="result in results" :key="result.item.identifier">
        <Card :url="result.item.image" />
      </div>
    </span>
  </span>
</template>
<script>
import Card from './Card.vue'
import cards from '../minimal.json';
import { debounce, chain, intersection } from 'lodash';
import fuse from 'fuse.js'

const cardFuse = new fuse(cards, {
  keys: ['name', 'identifier', 'keywords'],
  threshold: 0.2,
  useExtendedSearch: true,
});

const keywordOptions = chain(cards).map('keywords').flatten().uniq().sortBy().value().filter(Boolean);

export default {
  data() {
    return {
      search: '',
      keywords: [],
      keywordOptions,
      results: [],
      searchFuse: null,
    }
  },
  components: {
    Card,
  },
  beforeMount() {
    const getResults = () => {
      const { search, keywords } = this;

      const filters = keywords.length ? [{
        $or: keywords.map(keyword => ({ keywords: `=${keyword}`}))
      }] : [];

      const textMatch = search.length ? [{
        $or: [
          { identifier: search },
          { name: search },
        ],
      }] : [];


      this.results = cardFuse.search({
        $and: [
          ...filters,
          ...textMatch,
        ],
      });
    };

    this.searchFuse = debounce(getResults, 500);
  },
  watch: {
    search(newVal, oldVal) {
      if(newVal.length && newVal.length < oldVal.length) return;
      this.searchFuse();
    },
    keywords() {
      this.searchFuse();
    }
  },
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
}
.item {
  margin: 0.5rem;
  text-align: center;
}
</style>