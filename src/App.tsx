import { useState } from "react";
import { Heading } from "@radix-ui/themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Toaster } from "react-hot-toast";
import { MintNFT } from "./components/MintNFT";
import { Marketplace } from "./components/Marketplace";
import { MyMintedNFTs } from "./components/MyMintedNFTsNew";
import { TakeProfits } from "./components/TakeProfits";
import { CustomConnectButton } from "./components/CustomConnectButton";
import { NFTStoreProvider } from "./components/NFTStoreProvider";

function App() {
  const [activeTab, setActiveTab] = useState("my-nfts");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#1A202C',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
          loading: {
            iconTheme: {
              primary: '#4DA2FF',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

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
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Logo - Always visible */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              fontWeight: '700',
              color: '#4DA2FF',
              letterSpacing: '-0.025em'
            }}>
              SUI NFT
            </div>
          </div>

          {/* Title - Hidden on mobile, shown on tablet+ */}
          <div style={{
            display: 'none',
            flexGrow: 1,
            textAlign: 'center'
          }}
          className="header-title"
          >
            <Heading
              size="8"
              style={{
                color: '#1A202C',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)'
              }}
            >
              NFT Marketplace
            </Heading>
          </div>

          {/* Wallet Section */}
          <div style={{ flexShrink: 0 }}>
            <CustomConnectButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <NFTStoreProvider>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Navigation */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '8px',
              marginBottom: 'clamp(16px, 4vw, 32px)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <TabsList className="tab-list">
              <TabsTrigger
                value="my-nfts"
                style={{
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  transition: 'all 250ms ease-in-out',
                  backgroundColor: activeTab === 'take-profits' ? '#4DA2FF' : 'transparent',
                  color: activeTab === 'take-profits' ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                className="hover:bg-[#E5F3FF]"
              >
                Profits
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
      </NFTStoreProvider>
    </div>
  );
}

export default App;