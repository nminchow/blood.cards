<template>
  <img class="top-logo" alt="Vue logo" src="./assets/logo.png" />
  <CardSearch/>
</template>

<script setup>
import CardSearch from './components/CardSearch.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Mate+SC&family=Mate:ital@0;1&display=swap');
</style>

<style>
#app {
  font-family: Mate, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.top-logo {
  max-height: 12rem;
  max-width: 90%;
  height: auto;
  margin-bottom: 1.5rem;
}
</style>
