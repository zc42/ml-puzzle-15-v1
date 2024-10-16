import { G15EntryPoint } from './G15EntryPoint';

G15EntryPoint.main().then(() => {
  console.log('G15EntryPoint has completed execution.');
}).catch(error => {
  console.error('An error occurred:', error);
});