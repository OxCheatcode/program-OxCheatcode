import { IDL } from './src/idl.ts';

console.log('Available instructions in your program:');
IDL.instructions.forEach((ix, i) => {
  console.log(`${i + 1}. ${ix.name}`);
  console.log('   Accounts:', ix.accounts.map(a => a.name).join(', '));
  console.log('   Args:', ix.args.map(a => `${a.name}: ${a.type}`).join(', '));
  console.log('');
});
