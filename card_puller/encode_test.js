var rison = require('rison');

const data = { card: 'chane', deck: ['eye-of-ophidia-blue', 'prismatic-shield-yellow', 'prismatic-shield-blue', 'eye-of-ophidia-blue'] };

const result = rison.encode_uri(data);

console.log(result);

const decode = rison.decode(result);

console.log(decode);