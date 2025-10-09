import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useNFTStore } from '../store/nftStore';

interface NFTStoreProviderProps {
  children: React.ReactNode;
}

export function NFTStoreProvider({ children }: NFTStoreProviderProps) {
  const account = useCurrentAccount();
  const { setOwnedNFTs, setMarketplaceListings, setIsLoadingOwnedNFTs, setIsLoadingMarketplace } = useNFTStore();

  // Reset store when account changes
  useEffect(() => {
    if (!account) {
      setOwnedNFTs([]);
      setMarketplaceListings([]);
      setIsLoadingOwnedNFTs(false);
      setIsLoadingMarketplace(false);
    }
  }, [account, setOwnedNFTs, setMarketplaceListings, setIsLoadingOwnedNFTs, setIsLoadingMarketplace]);

  return <>{children}</>;
}