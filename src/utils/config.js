const checkWalletIsConnected = async () => {
	const { ethereum } = window;

	if (!ethereum) {
	  alert("Please install MetaMask");
	  return;
	}
	try {
	  const accounts = await ethereum.request({
		method: "eth_accounts",
	  });
	  if (accounts.length !== 0) {
		const account = accounts[0];
		return account;
	  } else {
		alert("No authorised account found");
	  }
	} catch (error) {
	  console.log(error);
	}
  };

  const connectWalletHandler = async () => {
	const { ethereum } = window;

	if (!ethereum) {
	  alert("Please install MetaMask");
	  return;
	}
	try {
	  const accounts = await ethereum.request({
		method: "eth_requestAccounts",
	  });
	  if (accounts.length !== 0) {
		const account = accounts[0];
		return account;
	  } else {
		alert("No authorised account found");
	  }
	} catch (error) {
	  if (error.code === 4001) {
		// EIP-1193 userRejectedRequest error
		console.log("Please connect to MetaMask.");
	  } else {
		console.error(error);
	  }
	}
  };

  export { checkWalletIsConnected, connectWalletHandler };
