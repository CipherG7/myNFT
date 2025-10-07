import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Heading } from "@radix-ui/themes";
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
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white p-12 shadow-2xl">
        <Heading size="4" className="mb-12 text-center text-3xl text-black font-bold">Mint New NFT</Heading>
        <div className="space-y-8">
          <input
            type="text"
            placeholder="NFT Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-5 rounded-3xl bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black border-2 border-black focus:border-black transition-all duration-200"
          />
          <input
            type="text"
            placeholder="NFT Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-14 px-5 rounded-3xl bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black border-2 border-black focus:border-black transition-all duration-200"
          />
          <input
            type="text"
            placeholder="NFT URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-14 px-5 rounded-3xl bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black border-2 border-black focus:border-black transition-all duration-200"
          />
          <div className="flex justify-center pt-8">
            <button onClick={handleMint} className="w-40 max-w-md h-12 rounded-3xl bg-black hover:bg-gray-800 text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-black">
              Mint NFT
            </button>
          </div>
        </div>
       
      </div>
    </div>
  );
}