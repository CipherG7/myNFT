import { useEffect, useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "./NFTCardSkeleton";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { NFT_TYPE } from "../constants";
import { MARKETPLACE_MODULE } from "../marketplaceConstants";
import { useNFTStore } from "../store/nftStore";
import toast from "react-hot-toast";

// Marketplace object ID
const MARKETPLACE_OBJECT_ID = "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a";

export function MyMintedNFTs() {
  const {
    ownedNFTs,
    setOwnedNFTs,
    isLoadingOwnedNFTs,
    setIsLoadingOwnedNFTs,
    isListingNFT,
    setIsListingNFT,
    onNFTListed,
    setRefreshOwnedNFTs,
    refreshMarketplace
  } = useNFTStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const fetchOwnedNFTs = async (isRefresh = false) => {
    console.log("fetchOwnedNFTs called");
    if (!account) {
      console.log("No account connected");
      setIsLoadingOwnedNFTs(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingOwnedNFTs(true);
    }

    try {
      console.log("Fetching owned objects for address:", account.address);
      console.log("Using NFT type:", NFT_TYPE);
      
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: { StructType: NFT_TYPE },
        options: { showContent: true },
      });

      console.log("Owned objects fetched:", ownedObjects.data.length);

      const fetchedNFTs = ownedObjects.data
        .filter((obj) => obj.data?.content?.dataType === "moveObject")
        .map((obj) => {
          try {
            const content = obj.data!.content as any;
            const fields = content.fields;
            return {
              id: obj.data!.objectId,
              name: fields.name,
              description: fields.description || "",
              url: fields.url?.fields?.url || fields.url || "",
            };
          } catch (parseError) {
            console.error("Error parsing NFT:", obj, parseError);
            return null;
          }
        })
        .filter((nft) => nft !== null);

      console.log("NFTs parsed:", fetchedNFTs.length);

      setOwnedNFTs(fetchedNFTs);
      if (isRefresh) {
        toast.success("NFTs refreshed successfully");
      }
    } catch (error: any) {
      console.error("Failed to fetch owned NFTs", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error";
      toast.error(`Failed to load your NFTs: ${errorMessage}`);
    } finally {
      setIsLoadingOwnedNFTs(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOwnedNFTs();
    setRefreshOwnedNFTs(fetchOwnedNFTs);
  }, [account, suiClient]);

  async function handleList(nftId: string, price: number) {

    
    if (!account) {
      console.log("No account connected");
      toast.error("Please connect your wallet");
      return;
    }

    if (price <= 0) {
      console.log("Invalid price:", price);
      toast.error("Price must be greater than 0");
      return;
    }

    console.log("Starting listing process...");
    setIsListingNFT(nftId);
    const toastId = toast.loading("Listing NFT on marketplace...");

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${MARKETPLACE_MODULE}::list`,
        arguments: [
          tx.object(MARKETPLACE_OBJECT_ID),
          tx.object(nftId),
          tx.pure.u64(Math.floor(price * 1000000000)), // Convert SUI to MIST and ensure integer
        ],
      });
      tx.setGasBudget(1000000); // Increased gas budget for marketplace operations

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Listing transaction result:", result);
      toast.success("NFT listed successfully on marketplace!", { id: toastId });
      
      // Update the store with the listing information
      // We'll use a temporary listing ID until we can get the real one from the transaction
      const tempListingId = `listing-${nftId}-${Date.now()}`;
      onNFTListed(nftId, price, tempListingId, account.address);
      
      // Refresh marketplace listings to get the actual listing data
      setTimeout(() => {
        refreshMarketplace();
      }, 2000); // Give some time for the transaction to be processed
      
    } catch (error) {
      console.error("Listing failed:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to list NFT";
      if (error instanceof Error) {
        if (error.message.includes("Insufficient")) {
          errorMessage = "Insufficient balance to pay for transaction fees";
        } else if (error.message.includes("rejected")) {
          errorMessage = "Transaction was rejected";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Transaction timed out. Please try again";
        } else {
          errorMessage = `Listing failed: ${error.message}`;
        }
      }
      
      toast.error(errorMessage, { id: toastId });
      setIsListingNFT(null);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Heading
            size="6"
            style={{
              color: '#1A202C',
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.025em',
            }}
          >
            My NFTs
          </Heading>
          <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Your owned NFTs. List them for sale on the marketplace.
          </Text>
        </div>
        <button
          onClick={() => fetchOwnedNFTs(true)}
          disabled={isRefreshing}
          style={{
            backgroundColor: isRefreshing ? '#94A3B8' : '#4DA2FF',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'all 250ms ease-in-out',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.backgroundColor = '#0B93E8';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.backgroundColor = '#4DA2FF';
            }
          }}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {isLoadingOwnedNFTs ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <NFTCardSkeleton key={i} />
          ))}
        </div>
      ) : ownedNFTs.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#E5F3FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4DA2FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
            No NFTs owned yet. Mint your first NFT!
          </Text>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {ownedNFTs.map(({ id, name, url }) => (
            <NFTCard
              key={id}
              id={id}
              name={name}
              price="Not listed"
              url={url}
              onList={(price) => handleList(id, price)}
              isLoading={isListingNFT === id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
