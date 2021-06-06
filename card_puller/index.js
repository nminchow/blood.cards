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
  const minimal = cards.map(({ identifier, name, keywords, rarity, banned, image  }) => (
    { identifier, name, keywords, rarity, banned, image }
  ));
  fs.writeFile('./minimal.json', JSON.stringify(minimal), () => console.log('done'));
  fs.writeFile('./output.json', JSON.stringify(cards), () => console.log('done'));
}

getCards().then(saveFile);
