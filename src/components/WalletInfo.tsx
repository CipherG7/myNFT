import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function WalletInfo() {
  const account = useCurrentAccount();

  // Fetch balance
  const { data: balance } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address ?? "",
    },
    {
      enabled: !!account?.address,
      refetchInterval: 10000, // Refresh every 10 seconds
    },
  );

  if (!account) {
    return null;
  }

  const formatBalance = (balance: string) => {
    const sui = Number(balance) / 1_000_000_000;
    return sui.toFixed(4);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#E5F3FF",
        border: "1px solid #4DA2FF",
        borderRadius: "8px",
        padding: "8px 12px",
      }}
    >
      {/* Wallet Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4DA2FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>

      {/* Balance */}
      <span
        style={{
          fontSize: "0.875rem",
          color: "#4DA2FF",
          fontWeight: "700",
          fontFamily: "monospace",
        }}
      >
        {balance ? formatBalance(balance.totalBalance) : "0.0000"} SUI
      </span>
    </div>
  );
}
