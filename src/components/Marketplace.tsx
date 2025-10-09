
import { useEffect } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "./NFTCardSkeleton";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_MODULE } from "../marketplaceConstants";
import { useNFTStore, ListedNFT } from "../store/nftStore";
import toast from "react-hot-toast";

// Marketplace object ID
const MARKETPLACE_OBJECT_ID = "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a";

export function Marketplace() {
  const {
    marketplaceListings,
    setMarketplaceListings,
    isLoadingMarketplace,
    setIsLoadingMarketplace,
    isBuyingNFT,
    setIsBuyingNFT,
    onNFTBought,
    onNFTDelisted,
    setRefreshMarketplace
  } = useNFTStore();
  
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const fetchListings = async () => {
    setIsLoadingMarketplace(true);
    try {
      // Get dynamic fields of the marketplace (bag entries)
      const dynamicFields = await suiClient.getDynamicFields({
        parentId: MARKETPLACE_OBJECT_ID,
      });

      const fetchedListings: ListedNFT[] = [];

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
          const price = Number(fields.price) / 1000000000; // Convert from MIST to SUI
          const owner = fields.owner;

          // Get the NFT from the listing's dynamic field
          const nftField = await suiClient.getDynamicFieldObject({
            parentId: listingId,
            name: { type: "bool", value: true },
          });

          if (nftField.data?.content?.dataType === "moveObject") {
            const nftFields = nftField.data.content.fields as any;
            const name = nftFields.name;
            const description = nftFields.description || "";
            const url = nftFields.url.fields.url;

            fetchedListings.push({
              id: nftId,
              listingId,
              price,
              owner,
              name,
              description,
              url,
            });
          }
        }
      }

      setMarketplaceListings(fetchedListings);
    } catch (error) {
      console.error("Failed to fetch listings", error);
      toast.error("Failed to load marketplace listings");
      setMarketplaceListings([]);
    } finally {
      setIsLoadingMarketplace(false);
    }
  };

  useEffect(() => {
    fetchListings();
    setRefreshMarketplace(fetchListings);
  }, [suiClient]);

  async function handleBuy(nftId: string, price: number) {
    if (!account) {
      toast.error("Please connect your wallet to buy NFTs");
      return;
    }

    // Find the listing to get the listingId
    const listing = marketplaceListings.find((l) => l.id === nftId);
    if (!listing) {
      toast.error("Listing not found");
      return;
    }

    setIsBuyingNFT(nftId);
    const toastId = toast.loading("Purchasing NFT...");

    try {
      // Get user's SUI coins
      const coins = await suiClient.getCoins({
        owner: account.address,
        coinType: '0x2::sui::SUI',
      });

      if (coins.data.length === 0) {
        toast.error("No SUI coins found in wallet", { id: toastId });
        setIsBuyingNFT(null);
        return;
      }

      // Calculate required amount in MIST (1 SUI = 1,000,000,000 MIST)
      const requiredAmount = Math.floor(price * 1000000000);
      
      // Find a coin with sufficient balance or merge coins
      let paymentCoin = coins.data.find(coin => 
        parseInt(coin.balance) >= requiredAmount
      );

      const tx = new Transaction();

      if (!paymentCoin) {
        // Need to merge coins to get enough balance
        const totalBalance = coins.data.reduce((sum, coin) => 
          sum + parseInt(coin.balance), 0
        );

        if (totalBalance < requiredAmount) {
          toast.error(`Insufficient balance. Required: ${price} SUI, Available: ${totalBalance / 1000000000} SUI`, { id: toastId });
          setIsBuyingNFT(null);
          return;
        }

        // Merge coins
        const [primaryCoin, ...coinsToMerge] = coins.data;
        if (coinsToMerge.length > 0) {
          tx.mergeCoins(primaryCoin.coinObjectId, coinsToMerge.map(c => c.coinObjectId));
        }
        paymentCoin = primaryCoin;
      }

      // Split the exact amount needed for payment
      const [paymentCoinSplit] = tx.splitCoins(paymentCoin.coinObjectId, [requiredAmount]);

      // Call the marketplace buy function
      tx.moveCall({
        target: `${MARKETPLACE_MODULE}::buy_and_take`,
        arguments: [
          tx.object(MARKETPLACE_OBJECT_ID),
          tx.object(nftId),
          paymentCoinSplit,
        ],
      });
      
      tx.setGasBudget(100000000); // Increased gas budget

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Purchase transaction result:", result);
      toast.success("NFT purchased successfully!", { id: toastId });
      
      // Update the store with the purchase
      onNFTBought(listing.listingId, nftId);
    } catch (error) {
      toast.error(`Purchase failed: ${error}`, { id: toastId });
      setIsBuyingNFT(null);
    }
  }

  async function handleDelist(nftId: string, listingId: string) {
    if (!account) {
      toast.error("Please connect your wallet to delist NFTs");
      return;
    }

    setIsBuyingNFT(nftId); // Reuse the same loading state
    const toastId = toast.loading("Delisting NFT from marketplace...");

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${MARKETPLACE_MODULE}::delist_and_take`,
        arguments: [
          tx.object(MARKETPLACE_OBJECT_ID),
          tx.object(nftId),
        ],
      });
      tx.setGasBudget(100000000); // Increased gas budget

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Delist transaction result:", result);
      toast.success("NFT delisted successfully from marketplace!", { id: toastId });
      
      // Update the store - add back to owned NFTs and remove from marketplace
      onNFTDelisted(listingId, nftId);
    } catch (error) {
      toast.error(`Delisting failed: ${error}`, { id: toastId });
      setIsBuyingNFT(null);
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
        {isLoadingMarketplace ? (
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
        ) : marketplaceListings.length === 0 ? (
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
            {marketplaceListings.map(({ id, name, price, url, listingId, owner }) => {
              const isOwner = account?.address === owner;
              return (
                <NFTCard
                  key={listingId}
                  id={id}
                  name={name}
                  price={`${price} SUI`}
                  url={url}
                  onBuy={!isOwner ? () => handleBuy(id, price) : undefined}
                  onDelist={isOwner ? () => handleDelist(id, listingId) : undefined}
                  isLoading={isBuyingNFT === id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
