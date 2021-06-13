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
        Deck
      </el-col>
      <el-col :xs="24" :sm="8">
        <div>Add Cards</div>
        <el-input placeholder="Filter" v-model="optionFilter" class="input-with-select">
          <template #prepend>
            <el-select style="width:8rem" v-model="optionTypeFilter" placeholder="Select">
              <el-option label="Restaurant" value="1"></el-option>
              <el-option label="Order No." value="2"></el-option>
              <el-option label="Tel" value="3"></el-option>
            </el-select>
          </template>
        </el-input>
        <ul>
          <li v-for="card in validCards" :key="card.identifier">
            {{card.name}}
          </li>
        </ul>
      </el-col>
    </el-row>
    {{this.deck}}
    <br/>
  </span>
</template>
<script>
import rison from 'rison';
import { keyBy, chain, sortBy } from 'lodash';
import cards from '../minimal.json';

const cardObj = keyBy(cards, 'identifier');

const heroOptions = chain(cards).filter(({ keywords }) => keywords.includes('hero')).sortBy('name').value();

export default {
  data() {
    return {
      cards: [],
      hero: null,
      name: null,
      description: null,
      heroOptions,
      optionFilter: null,
      optionTypeFilter: null,
    }
  },
  computed: {
    deck: function() {
      return {
        hero: this.hero,
        cards: this.cards,
        name: this.name, // only on saved?
        description: this.description, // only on saved
      }
    },
    validCards: function() {
      if( !this.hero ) return [];
      const { keywords } = cardObj[this.hero];
      const invalid = ['', 'hero', 'young']
      const validKeywords = keywords.filter(k => !invalid.includes(k));
      console.log(validKeywords);
      return cards.filter(({ keywords, banned }) => {
        if (banned) return false;
        return !keywords.includes('hero') && keywords.find(k => validKeywords.includes(k));
      });
    }
  },
  watch: {
    deck (data) {
      console.log(data);
      const query = {...this.$route.query, data: rison.encode(data)};
      this.$router.replace({ path: '/deck', query });
    }
  },
  mounted() {
    // todo: only do this if we have the param. If we have an ID, set from firestore
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { hero, cards, name } = rison.decode(Object.fromEntries(urlSearchParams.entries()).data || '()');
    if (hero) this.hero = hero;
    if (cards) this.cards = cards;
    if (name) this.name = name;
    // this.deck = rison.decode(this.$route.params.data || '()');
    // console.log(this.$route.params.data);
    console.log(this.deck);
  }
}
</script>