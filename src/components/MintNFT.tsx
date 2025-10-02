import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Heading } from "@radix-ui/themes";
import { PACKAGE_ID } from "../constants";

export function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleMint = async () => {
    if (!name || !description || !url) {
      alert("Please fill in all fields");
      return;
    }

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
      alert("NFT minted successfully!");
      setName("");
      setDescription("");
      setUrl("");
    } catch (error) {
      alert("Minting failed: " + error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Heading size="4" className="mb-4">Mint New NFT</Heading>
      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="NFT URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
      />
      <Button onClick={handleMint} className="w-full">
        Mint NFT
      </Button>
    </div>
  );
}
