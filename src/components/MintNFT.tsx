import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Heading } from "@radix-ui/themes";
import { PACKAGE_ID } from "../constants";
import { LoadingSpinner } from "./LoadingSpinner";
import { useNFTStore } from "../store/nftStore";
import toast from "react-hot-toast";

export function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { isMinting, setIsMinting, onNFTMinted } = useNFTStore();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Helper function to convert File to base64
  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data:image/...;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleMint = async () => {
    if (!name || !description || !file) {
      toast.error("Please fill in all fields and select an image");
      return;
    }

    if (!currentAccount?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsMinting(true);
    const toastId = toast.loading("Uploading image to Walrus...");

    try {
      // Convert file to base64
      const fileBase64 = await fileToBase64(file);

      toast.loading("Uploading to publisher...", { id: toastId });

      // Upload to Walrus via publisher (testnet publisher endpoint)
      const publisherUrl = 'https://publisher.walrus-testnet.walrus.space';
      const uploadResponse = await fetch(`${publisherUrl}/v1/blobs?epochs=5`, {
        method: 'PUT',
        body: file, // Send the file directly
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      
      // The response contains newlyCreated or alreadyCertified with blobId
      const blobId = uploadResult.newlyCreated?.blobObject?.blobId || 
                    uploadResult.alreadyCertified?.blobId;

      if (!blobId) {
        throw new Error('No blob ID returned from upload');
      }

      console.log("Walrus upload successful. Blob ID:", blobId);
      console.log("Upload result:", uploadResult);

      // Construct the image URL
      const imageUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;

      // If newly created, wait a moment for certification
      if (uploadResult.newlyCreated) {
        toast.loading("Waiting for blob certification...", { id: toastId });
        // Wait 10 seconds for the blob to be certified and become available
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

      toast.loading("Minting NFT...", { id: toastId });

      // Create and execute the mint transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::testnet_nft::mint_to_sender`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(imageUrl),
        ],
      });
      // Reduced gas budget - 0.01 SUI should be enough for a simple mint
      tx.setGasBudget(10000000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      toast.success("NFT minted successfully!", { id: toastId });

      // Add the minted NFT to the store
      onNFTMinted({
        id: `temp-${Date.now()}`,
        name,
        description,
        url: imageUrl,
      });

      // Reset form
      setName("");
      setDescription("");
      setFile(null);
      setIsMinting(false);
    } catch (error: any) {
      console.error("Minting error:", error);
      toast.error(`Minting failed: ${error.message || error}`, { id: toastId });
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
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
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