import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Heading } from "@radix-ui/themes";
import { PACKAGE_ID } from "../constants";
import { LoadingSpinner } from "./LoadingSpinner";
import toast from "react-hot-toast";

export function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleMint = async () => {
    if (!name || !description || !url) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsMinting(true);
    const toastId = toast.loading("Minting NFT...");

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::mynft::mint_to_sender`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(url),
        ],
      });
      tx.setGasBudget(100000000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      toast.success("NFT minted successfully!", { id: toastId });
      setName("");
      setDescription("");
      setUrl("");
    } catch (error) {
      toast.error(`Minting failed: ${error}`, { id: toastId });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 32px) 0' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#F8FAFB',
          padding: 'clamp(24px, 6vw, 48px)',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <Heading
          size="6"
          style={{
            marginBottom: '32px',
            textAlign: 'center',
            color: '#1A202C',
            fontWeight: '700',
            letterSpacing: '-0.025em',
          }}
        >
          Mint New NFT
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <input
            type="text"
            placeholder="NFT Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              height: '56px',
              padding: '0 20px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#1A202C',
              border: '1px solid #E2E8F0',
              fontSize: '0.875rem',
              transition: 'all 250ms ease-in-out',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4DA2FF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(77, 162, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <input
            type="text"
            placeholder="NFT Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              height: '56px',
              padding: '0 20px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#1A202C',
              border: '1px solid #E2E8F0',
              fontSize: '0.875rem',
              transition: 'all 250ms ease-in-out',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4DA2FF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(77, 162, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <input
            type="text"
            placeholder="NFT Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              height: '56px',
              padding: '0 20px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#1A202C',
              border: '1px solid #E2E8F0',
              fontSize: '0.875rem',
              transition: 'all 250ms ease-in-out',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4DA2FF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(77, 162, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
            <button
              onClick={handleMint}
              disabled={isMinting}
              style={{
                width: '100%',
                maxWidth: '200px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: isMinting ? '#94A3B8' : '#4DA2FF',
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 250ms ease-in-out',
                cursor: isMinting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!isMinting) {
                  e.currentTarget.style.backgroundColor = '#0B93E8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMinting) {
                  e.currentTarget.style.backgroundColor = '#4DA2FF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {isMinting && <LoadingSpinner size="sm" color="#FFFFFF" />}
              {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}