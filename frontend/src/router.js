import { createRouter, createWebHistory } from 'vue-router';

import CardSearch from './components/CardSearch.vue'
import DeckBuilder from './components/DeckBuilder.vue'

const routes = [
  { path: '/', component: CardSearch },
  { path: '/deck/:id?', component: DeckBuilder },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

export default router;
