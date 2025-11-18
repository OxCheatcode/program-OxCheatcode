
import idl from '../idl/escrow.json';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { clusterApiUrl } from '@solana/web3.js';
const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || 'ReplaceProgramId';
const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER || 'devnet';
const endpoint = CLUSTER === 'devnet' ? clusterApiUrl('devnet') : clusterApiUrl('devnet');
export async function fetchListings() {
  return [
    { description: 'Nice 2-bedroom condo', price: 1.2, pda: 'PDA111' },
    { description: '3-bed townhouse', price: 2.5, pda: 'PDA222' }
  ];
}
export async function createListing(priceSol: string, description: string) {
  console.log('Pretend creating listing', priceSol, description);
}
export async function buyListing(listing: any) {
  console.log('Pretend buying', listing);
}
