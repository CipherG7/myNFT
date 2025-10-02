# TODO: Fix NFT Listing and Marketplace Fetching

## 1. Update Marketplace Object ID
- [x] Update MARKETPLACE_OBJECT_ID in Marketplace.tsx to "0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a"

## 2. Implement Real Listings Fetching
- [x] Replace placeholder listings with actual fetching using getDynamicFields on marketplace
- [x] For each listing, fetch the Listing object and the NFT via dynamic field
- [x] Parse ask, owner, name, url from the data

## 3. Implement MyMintedNFTs to Show Owned NFTs
- [x] Fetch owned NFTs using getOwnedObjects with NFT_TYPE
- [x] Display them with NFTCard, add list button

## 4. Add List Functionality
- [x] Add price input and list button to NFTCard or separate component
- [x] Call marketplace.list with the NFT and price

## 5. Test
- [x] Mint NFTs, list them, check marketplace
