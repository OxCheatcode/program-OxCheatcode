const fs = require('fs');

// Read current IDL
const idlContent = fs.readFileSync('src/idl.ts', 'utf8');
const jsonMatch = idlContent.match(/export const IDL = \n([\s\S]+) as const;/);
const programIdMatch = idlContent.match(/export const PROGRAM_ID = "(.+)";/);

const newFormatIDL = JSON.parse(jsonMatch[1]);
const programId = programIdMatch[1];

console.log('Converting IDL...');
console.log('Program:', newFormatIDL.metadata.name);

// Convert to old Anchor format that works with @coral-xyz/anchor
const oldIDL = {
  version: newFormatIDL.metadata.version,
  name: newFormatIDL.metadata.name,
  instructions: newFormatIDL.instructions.map(ix => ({
    name: ix.name,
    accounts: ix.accounts.map(acc => ({
      name: acc.name,
      isMut: !!acc.writable,
      isSigner: !!acc.signer
    })),
    args: ix.args || []
  })),
  accounts: newFormatIDL.types
    .filter(t => t.name === 'Listing')
    .map(acc => ({
      name: acc.name,
      type: {
        kind: "struct",
        fields: acc.type.fields
      }
    })),
  errors: newFormatIDL.errors || []
};

// Write converted IDL
const output = `export const PROGRAM_ID = "${programId}";

export const IDL = ${JSON.stringify(oldIDL, null, 2)} as const;
`;

fs.writeFileSync('src/idl.ts', output);
console.log('✅ Conversion complete!');
console.log('Instructions:', oldIDL.instructions.map(i => i.name).join(', '));
console.log('Accounts:', oldIDL.accounts.map(a => a.name).join(', '));
