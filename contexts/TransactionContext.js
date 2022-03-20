import React, { useState, useContext } from 'react'

const TransactionContext = React.createContext();

export function useTransaction() {
	return useContext(TransactionContext);
}

export function TransactionProvider({ children }) {
	const [lastTransaction, setLastTransaction] = useState(null);

	const updateTransaction = (transaction) => { setLastTransaction(transaction); }

	const value = {
		lastTransaction,
		updateTransaction
	}

  return (
	  <TransactionContext.Provider value={value}>
		  {children}
	  </TransactionContext.Provider>
  )
}
