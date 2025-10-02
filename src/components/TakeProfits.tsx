import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_TYPE } from "../marketplaceConstants";

export function TakeProfits() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleTakeProfits = async () => {
    if (!account) {
      alert("Please connect your wallet to take profits.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${MARKETPLACE_TYPE}::take_profits_and_keep`,
        arguments: [
          tx.object("0xece2306b9e52fbdafa0405a6276ee2cd182aec1fc5900cc22edadb38414acc1a"), // TODO: Replace with actual marketplace object ID
        ],
      });
      tx.setGasBudget(10000);

      await signAndExecuteTransaction({
        transaction: tx,
      });

      alert("Profits withdrawn successfully!");
    } catch (error) {
      alert("Failed to take profits: " + error);
    }
  };

  if (!account) {
    return <Text>Please connect your wallet to take profits.</Text>;
  }

  return (
    <Flex direction="column" gap="4" my="2">
      <Heading size="4">Take Profits</Heading>
      <Text>Withdraw your earnings from NFT sales.</Text>
      <Button onClick={handleTakeProfits} className="w-fit">
        Take Profits
      </Button>
    </Flex>
  );
}
