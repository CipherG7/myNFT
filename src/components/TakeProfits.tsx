import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_MODULE } from "../marketplaceConstants";
import { LoadingSpinner } from "./LoadingSpinner";
import toast from "react-hot-toast";

export function TakeProfits() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleTakeProfits = async () => {
    if (!account) {
      toast.error("Please connect your wallet to take profits");
      return;
    }

    setIsWithdrawing(true);
    const toastId = toast.loading("Withdrawing profits...");

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${MARKETPLACE_MODULE}::take_profits_and_keep`,
        arguments: [
          tx.object("0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a"), // TODO: Replace with actual marketplace object ID
        ],
      });
      tx.setGasBudget(10000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      toast.success("Profits withdrawn successfully!", { id: toastId });
    } catch (error) {
      toast.error(`Failed to withdraw profits: ${error}`, { id: toastId });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!account) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#E5F3FF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4DA2FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Please connect your wallet to take profits
        </Text>
      </div>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <div style={{ marginBottom: '16px' }}>
        <Heading
          size="6"
          style={{
            color: '#1A202C',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.025em',
          }}
        >
          Take Profits
        </Heading>
        <Text style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Withdraw your earnings from NFT sales
        </Text>
      </div>

      <div
        style={{
          backgroundColor: '#F8FAFB',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#E5F3FF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4DA2FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>

        <Text style={{ color: '#64748B', fontSize: '0.875rem', textAlign: 'center', maxWidth: '400px' }}>
          Click the button below to withdraw all accumulated profits from your NFT sales
        </Text>

        <button
          onClick={handleTakeProfits}
          disabled={isWithdrawing}
          style={{
            backgroundColor: isWithdrawing ? '#94A3B8' : '#10B981',
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'all 250ms ease-in-out',
            cursor: isWithdrawing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            if (!isWithdrawing) {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isWithdrawing) {
              e.currentTarget.style.backgroundColor = '#10B981';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          {isWithdrawing && <LoadingSpinner size="sm" color="#FFFFFF" />}
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Profits'}
        </button>
      </div>
    </Flex>
  );
}
