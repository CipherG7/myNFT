import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useState } from "react";
import toast from "react-hot-toast";

export function CustomConnectButton() {
  const account = useCurrentAccount();
  const disconnect = useDisconnectWallet();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch balance
  const { data: balance } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address ?? "",
    },
    {
      enabled: !!account?.address,
      refetchInterval: 10000,
    },
  );

  const formatBalance = (balance: string) => {
    const sui = Number(balance) / 1_000_000_000;
    return sui.toFixed(4);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account.address);
        toast.success("Address copied!");
      } catch (error) {
        toast.error("Failed to copy");
      }
    }
  };

  // If not connected, show default ConnectButton
  if (!account) {
    return <ConnectButton />;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Custom Connected Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#4DA2FF",
          color: "#FFFFFF",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "0.875rem",
          fontWeight: "600",
          transition: "all 250ms ease-in-out",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0B93E8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4DA2FF";
        }}
      >
        <span style={{ fontFamily: "monospace" }}>
          {truncateAddress(account.address)}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease-in-out",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "12px",
              minWidth: "280px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            {/* Balance Section */}
            <div
              style={{
                padding: "12px",
                backgroundColor: "#F8FAFB",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748B",
                  marginBottom: "4px",
                  fontWeight: "600",
                }}
              >
                Balance
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  color: "#4DA2FF",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                {balance ? formatBalance(balance.totalBalance) : "0.0000"} SUI
              </div>
            </div>

            {/* Address Section */}
            <div
              onClick={copyAddress}
              style={{
                padding: "12px",
                backgroundColor: "#F8FAFB",
                borderRadius: "8px",
                marginBottom: "12px",
                cursor: "pointer",
                transition: "all 150ms ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E5F3FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFB";
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748B",
                  marginBottom: "4px",
                  fontWeight: "600",
                }}
              >
                Wallet Address
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.875rem",
                  color: "#1A202C",
                  fontFamily: "monospace",
                }}
              >
                <span>{truncateAddress(account.address)}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4DA2FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                disconnect.mutate();
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#FEF2F2",
                color: "#EF4444",
                border: "1px solid #FEE2E2",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 150ms ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FEE2E2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FEF2F2";
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
