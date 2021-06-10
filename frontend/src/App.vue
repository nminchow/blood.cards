<template>
  <span>
    <img class="top-logo" alt="Vue logo" src="./assets/blood.png" />
    <div class= "subtext">A Flesh and Blood Card Browser</div>
    <router-view></router-view>
  </span>
</template>

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
body {
  background-color: #e9e5d81f;
}
.subtext {
  margin-bottom: 1.3rem;
}
.top-logo {
  max-height: 4rem;
  max-width: 90%;
  height: auto;
  margin-bottom: .3rem;
}
</style>
