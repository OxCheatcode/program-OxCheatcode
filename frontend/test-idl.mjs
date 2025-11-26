import { IDL, PROGRAM_ID } from './src/idl.ts';

console.log('=== IDL Test ===');
console.log('PROGRAM_ID:', PROGRAM_ID);
console.log('IDL exists:', !!IDL);
console.log('IDL type:', typeof IDL);
console.log('IDL keys:', Object.keys(IDL || {}));
console.log('IDL.metadata:', IDL?.metadata);
console.log('IDL.instructions:', IDL?.instructions?.length);
console.log('First instruction:', IDL?.instructions?.[0]?.name);
console.log('=== End Test ===');
