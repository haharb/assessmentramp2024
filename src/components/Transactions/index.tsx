import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithCache, clearCacheByEndpoint, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      /*Bug 7: Clear cache before to ensure latest data is retrieved - HH 08/08/2024*/
      clearCacheByEndpoint(["transactionsByEmployee", "paginatedTransactions"])

    },
    [fetchWithCache, clearCacheByEndpoint]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
