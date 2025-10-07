import { TextField } from "@radix-ui/themes";
import { useState } from "react";

interface NFTCardProps {
  id: string;
  name: string;
  price: string;
  url?: string;
  onBuy?: () => void;
  onList?: (price: number) => void;
}

export function NFTCard({ id, name, price, url, onBuy, onList }: NFTCardProps) {
  const [listPrice, setListPrice] = useState("");

  return (
    <div className="bg-white border-2 p-4 rounded-lg shadow-md max-w-xs">
      {url && (
        <img
          src={url}
          alt={name}
          className="w-full h-48 object-cover rounded mb-4 border border-black"
        />
      )}
      <h3 className="text-lg font-semibold mb-2 text-black">{name}</h3>
      <p className="text-sm text-gray-700 mb-1">ID: {id}</p>
      <p className="text-sm text-gray-700 mb-4">Price: {price}</p>
      {onBuy && <button className="w-full bg-black text-white border-2 border-black hover:bg-gray-800" onClick={onBuy}>Buy</button>}
      {onList && (
        <div className="space-y-2">
          <TextField.Root
            className="border-2 border-black bg-white text-black"
            type="number"
            placeholder="Price in SUI"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
          />
          <button
            className="w-full bg-black text-white border-2 border-black hover:bg-gray-800"
            onClick={() => {
              const priceNum = parseFloat(listPrice);
              if (priceNum > 0) {
                onList(priceNum);
                setListPrice("");
              }
            }}
          >
            List
          </button>
        </div>
      )}
    </div>
  );
}
