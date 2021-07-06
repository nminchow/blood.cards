<template>
  <span>
    <el-row type="flex" class="row-bg" justify="center" :gutter="10">
      <el-col :xs="24" :sm="6" :lg="4">
        <el-select class="fill search" :disabled="shared" :filterable="true" v-model="hero" placeholder="Hero">
          <el-option
            v-for="item in heroOptions"
            :key="item.identifier"
            :label="item.name"
            :value="item.identifier">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="19" :sm="10" :lg="6">
        <!-- hacks to properly bind to input event for mobile -->
        <el-input :disabled="shared" placeholder="Deck Name" v-model="name"></el-input>
      </el-col>
      <el-col :xs="5" :sm="3" :lg="2">
        <el-button class="responsive-button" @click="save">
          <span v-if="shared">
            Edit
          </span>
          <span v-else>
            Share
          </span>
        </el-button>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" :gutter="10">
      <el-col class="deck-container" :xs="24" :sm="13">
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
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :sm="24" :lg="12">
              <h3>Equipment ({{equipmentTotal}})</h3>
              <ul class="cards">
                <li v-for="card in equipment" :key="card.identifier">
                  <CardName
                    :disabled="shared"
                    @add-clicked="add(card.identifier)"
                    :count="cards[card.identifier]"
                    :card="card"
                  />
                </li>
              </ul>
            </el-col>
            <el-col :sm="24" :lg="12">
              <h3>Deck ({{nonEquipmentTotal}})</h3>
              <ul class="cards">
                <li v-for="card in nonEquipment" :key="card.identifier">
                  <CardName
                    :disabled="shared"
                    @add-clicked="add(card.identifier)"
                    :count="cards[card.identifier]"
                    :card="card"
                  />
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col class="add-container" :xs="24" :sm="9" :gutter="4">
        <h2>Add Cards</h2>
        <el-input placeholder="Filter" v-model="optionFilter" class="input-with-select">
          <template #prepend>
            <el-select style="width:8rem;" v-model="optionTypeFilter" placeholder="Select">
              <el-option
                v-for="filter in Object.keys(cardFilters)"
                :key="filter"
                :label="filter"
                :value="filter"
              />
            </el-select>
          </template>
        </el-input>
        <ul class="grid cards">
          <li v-for="card in validCards" :key="card.identifier" class="item search-item">
            <CardName
              :disabled="shared"
              @add-clicked="add(card.identifier)"
              :count="cards[card.identifier]"
              :card="card"
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
import { useRouter } from 'vue-router'
import { ElNotification } from "element-plus";
import rison from 'rison';
import copy from 'copy-to-clipboard';
import { keyBy, chain, debounce } from 'lodash';
import cards from '../minimal.json';
import firebase from '../firebase';
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
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
    const router = useRouter()
    const cards = reactive({});
    const hero = ref();
    const name = ref('');
    const description = ref('');
    const optionFilter = ref('');
    const optionTypeFilter = ref('All');
    const purgeCards = ref();
    const shared = ref(false);

    const deck = computed(() => {
      return {
        hero: hero.value,
        cards: { ...cards },
        name: name.value,
        description: description.value,
      };
    });

    const equipmentKeywords = ['weapon', 'equipment'];

    const getCard = (identifier) => {
      return cardObj[identifier];
    }

    const add = (identifier) =>  {
      const count = cards[identifier] || 0;
      const max = getCard(identifier).keywords.find(isEquipmentKeyword) ? 1 : 3;
      const setValue = () => {
        if (count >= max) return 0;
        return count + 1;
      };
      cards[identifier] = setValue();
    }

    const isEquipmentKeyword = (k) => equipmentKeywords.includes(k);

    const equipment = computed(() => {
      return Object.entries(cards).map(([id]) => getCard(id)).filter(
        ({ keywords }) => keywords.find(isEquipmentKeyword)
      )
    });

    const nonEquipment = computed(() => {
      return Object.entries(cards).map(([id]) => getCard(id)).filter(
        ({ keywords }) => !keywords.find(isEquipmentKeyword)
      )
    });

    const cardPoolTotal = (identifiers) => {
      return identifiers.reduce((v, identifier) => {
        return v + cards[identifier];
      }, 0);
    };

    const equipmentTotal = computed(() => cardPoolTotal(equipment.value.map(({ identifier }) => identifier)));

    const nonEquipmentTotal = computed(() => cardPoolTotal(nonEquipment.value.map(({ identifier }) => identifier)));

    const save = () => {
      if (shared.value) {
        shared.value = false;
        return;
      }
      addDoc(collection(firebase.db, "decks"), {
        public: true,
        owner: null,
        deck: deck.value
      }).then(({ id }) => {
        shared.value = true;
        router.replace({ path: `/deck/${id}`, query: '' });
        ElNotification.success({ title: 'Shared!', message: 'Sharable URL created and copied to clipboard!' });
        setTimeout(copy, 0, window.location);
      });
    };

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
      equipment,
      nonEquipment,
      getCard,
      add,
      equipmentTotal,
      nonEquipmentTotal,
      save,
      shared,
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
    validCards: function() {
      // TODO optionFilter should probably be the output of debouncing an "option filter raw" to make input more smooth
      if( !this.hero ) return [];
      const { keywords } = cardObj[this.hero];
      const invalid = ['', 'hero', 'young']
      const validKeywords = keywords.filter(k => !invalid.includes(k));
      const pool = cards.filter(({ keywords, banned }) => {
        if (banned) return false;
        if (keywords.includes('hero')) return false;
        if (keywords.includes('generic')) return true;
        return validKeywords.every(k => keywords.includes(k));
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
    deck (data) {
      if (this.shared) return;
      const query = {...this.$route.query, data: rison.encode(data)};
      this.$router.replace({ path: '/deck', query });
      this.purgeCards();
    }
  },
  mounted() {
    const decodeAndSet = ({ hero, cards, name }) => {
      if (hero) this.hero = hero;
      if (cards) Object.entries(cards).map(([k, v]) => this.cards[k] = v);
      if (name) this.name = name;
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const { id } = this.$route.params;
    if (id) {
      this.shared = true;
      const docRef = doc(firebase.db, "decks", id);
      getDoc(docRef).then((snap) => {
        if (!snap.exists()) {
          this.$notify.error({ message: 'deck not found' });
          this.shared = false;
          return;
        };
        decodeAndSet(snap.data().deck);
      })
      return;
    }
    decodeAndSet(
      rison.decode(Object.fromEntries(urlSearchParams.entries()).data || '()')
    );

    // this.deck = rison.decode(this.$route.params.data || '()');
  },
  methods: {
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
  padding-inline-start: 0px;
}
.cards.grid {
  margin-top: 1rem;
}
.search-item {
  margin: 0;
  margin-left: .5rem;
  margin-right: .5rem;
}
.deck-container {
  border-width: 1px;
  border-color: lightgray;
  border-style: none solid none none;
}
.responsive-button {
  width: 100%;
  padding: 0px;
}
</style>