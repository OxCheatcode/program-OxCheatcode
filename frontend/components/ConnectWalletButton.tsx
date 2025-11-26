'use client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useState, useEffect } from 'react';

import { IDL as IDL_DATA, PROGRAM_ID as PROGRAM_ID_STRING } from '../src/idl';

export default function ConnectWalletButton() {
  const { connected, publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();

  const [txSignature, setTxSignature] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<string>('1');
  const [description, setDescription] = useState<string>('My Item');
  const [error, setError] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [listingExists, setListingExists] = useState<boolean>(false);

  useEffect(() => {
    console.log('🔧 IDL Check');
    if (IDL_DATA && PROGRAM_ID_STRING) {
      console.log('✅ IDL loaded');
    }
  }, []);

  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / web3.LAMPORTS_PER_SOL);
      }).catch(console.error);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (publicKey && connection && IDL_DATA) {
      checkListingExists();
    }
  }, [publicKey, connection, txSignature]);

  const getProvider = () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      throw new Error('Wallet not connected');
    }
    return new AnchorProvider(
      connection,
      { publicKey, signTransaction, signAllTransactions } as any,
      { commitment: 'confirmed' }
    );
  };

  const checkListingExists = async () => {
    if (!publicKey) return;
    try {
      const programId = new web3.PublicKey(PROGRAM_ID_STRING);
      const provider = getProvider();
      const program = new Program(IDL_DATA as any, programId, provider);
      const [listingPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), publicKey.toBuffer()],
        programId
      );
      const accountInfo = await connection.getAccountInfo(listingPDA);
      setListingExists(accountInfo !== null);
    } catch (err) {
      setListingExists(false);
    }
  };

  const createListing = async () => {
    setError('');
    setTxSignature('');

    if (!publicKey || !IDL_DATA) {
      setError('Wallet or IDL not loaded');
      return;
    }

    const priceNum = parseFloat(price);
    if (!priceNum || priceNum <= 0) {
      setError('Invalid price');
      return;
    }

    if (!description.trim()) {
      setError('Description required');
      return;
    }

    setLoading(true);
    console.log('🚀 Creating listing...');

    try {
      const programId = new web3.PublicKey(PROGRAM_ID_STRING);
      const provider = getProvider();
      const program = new Program(IDL_DATA as any, programId, provider);

      const [listingPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), publicKey.toBuffer()],
        programId
      );

      console.log('📍 PDA:', listingPDA.toBase58());
      
      const lamports = Math.floor(priceNum * web3.LAMPORTS_PER_SOL);
      const priceInLamports = new BN(lamports);
      
      console.log('💰 Price:', priceNum, 'SOL');
      console.log('💵 Lamports:', lamports);

      const tx = await program.methods
        .create_listing(priceInLamports, description)
        .accounts({
          seller: publicKey,
          listing: listingPDA,
          system_program: web3.SystemProgram.programId,
        })
        .rpc();

      console.log('✅ TX:', tx);
      await connection.confirmTransaction(tx, 'confirmed');
      
      setTxSignature(tx);
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / web3.LAMPORTS_PER_SOL);
      await checkListingExists();
      
      alert(`✅ Success!\n\nTX: ${tx}\n\nhttps://explorer.solana.com/tx/${tx}?cluster=devnet`);
    } catch (err: any) {
      console.error('❌ Error:', err);
      const errorMsg = err?.message || String(err);
      setError(errorMsg);
      alert(`❌ Failed:\n\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelListing = async () => {
    if (!publicKey || !listingExists) return;
    setLoading(true);
    try {
      const programId = new web3.PublicKey(PROGRAM_ID_STRING);
      const provider = getProvider();
      const program = new Program(IDL_DATA as any, programId, provider);
      const [listingPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), publicKey.toBuffer()],
        programId
      );
      const tx = await program.methods.cancel_listing().accounts({
        seller: publicKey,
        listing: listingPDA,
      }).rpc();
      await connection.confirmTransaction(tx, 'confirmed');
      setTxSignature(tx);
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / web3.LAMPORTS_PER_SOL);
      await checkListingExists();
      alert(`✅ Cancelled! TX: ${tx}`);
    } catch (err: any) {
      alert(`❌ ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchListing = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const programId = new web3.PublicKey(PROGRAM_ID_STRING);
      const provider = getProvider();
      const program = new Program(IDL_DATA as any, programId, provider);
      const [listingPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), publicKey.toBuffer()],
        programId
      );
      const listing: any = await program.account.listing.fetch(listingPDA);
      const priceInSOL = listing.price.toNumber() / web3.LAMPORTS_PER_SOL;
      alert(`📦 Listing:\n\n${listing.description}\n${priceInSOL} SOL\n${listing.sold ? 'SOLD' : 'Available'}`);
      await checkListingExists();
    } catch (err: any) {
      if (err?.message?.includes('does not exist')) {
        alert('❌ No listing found');
      } else {
        alert(`❌ ${err?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (connected && publicKey) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <WalletMultiButton />
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>📍 {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</div>
            {balance !== null && <div>💰 {balance.toFixed(4)} SOL</div>}
            <div>📦 {listingExists ? '✅ Active' : '❌ None'}</div>
            <div>🔧 {IDL_DATA ? '✅' : '❌'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Create Listing</h3>
          
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Price in SOL"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            maxLength={100}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />

          <button onClick={createListing} disabled={loading || listingExists}
            style={{ padding: '12px', backgroundColor: loading || listingExists ? '#999' : '#512da8', color: 'white', border: 'none', borderRadius: '6px', cursor: loading || listingExists ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? '⏳' : listingExists ? '⚠️ Exists' : '✨ Create'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={cancelListing} disabled={loading || !listingExists}
              style={{ padding: '10px', backgroundColor: loading || !listingExists ? '#999' : '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', cursor: loading || !listingExists ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              ❌
            </button>
            <button onClick={fetchListing} disabled={loading}
              style={{ padding: '10px', backgroundColor: loading ? '#999' : '#388e3c', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              🔍
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        {txSignature && (
          <div style={{ padding: '12px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '6px', fontSize: '12px', wordBreak: 'break-all' }}>
            ✅ <a href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
              {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <WalletMultiButton />
      <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>Connect your wallet to interact with escrow on devnet</p>
    </div>
  );
}
