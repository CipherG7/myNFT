import { useEffect, useState } from "react";
import { Heading, Text, Button } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { NFT_TYPE } from "../constants";
import { MARKETPLACE_TYPE } from "../marketplaceConstants";

// Marketplace object ID
const MARKETPLACE_OBJECT_ID = "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a";

interface OwnedNFT {
  id: string;
  name: string;
  url: string;
}

export function MyMintedNFTs() {
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const fetchOwnedNFTs = async () => {
    console.log("fetchOwnedNFTs called");
    if (!account) {
      console.log("No account connected");
      return;
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
    } catch (error) {
      console.error("Failed to fetch owned NFTs", error);
    }
  };

  useEffect(() => {
    fetchOwnedNFTs();
  }, [account, suiClient]);

  async function handleList(nftId: string, price: number) {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }

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

      alert("NFT listed successfully!");
      // Remove from owned NFTs
      setNfts((prev) => prev.filter((nft) => nft.id !== nftId));
    } catch (error) {
      alert("Listing failed: " + error);
    }
  }

  return (
    <div>
      <Heading size="4" className="mb-4">My Minted NFTs</Heading>
      <Text className="mb-6">Your owned NFTs. List them for sale.</Text>
      <Button onClick={fetchOwnedNFTs} className="mb-4">Refresh NFTs</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.length === 0 ? (
          <Text>No NFTs owned.</Text>
        ) : (
          nfts.map(({ id, name, url }) => (
            <NFTCard
              key={id}
              id={id}
              name={name}
              price="Not listed"
              url={url}
              onList={(price) => handleList(id, price)}
            />
          ))
        )}
      </div>
    </div>
  );
}
