<template>
  <span>
    <el-row>
      <el-col>
        <img class="top-logo" alt="Vue logo" src="./assets/blood.png" />
      </el-col>
      <el-col :xs="24">
        <router-link class="card link" to="/">Card Browser</router-link>
        <div class= "subtext">A Flesh and Blood Card Browser</div>
      </el-col>
      <el-col>
        <router-link class="deck link" to="/deck">Deck Builder</router-link>
      </el-col>
    </el-row>
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
a {
  color: #a70005;
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
.link {
  position: absolute;
  top: 1rem;
}
.card {
  left: 2rem;
}
.deck {
  right: 2rem;
}
@media only screen and (max-width: 680px){
  .link {
    top: 6rem;
  }
  .subtext {
    margin-bottom: 2rem;
  }
}
</style>
