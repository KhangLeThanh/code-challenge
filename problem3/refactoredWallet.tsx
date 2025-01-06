import React, { useMemo } from "react";

enum BlockchainPriority {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
  Default = -99,
}

type WalletBalance = {
  currency: string;
  amount: number;
  blockchain: string;
};

type FormattedWalletBalance = WalletBalance & {
  formatted: string;
};

type Props = BoxProps;

const getPriority = (blockchain: string): number => {
  return BlockchainPriority[blockchain as keyof typeof BlockchainPriority] ?? BlockchainPriority.Default;
};

export const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > BlockchainPriority.Default && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; 
      });
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className="wallet-row"
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
