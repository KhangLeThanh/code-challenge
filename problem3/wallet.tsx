
// WalletBalance & FormattedWalletBalance have same currency and amount. we can use one common type: WalletBalance and FormattedWalletBalance will be inherrited from WalletBallance
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

enum BlockchainPriority {
    Osmosis = 100,
    Ethereum = 50,
    Arbitrum = 30,
    Zilliqa = 20,
    Neo = 20,
    Default = -99, // Default priority for unknown blockchains
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  // using enum for improving type safety and readability. it also make code clean

   const getPriority = (blockchain: any): number => {
     switch (blockchain) {
       case "Osmosis":
         return 100;
       case "Ethereum":
         return 50;
       case "Arbitrum":
         return 30;
       case "Zilliqa":
         return 20;
       case "Neo":
         return 20;
       default:
         return -99;
     }
   };
  // this function is quite hard to understand, it's better to avoid using if else inside sort and filter function
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // this lhsPriority has not been defined, so it will cause error. I think correct one is balancePriority 
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // we dont use prices in this function, so prices needs to be removed from dependecies
  
// this one is called but never used and formattedBalances is  calculated after sortedBalances, but it is not memoized, so better to use useMemo
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // should not use index because a key prop can lead to rendering issues when the list changes dynamically
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
