
import { useEffect, useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "./NFTCardSkeleton";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_TYPE } from "../marketplaceConstants";
import toast from "react-hot-toast";

// Marketplace object ID
const MARKETPLACE_OBJECT_ID = "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a";

interface Listing {
  id: string;
  ask: number;
  owner: string;
  nftId: string;
  name: string;
  url: string;
}

export function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buyingNftId, setBuyingNftId] = useState<string | null>(null);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      try {
        // Get dynamic fields of the marketplace (bag entries)
        const dynamicFields = await suiClient.getDynamicFields({
          parentId: MARKETPLACE_OBJECT_ID,
        });

        const fetchedListings: Listing[] = [];

        for (const field of dynamicFields.data) {
          const nftId = field.name.value as string;
          const listingId = field.objectId;

          // Get the listing object
          const listingObj = await suiClient.getObject({
            id: listingId,
            options: { showContent: true },
          });

          if (listingObj.data?.content?.dataType === "moveObject") {
            const fields = listingObj.data.content.fields as any;
            const ask = Number(fields.ask);
            const owner = fields.owner;

            // Get the NFT from the listing's dynamic field
            const nftField = await suiClient.getDynamicFieldObject({
              parentId: listingId,
              name: { type: "bool", value: true },
            });

            if (nftField.data?.content?.dataType === "moveObject") {
              const nftFields = nftField.data.content.fields as any;
              const name = nftFields.name;
              const url = nftFields.url.fields.url;

              fetchedListings.push({
                id: listingId,
                ask,
                owner,
                nftId,
                name,
                url,
              });
            }
          }
        }

        setListings(fetchedListings);
      } catch (error) {
        console.error("Failed to fetch listings", error);
        toast.error("Failed to load marketplace listings");
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [suiClient]);

  async function handleBuy(nftId: string, _price: number, coinId: string) {
    if (!account) {
      toast.error("Please connect your wallet to buy NFTs");
      return;
    }

    setBuyingNftId(nftId);
    const toastId = toast.loading("Processing purchase...");

    try {
      const tx = new Transaction();
      // Construct the buy_and_take call transaction with correct arguments
      tx.moveCall({
        target: `${MARKETPLACE_TYPE}::buy_and_take`,
        arguments: [
          tx.object(MARKETPLACE_OBJECT_ID),
          tx.object(nftId),
          tx.object(coinId),
        ],
      });
      tx.setGasBudget(10000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      toast.success("NFT purchased successfully!", { id: toastId });
      // Refresh listings after purchase
      setListings((prev) => prev.filter((listing) => listing.nftId !== nftId));
    } catch (error) {
      toast.error(`Purchase failed: ${error}`, { id: toastId });
    } finally {
      setBuyingNftId(null);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Heading
          size="6"
          style={{
            color: '#1A202C',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.025em',
          }}
        >
          NFT Marketplace
        </Heading>
        <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Browse and buy NFTs listed for sale
        </Text>
      </div>

      <div
        style={{
          height: '500px',
          overflowY: 'auto',
          backgroundColor: '#F8FAFB',
          border: '1px solid #E2E8F0',
          padding: '16px',
          borderRadius: '12px',
        }}
      >
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
        ) : listings.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
              No NFTs listed for sale currently
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
            {listings.map(({ id, name, ask, url, nftId }) => (
              <NFTCard
                key={id}
                id={nftId}
                name={name}
                price={`${ask} SUI`}
                url={url}
                onBuy={() => handleBuy(nftId, ask, "0xcoinobjectidplaceholder")}
                isLoading={buyingNftId === nftId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
