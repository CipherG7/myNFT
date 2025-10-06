import { useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { MintNFT } from "./components/MintNFT";
import { Marketplace } from "./components/Marketplace";
import { MyMintedNFTs } from "./components/MyMintedNFTsNew";
import { TakeProfits } from "./components/TakeProfits";

function App() {
  const [activeTab, setActiveTab] = useState("my-nfts");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        className="border-b border-gray-700"
      >
        <Box></Box>
        <Box>
          <Heading className="text-center">NFT MarketPlace</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container className="py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="mint">Mint</TabsTrigger>
            <TabsTrigger value="take-profits">Take Profits</TabsTrigger>
          </TabsList>
          <TabsContent value="my-nfts" className="mt-6 bg-gray-600 p-4 rounded-lg">
            <MyMintedNFTs />
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6 bg-gray-600 p-4 rounded-lg">
            <Marketplace />
          </TabsContent>
          <TabsContent value="mint" className="mt-6 bg-gray-600 p-4 rounded-lg">
            <MintNFT />
          </TabsContent>
          <TabsContent value="take-profits" className="mt-6 bg-gray-600 p-4 rounded-lg">
            <TakeProfits />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
