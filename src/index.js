import { greet } from './utils.js';

const main = () => {
  const name = process.argv[2] || 'World';
  console.log(greet(name));
};

main();
