
import { useEffect, useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_TYPE } from "../marketplaceConstants";

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
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    async function fetchListings() {
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
        setListings([]);
      }
    }

    fetchListings();
  }, [suiClient]);

  async function handleBuy(nftId: string, price: number, coinId: string) {
    if (!account) {
      alert("Please connect your wallet to buy NFTs.");
      return;
    }
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
      alert("NFT purchased successfully!");
      // Refresh listings after purchase
      setListings((prev) => prev.filter((listing) => listing.nftId !== nftId));
    } catch (error) {
      alert("Purchase failed: " + error);
    }
  }

  return (
    <div>
      <Heading size="4" className="mb-4 text-black">NFT Marketplace</Heading>
      <Text className="mb-6 text-black">Browse and buy NFTs listed for sale.</Text>
      <div className="h-96 overflow-y-auto bg-white border-2 border-black p-4 rounded-lg">
        <div className="flex flex-col gap-4">
          {listings.length === 0 ? (
            <Text className="text-black">No NFTs listed for sale currently.</Text>
          ) : (
            listings.map(({ id, name, ask, url, nftId }) => (
              <NFTCard
                key={id}
                id={nftId}
                name={name}
                price={`${ask} SUI`}
                url={url}
                // Add buy button handler with placeholder coinId
                onBuy={() => handleBuy(nftId, ask, "0xcoinobjectidplaceholder")}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
