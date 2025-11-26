import '../styles/globals.css';
import AppWalletProvider from '../components/WalletProvider';  // Same file, different export name



export const metadata = {
  title: 'Solana Escrow',
  description: 'Escrow dApp'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}