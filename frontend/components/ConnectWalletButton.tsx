'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ConnectWalletButton() {
  const { connected, disconnect } = useWallet();

  if (connected) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <WalletMultiButton />
      </div>
    );
  }

  return <WalletMultiButton />;
}