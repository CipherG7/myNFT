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
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ minWidth: '120px' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#4DA2FF',
              letterSpacing: '-0.025em'
            }}>
              SUI NFT
            </div>
          </div>
          <div>
            <Heading
              size="8"
              style={{
                color: '#1A202C',
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}
            >
              NFT Marketplace
            </Heading>
          </div>
          <div style={{ minWidth: '120px', display: 'flex', justifyContent: 'flex-end' }}>
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Navigation */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '8px',
              marginBottom: '32px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <TabsList className="grid w-full grid-cols-4 gap-2">
              <TabsTrigger
                value="my-nfts"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 250ms ease-in-out',
                  backgroundColor: activeTab === 'my-nfts' ? '#4DA2FF' : 'transparent',
                  color: activeTab === 'my-nfts' ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                }}
                className="hover:bg-[#E5F3FF]"
              >
                My NFTs
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 250ms ease-in-out',
                  backgroundColor: activeTab === 'marketplace' ? '#4DA2FF' : 'transparent',
                  color: activeTab === 'marketplace' ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                }}
                className="hover:bg-[#E5F3FF]"
              >
                Marketplace
              </TabsTrigger>
              <TabsTrigger
                value="mint"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 250ms ease-in-out',
                  backgroundColor: activeTab === 'mint' ? '#4DA2FF' : 'transparent',
                  color: activeTab === 'mint' ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                }}
                className="hover:bg-[#E5F3FF]"
              >
                Mint
              </TabsTrigger>
              <TabsTrigger
                value="take-profits"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 250ms ease-in-out',
                  backgroundColor: activeTab === 'take-profits' ? '#4DA2FF' : 'transparent',
                  color: activeTab === 'take-profits' ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                }}
                className="hover:bg-[#E5F3FF]"
              >
                Take Profits
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent
            value="my-nfts"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <MyMintedNFTs />
          </TabsContent>
          <TabsContent
            value="marketplace"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <Marketplace />
          </TabsContent>
          <TabsContent
            value="mint"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <MintNFT />
          </TabsContent>
          <TabsContent
            value="take-profits"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <TakeProfits />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;