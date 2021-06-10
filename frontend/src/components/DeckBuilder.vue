<template>
  <span>
    <button @click="example">example</button>
    <br/>
    {{this.deck}}
  </span>
</template>
<script>
import rison from 'rison';

export default {
  data() {
    return {
      deck: {}
    }
  },
  methods: {
    example() {
      this.deck = {
        hero: 'chane',
        type: 'blitz',
        deck: [
          {
            identifier: 'phantasmify-red',
            count: 1
          }
        ]
      };
    }
  },
  watch: {
    deck (data) {
      console.log('doing set');
      console.log(data);
      const query = {...this.$route.query, data: rison.encode_uri(data)};
      this.$router.replace({ path: '/deck', query });
    }
  },
  mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    this.deck = rison.decode(Object.fromEntries(urlSearchParams.entries()).data || '()');
    // this.deck = rison.decode(this.$route.params.data || '()');
    // console.log(this.$route.params.data);
    console.log(this.deck);
  }
}
</script>