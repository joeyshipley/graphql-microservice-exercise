import { greeter } from './temp';

greeter('Hello.')
    .then((result: string) => { console.log(result); });