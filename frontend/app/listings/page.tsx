
'use client';
import { useEffect, useState } from 'react';
import ListingCard from '../../components/ListingCard';
import { fetchListings } from '../../utils/program';
export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  useEffect(()=> {
    fetchListings().then(setListings).catch(console.error);
  }, []);
  return (
    <main className="container">
      <h2>Active Listings</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12, marginTop:12}}>
        {listings.length===0 && <p style={{color:'var(--muted)'}}>No listings found</p>}
        {listings.map((l,i)=> <ListingCard key={i} listing={l} />)}
      </div>
    </main>
  )
}
