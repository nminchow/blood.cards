const fs = require('fs');
const got = require('got');


const getCards = async () => {
  const cards = [];
  let nextSlug = '/cards'
  while (nextSlug) {
    const url = `https://api.fabdb.net${nextSlug}`;
    console.log('getting', url);
    const { links: { next }, data } = await got(url).json();
    nextSlug = next;
    cards.push(...data);
  }

  return cards;
};

const saveFile = (cards) => {
  // TODO: only put in 0 cost if action
  const minimal = cards.map(({ identifier, name, keywords, rarity, banned, image, printings: [ { sku: { sku } } ], stats }) => {
    if (!stats.cost && keywords.some(k => k.includes(['action', 'instant']))) {
      stats.cost = 0;
    }
    return { identifier, name, keywords, rarity, banned, image, sku, stats };
  });
  fs.writeFile('./minimal.json', JSON.stringify(minimal), () => console.log('done'));
  fs.writeFile('./output.json', JSON.stringify(cards), () => console.log('done'));
}

getCards().then(saveFile);
