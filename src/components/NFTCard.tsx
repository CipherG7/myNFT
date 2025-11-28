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
  onDelist?: () => void;
  isLoading?: boolean;
}

export function NFTCard({ id, name, price, url, onBuy, onList, onDelist, isLoading = false }: NFTCardProps) {
  const [listPrice, setListPrice] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      {url && !imageError && (
        <img
          src={url}
          alt={name}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '192px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFB',
          }}
        />
      )}
      {(!url || imageError) && (
        <div
          style={{
            width: '100%',
            height: '192px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            {imageError ? 'Image failed to load' : 'No image'}
          </span>
        </div>
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            color: '#94A3B8',
            fontFamily: 'monospace',
            margin: 0,
          }}
        >
          ID: {id.slice(0, 8)}...{id.slice(-6)}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(id).then(() => {
              // Create a temporary toast notification
              const toast = document.createElement('div');
              toast.textContent = 'NFT ID copied!';
              toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10B981;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
              `;
              document.body.appendChild(toast);
              setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => document.body.removeChild(toast), 300);
              }, 2000);
            }).catch(() => {
              alert('Failed to copy to clipboard');
            });
          }}
          title="Copy NFT ID"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            transition: 'all 0.2s ease',
            minWidth: '20px',
            minHeight: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
            e.currentTarget.style.color = '#4DA2FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
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
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 250ms ease-in-out',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '48px',
            border: 'none',
            outline: 'none',
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

      {onDelist && (
        <button
          onClick={onDelist}
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: isLoading ? '#94A3B8' : '#EF4444',
            color: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 250ms ease-in-out',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '48px',
            border: 'none',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#EF4444';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isLoading && <LoadingSpinner size="sm" color="#FFFFFF" />}
          {isLoading ? 'Delisting...' : 'Delist NFT'}
        </button>
      )}

      {onList && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TextField.Root
            type="number"
            placeholder="Enter price in SUI (e.g., 1.5)"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            min="0.001"
            step="0.001"
            style={{
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '1rem',
              backgroundColor: '#FFFFFF',
              color: '#1A202C',
              minHeight: '48px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
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
          {listPrice && parseFloat(listPrice) <= 0 && (
            <p style={{ color: '#EF4444', fontSize: '0.75rem', margin: '4px 0' }}>
              Price must be greater than 0
            </p>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("List button clicked, listPrice:", listPrice);
              alert(`Button clicked! Price: ${listPrice}`);
              const priceNum = parseFloat(listPrice);
              console.log("Parsed price:", priceNum);
              if (priceNum > 0) {
                console.log("Calling onList with price:", priceNum);
                onList(priceNum);
                setListPrice("");
              } else {
                console.log("Invalid price, not calling onList");
                alert("Please enter a valid price greater than 0");
              }
            }}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#94A3B8' : '#4DA2FF',
              color: '#FFFFFF',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 250ms ease-in-out',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '2px solid #4DA2FF',
              outline: 'none',
              minHeight: '48px',
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
