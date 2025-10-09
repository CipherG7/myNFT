import { TextField } from "@radix-ui/themes";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface NFTCardProps {
  id: string;
  name: string;
  price: string;
  url?: string;
  onBuy?: () => void;
  onList?: (price: number) => void;
  isLoading?: boolean;
}

export function NFTCard({ id, name, price, url, onBuy, onList, isLoading = false }: NFTCardProps) {
  const [listPrice, setListPrice] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '320px',
        transition: 'all 250ms ease-in-out',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 20px rgba(77, 162, 255, 0.2)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      {url && (
        <img
          src={url}
          alt={name}
          style={{
            width: '100%',
            height: '192px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
          }}
        />
      )}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#1A202C',
          letterSpacing: '-0.025em',
        }}
      >
        {name}
      </h3>
      <p
        style={{
          fontSize: '0.75rem',
          color: '#94A3B8',
          marginBottom: '4px',
          fontFamily: 'monospace',
        }}
      >
        ID: {id.slice(0, 8)}...{id.slice(-6)}
      </p>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#4DA2FF',
          marginBottom: '16px',
        }}
      >
        {price}
      </p>

      {onBuy && (
        <button
          onClick={onBuy}
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: isLoading ? '#94A3B8' : '#4DA2FF',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'all 250ms ease-in-out',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#0B93E8';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#4DA2FF';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isLoading && <LoadingSpinner size="sm" color="#FFFFFF" />}
          {isLoading ? 'Processing...' : 'Buy NFT'}
        </button>
      )}

      {onList && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TextField.Root
            type="number"
            placeholder="Price in SUI"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              color: '#1A202C',
            }}
          />
          <button
            onClick={() => {
              const priceNum = parseFloat(listPrice);
              if (priceNum > 0) {
                onList(priceNum);
                setListPrice("");
              }
            }}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#94A3B8' : '#4DA2FF',
              color: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 250ms ease-in-out',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#0B93E8';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#4DA2FF';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading && <LoadingSpinner size="sm" color="#FFFFFF" />}
            {isLoading ? 'Listing...' : 'List for Sale'}
          </button>
        </div>
      )}
    </div>
  );
}
