
import Link from 'next/link';
import ConnectWalletButton from '../components/ConnectWalletButton';
export default function Home() {
  return (
    <main className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Solana Real Estate Escrow</h1>
        <ConnectWalletButton />
      </div>
      <div style={{marginTop:24}}>
        <p style={{color:'var(--muted)'}}>Create listings, lock funds in escrow, and securely transfer property funds using Solana.</p>
        <div style={{marginTop:20, display:'flex', gap:12}}>
          <Link href="/listings"><button className="btn">View Listings</button></Link>
          <Link href="/create"><button className="btn">Create Listing</button></Link>
        </div>
      </div>
    </main>
  )
}
