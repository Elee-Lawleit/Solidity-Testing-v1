//we can either compile the contracts IN OUR CODE

//or we can do it SEPERATELY 

//we're gonna do it seperately


// *** CONNECTING TO A JAVASCRIPT VIRTUAL MACHINE ***

// endpoint URL http://127.0.0.1:7545

// we can make the API calls directly to the node through different provided methods, but you can also
// use a library (wrapper), that's what we're doing -- ethers and web3.js are two of the many libraries


const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main(){
    //this is how the application is gonna connect to the JSON-RPC protocol (our local blockchain)
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.JSON_RPC_PROVIDER_URL
    );

    //connecting to a wallet

    //you know kinda like how MetaMask creates a "Wallet" for you, you can give this wallet your private key and then use it to sign your transactions and stuff

    //I'm pretty sure if you get to nitty gritties of this, it's probably more complex BUT

    //you can think of a wallet as a function where you pass your account's info and it returns things that help you manage your account easily

    const wallet = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY, provider);

    //getting the wallet using the encrypted key now
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // //getting the wallet using the encrypted key
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PASSWORD);
    // //and then connecting that wallet to the provider
    // wallet = await wallet.connect(provider);

    //get the abi and binary of the contract
    const abi = fs.readFileSync(
      "./_SimpleStorage_sol_SimpleStorage.abi",
      "utf8"
    );
    const binary = fs.readFileSync("./_SimpleStorage_sol_SimpleStorage.bin", "utf8");

    //creating a contract factory (just an object which can be used to deploy contracts)

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    // console.log("Deployin contract, please wait...");

    //deploys the contract on the blockchain
    //basically sends a transaction to the blockchain
    //contract creation transaction
    const contract = await contractFactory.deploy();

    //to get block confirmations, this gives us 1 block confirmation, that our transaction was indeed included and the contract
    //was deployed
    const deploymentReceipt = await contract.deployTransaction.wait(1);
    console.log(`Contract address: ${contract.address}`);

    //transaction receipt and transaction response (deployTransaction) are two different things
    //normally we only get the transaction response, to get the receipt, we actually have WAIT for the block confirmations

    // console.log("Transaction response is:\n", contract.deployTransaction);

    // console.log("Transaction receipt is:");
    // console.log(deploymentReceipt);

    //sending a raw transaction, ie, filling in the transaction details ourselves instead of using contract factory or deploy methods

    // console.log("Deploying contract by creating raw transaction, please wait...");
    // const nonce = await wallet.getTransactionCount(); //--> to always get correct and updated nonce
    // const transaction = {
    //   //Block nonce and transaction nonce are different
    //   //transactions also use a nonce with each new transactions
    //   nonce: nonce,
    //   gasPrice: 20000000000,
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   //data is the contract binary that we got after compiling the contract
    //   data: "0x608060405234801561001057600080fd5b50610771806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632e64cec11461005c5780636057361d1461007a5780636f760f41146100965780638bab8dd5146100b25780639e7a13ad146100e2575b600080fd5b610064610113565b604051610071919061052a565b60405180910390f35b610094600480360381019061008f919061046d565b61011c565b005b6100b060048036038101906100ab9190610411565b610126565b005b6100cc60048036038101906100c791906103c8565b6101b6565b6040516100d9919061052a565b60405180910390f35b6100fc60048036038101906100f7919061046d565b6101e4565b60405161010a929190610545565b60405180910390f35b60008054905090565b8060008190555050565b6001604051806040016040528083815260200184815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908051906020019061018c9291906102a0565b505050806002836040516101a09190610513565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600181815481106101f457600080fd5b906000526020600020906002020160009150905080600001549080600101805461021d9061063e565b80601f01602080910402602001604051908101604052809291908181526020018280546102499061063e565b80156102965780601f1061026b57610100808354040283529160200191610296565b820191906000526020600020905b81548152906001019060200180831161027957829003601f168201915b5050505050905082565b8280546102ac9061063e565b90600052602060002090601f0160209004810192826102ce5760008555610315565b82601f106102e757805160ff1916838001178555610315565b82800160010185558215610315579182015b828111156103145782518255916020019190600101906102f9565b5b5090506103229190610326565b5090565b5b8082111561033f576000816000905550600101610327565b5090565b60006103566103518461059a565b610575565b90508281526020810184848401111561037257610371610704565b5b61037d8482856105fc565b509392505050565b600082601f83011261039a576103996106ff565b5b81356103aa848260208601610343565b91505092915050565b6000813590506103c281610724565b92915050565b6000602082840312156103de576103dd61070e565b5b600082013567ffffffffffffffff8111156103fc576103fb610709565b5b61040884828501610385565b91505092915050565b600080604083850312156104285761042761070e565b5b600083013567ffffffffffffffff81111561044657610445610709565b5b61045285828601610385565b9250506020610463858286016103b3565b9150509250929050565b6000602082840312156104835761048261070e565b5b6000610491848285016103b3565b91505092915050565b60006104a5826105cb565b6104af81856105d6565b93506104bf81856020860161060b565b6104c881610713565b840191505092915050565b60006104de826105cb565b6104e881856105e7565b93506104f881856020860161060b565b80840191505092915050565b61050d816105f2565b82525050565b600061051f82846104d3565b915081905092915050565b600060208201905061053f6000830184610504565b92915050565b600060408201905061055a6000830185610504565b818103602083015261056c818461049a565b90509392505050565b600061057f610590565b905061058b8282610670565b919050565b6000604051905090565b600067ffffffffffffffff8211156105b5576105b46106d0565b5b6105be82610713565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561062957808201518184015260208101905061060e565b83811115610638576000848401525b50505050565b6000600282049050600182168061065657607f821691505b6020821081141561066a576106696106a1565b5b50919050565b61067982610713565b810181811067ffffffffffffffff82111715610698576106976106d0565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61072d816105f2565b811461073857600080fd5b5056fea2646970667358221220829d6abf7cb6cc32bd2095ded4dc6c43d398b9a36cf9d29dc0a7e650ebe6a00164736f6c63430008070033",

    //   //every network has a chainId, for ganache, it is 5777
    //   //well, it apparently 1337, even though ganache shows 5777, it's actually 1337
    //   chainId: 1337,
    // };

    // //signing the transaction with out account's private key
    // const signedTransactionResponse = await wallet.signTransaction(transaction);
    // //this will return a signed transaction, we still have to send it to the blockchain !
    // console.log(signedTransactionResponse);

    // //sending an unsigned transaction
    // //NOPE, it's not unsigned, sendTransaction() signs the transaction anyways before sending it to the blockchain
    // const sendTxResponse = await wallet.sendTransaction(transaction);
    // //must wait at least 1 block confirmation, otherwise, we're not gonna get the tx response
    // await sendTxResponse.wait(1);
    // console.log(sendTxResponse)

    //calling the retrieve function of the contract
    const currentFavouriteNumber = await contract.retrieve(); //-> this will return a big number (in form of hex), 'cause you know
    //so convert it to string to see the actual value
    console.log(`Initial value of fav number: ${currentFavouriteNumber.toString()}`);

    //passing a string because js will get confused with big numbers, (7 isn't big, but just for good practice)
    //ethers will automatically work it out that it's a number, not a string
    const txResponse = await contract.store("7");
    const txReciept = await txResponse.wait(1);

    const updatedFavNumber = await contract.retrieve();
    console.log("Updated favourite number: " + updatedFavNumber.toString())

}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.log(error);
        process.exit(1);
    })