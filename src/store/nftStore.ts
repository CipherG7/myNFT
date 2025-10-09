import { create } from 'zustand';

export interface NFT {
  id: string;
  name: string;
  description?: string;
  url: string;
}

export interface ListedNFT extends NFT {
  price: number;
  owner: string;
  listingId: string;
}

interface NFTStore {
  // Owned NFTs
  ownedNFTs: NFT[];
  setOwnedNFTs: (nfts: NFT[]) => void;
  addOwnedNFT: (nft: NFT) => void;
  removeOwnedNFT: (nftId: string) => void;
  
  // Marketplace listings
  marketplaceListings: ListedNFT[];
  setMarketplaceListings: (listings: ListedNFT[]) => void;
  addMarketplaceListing: (listing: ListedNFT) => void;
  removeMarketplaceListing: (listingId: string) => void;
  
  // Loading states
  isMinting: boolean;
  setIsMinting: (loading: boolean) => void;
  
  isListingNFT: string | null;
  setIsListingNFT: (nftId: string | null) => void;
  
  isBuyingNFT: string | null;
  setIsBuyingNFT: (nftId: string | null) => void;
  
  isLoadingOwnedNFTs: boolean;
  setIsLoadingOwnedNFTs: (loading: boolean) => void;
  
  isLoadingMarketplace: boolean;
  setIsLoadingMarketplace: (loading: boolean) => void;
  
  // Refresh functions
  refreshOwnedNFTs: () => Promise<void>;
  refreshMarketplace: () => Promise<void>;
  
  // Set refresh functions (to be called from components)
  setRefreshOwnedNFTs: (fn: () => Promise<void>) => void;
  setRefreshMarketplace: (fn: () => Promise<void>) => void;
  
  // Transaction success handlers
  onNFTMinted: (nft: NFT) => void;
  onNFTListed: (nftId: string, price: number, listingId: string, owner: string) => void;
  onNFTBought: (listingId: string, nftId: string) => void;
  onNFTDelisted: (listingId: string, nftId: string) => void;
}

export const useNFTStore = create<NFTStore>((set, get) => ({
  // Initial state
  ownedNFTs: [],
  marketplaceListings: [],
  isMinting: false,
  isListingNFT: null,
  isBuyingNFT: null,
  isLoadingOwnedNFTs: true,
  isLoadingMarketplace: true,
  
  // Placeholder refresh functions
  refreshOwnedNFTs: async () => {},
  refreshMarketplace: async () => {},
  
  // Owned NFTs actions
  setOwnedNFTs: (nfts) => set({ ownedNFTs: nfts }),
  
  addOwnedNFT: (nft) => set((state) => ({
    ownedNFTs: [...state.ownedNFTs, nft]
  })),
  
  removeOwnedNFT: (nftId) => set((state) => ({
    ownedNFTs: state.ownedNFTs.filter((nft) => nft.id !== nftId)
  })),
  
  // Marketplace listings actions
  setMarketplaceListings: (listings) => set({ marketplaceListings: listings }),
  
  addMarketplaceListing: (listing) => set((state) => ({
    marketplaceListings: [...state.marketplaceListings, listing]
  })),
  
  removeMarketplaceListing: (listingId) => set((state) => ({
    marketplaceListings: state.marketplaceListings.filter((listing) => listing.listingId !== listingId)
  })),
  
  // Loading states actions
  setIsMinting: (loading) => set({ isMinting: loading }),
  setIsListingNFT: (nftId) => set({ isListingNFT: nftId }),
  setIsBuyingNFT: (nftId) => set({ isBuyingNFT: nftId }),
  setIsLoadingOwnedNFTs: (loading) => set({ isLoadingOwnedNFTs: loading }),
  setIsLoadingMarketplace: (loading) => set({ isLoadingMarketplace: loading }),
  
  // Set refresh functions
  setRefreshOwnedNFTs: (fn) => set({ refreshOwnedNFTs: fn }),
  setRefreshMarketplace: (fn) => set({ refreshMarketplace: fn }),
  
  // Transaction success handlers
  onNFTMinted: (nft) => {
    set((state) => ({
      ownedNFTs: [...state.ownedNFTs, nft],
      isMinting: false
    }));
    // Refresh owned NFTs to get the latest data
    get().refreshOwnedNFTs();
  },
  
  onNFTListed: (nftId, price, listingId, owner) => {
    const state = get();
    const nft = state.ownedNFTs.find((n) => n.id === nftId);
    
    if (nft) {
      // Remove from owned NFTs
      set((state) => ({
        ownedNFTs: state.ownedNFTs.filter((n) => n.id !== nftId),
        isListingNFT: null
      }));
      
      // Add to marketplace listings
      const listedNFT: ListedNFT = {
        ...nft,
        price,
        owner,
        listingId
      };
      
      set((state) => ({
        marketplaceListings: [...state.marketplaceListings, listedNFT]
      }));
      
      // Refresh both lists to ensure consistency
      state.refreshMarketplace();
    }
  },
  
  onNFTBought: (listingId, _nftId) => {
    const state = get();
    
    // Remove from marketplace listings
    set((state) => ({
      marketplaceListings: state.marketplaceListings.filter((listing) => listing.listingId !== listingId),
      isBuyingNFT: null
    }));
    
    // Refresh owned NFTs to show newly bought NFT
    state.refreshOwnedNFTs();
    state.refreshMarketplace();
  },
  
  onNFTDelisted: (listingId, _nftId) => {
    const state = get();
    const listing = state.marketplaceListings.find((l) => l.listingId === listingId);
    
    if (listing) {
      // Remove from marketplace listings
      set((state) => ({
        marketplaceListings: state.marketplaceListings.filter((l) => l.listingId !== listingId)
      }));
      
      // Add back to owned NFTs
      const { price, owner, listingId: _, ...nft } = listing;
      set((state) => ({
        ownedNFTs: [...state.ownedNFTs, nft]
      }));
      
      // Refresh both lists to ensure consistency
      state.refreshOwnedNFTs();
      state.refreshMarketplace();
    }
  }
}));