
'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createListing } from '../../utils/program';
export default function CreatePage() {
  const { publicKey, connected } = useWallet();
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!connected) return alert('Connect wallet');
    setLoading(true);
    try {
      await createListing(price, desc);
      alert('Listing created (transaction submitted)');
      setPrice(''); setDesc('');
    } catch (e) {
      console.error(e);
      alert('Error creating listing');
    }
    setLoading(false);
  };
  return (
    <main className="container">
      <div className="card" style={{maxWidth:700}}>
        <h2>Create Listing</h2>
        <label>Price (SOL)</label>
        <input placeholder="0.5" value={price} onChange={e=>setPrice(e.target.value)} style={{width:'100%', padding:8, marginTop:6}} />
        <label style={{marginTop:12}}>Description</label>
        <textarea placeholder="Describe property" value={desc} onChange={e=>setDesc(e.target.value)} style={{width:'100%', padding:8, marginTop:6}} />
        <div style={{marginTop:12}}>
          <button className="btn" onClick={submit} disabled={loading}>{loading?'Creating...':'Create Listing'}</button>
        </div>
      </div>
    </main>
  )
}
