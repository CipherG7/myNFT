import { Button, TextField } from "@radix-ui/themes";
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
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-xs">
      {url && (
        <img
          src={url}
          alt={name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-400 mb-1">ID: {id}</p>
      <p className="text-sm text-gray-400 mb-4">Price: {price}</p>
      {onBuy && <Button className="w-full" onClick={onBuy}>Buy</Button>}
      {onList && (
        <div className="space-y-2">
          <TextField.Root
            type="number"
            placeholder="Price in SUI"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {
              const priceNum = parseFloat(listPrice);
              if (priceNum > 0) {
                onList(priceNum);
                setListPrice("");
              }
            }}
          >
            List
          </Button>
        </div>
      )}
    </div>
  );
}
