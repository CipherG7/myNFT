import { useEffect, useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "./NFTCardSkeleton";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { NFT_TYPE } from "../constants";
import { MARKETPLACE_TYPE } from "../marketplaceConstants";
import toast from "react-hot-toast";

// Marketplace object ID
const MARKETPLACE_OBJECT_ID = "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a";

interface OwnedNFT {
  id: string;
  name: string;
  url: string;
}

export function MyMintedNFTs() {
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listingNftId, setListingNftId] = useState<string | null>(null);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const fetchOwnedNFTs = async (isRefresh = false) => {
    console.log("fetchOwnedNFTs called");
    if (!account) {
      console.log("No account connected");
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: { StructType: NFT_TYPE },
        options: { showContent: true },
      });

      console.log("Owned objects fetched:", ownedObjects.data.length);

      const fetchedNFTs: OwnedNFT[] = ownedObjects.data
        .filter((obj) => obj.data?.content?.dataType === "moveObject")
        .map((obj) => {
          const content = obj.data!.content as any;
          const fields = content.fields;
          return {
            id: obj.data!.objectId,
            name: fields.name,
            url: fields.url.fields.url,
          };
        });

      console.log("NFTs parsed:", fetchedNFTs.length);

      setNfts(fetchedNFTs);
      if (isRefresh) {
        toast.success("NFTs refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to fetch owned NFTs", error);
      toast.error("Failed to load your NFTs");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOwnedNFTs();
  }, [account, suiClient]);

  async function handleList(nftId: string, price: number) {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    setListingNftId(nftId);
    const toastId = toast.loading("Listing NFT...");

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${MARKETPLACE_TYPE}::list`,
        arguments: [
          tx.object(MARKETPLACE_OBJECT_ID),
          tx.object(nftId),
          tx.pure.u64(price * 1000000000), // Convert SUI to MIST
        ],
      });
      tx.setGasBudget(10000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      toast.success("NFT listed successfully!", { id: toastId });
      // Remove from owned NFTs
      setNfts((prev) => prev.filter((nft) => nft.id !== nftId));
    } catch (error) {
      toast.error(`Listing failed: ${error}`, { id: toastId });
    } finally {
      setListingNftId(null);
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

      {isLoading ? (
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
      ) : nfts.length === 0 ? (
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
          {nfts.map(({ id, name, url }) => (
            <NFTCard
              key={id}
              id={id}
              name={name}
              price="Not listed"
              url={url}
              onList={(price) => handleList(id, price)}
              isLoading={listingNftId === id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
