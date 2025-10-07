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
    <div className="min-h-screen bg-white text-black">
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        className="border-b border-black bg-white"
      >
        <Box></Box>
        <Box>
          <Heading className="text-center text-black" size="8">NFT MarketPlace</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container className="my-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white border-2 border-black p-4 rounded-lg mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-white ">
              <TabsTrigger value="my-nfts" className="text-black cursor-pointer  hover:bg-gray-100">My NFTs</TabsTrigger>
              <TabsTrigger value="marketplace" className="text-black cursor-pointer hover:bg-gray-100">Marketplace</TabsTrigger>
              <TabsTrigger value="mint" className="text-black cursor-pointer hover:bg-gray-100">Mint</TabsTrigger>
              <TabsTrigger value="take-profits" className="text-black cursor-pointer hover:bg-gray-100">Take Profits</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="my-nfts" className="mt-6 bg-white border-2 border-black p-4 rounded-lg">
            <MyMintedNFTs />
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6 bg-white border-2 border-black p-4 rounded-lg">
            <Marketplace />
          </TabsContent>
          <TabsContent value="mint" className="mt-6 bg-white border-2 border-black p-4 rounded-lg">
            <MintNFT />
          </TabsContent>
          <TabsContent value="take-profits" className="mt-6 bg-white border-2 border-black p-4 rounded-lg">
            <TakeProfits />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;