
'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { buyListing } from '../utils/program';
export default function ListingCard({ listing }: { listing: any }) {
  const { connected } = useWallet();
  return (
    <div className="card">
      <h3>{listing.description}</h3>
      <p style={{color:'var(--muted)'}}>Price: {listing.price} SOL</p>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={()=> {
          if (!connected) return alert('Connect wallet');
          buyListing(listing).then(()=>alert('Buy tx sent')).catch(e=>{console.error(e); alert('Error');});
        }}>Buy</button>
      </div>
    </div>
  )
}
