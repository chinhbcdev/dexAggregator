const BigNumber = require('bignumber.js');
const qs = require('qs');
const web3 = require('web3');

let currentTrade = {};
let currentSelectSide;
let tokens;

async function init() {
    await listAvailableTokens();
}

async function listAvailableTokens(){
    console.log("initializing");
   // let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    tokens = tokenListJSON.tokens;
    console.log("tokens: ", tokens);

    // Create token list for modal
    let parent = document.getElementById("token_list");
    for (const i in tokens){
        // Token row in the modal token list
        let div = document.createElement("div");
        div.className = "token_row";
        let html = `
        <img class="token_list_img" src="${tokens[i].logoURI}">
          <span class="token_list_text">${tokens[i].symbol}</span>
          `;
        div.innerHTML = html;
        div.onclick = () => {
            selectToken(tokens[i]);
        };
        parent.appendChild(div);
    };
}

async function selectToken(token){
    closeModal();
    currentTrade[currentSelectSide] = token;
    console.log("currentTrade: ", currentTrade);
    renderInterface();
}

function renderInterface(){
    if (currentTrade.from){
        console.log(currentTrade.from)
        document.getElementById("from_token_img").src = currentTrade.from.logoURI;
        document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (currentTrade.to){
        console.log(currentTrade.to)
        document.getElementById("to_token_img").src = currentTrade.to.logoURI;
        document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            console.log("connecting");
            let accounts = await ethereum.request({ method: "eth_requestAccounts" });
            console.log(accounts[0]);
        } catch (error) {
            console.log(error);
        }
        // Switch to Goerli Testnet
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }]
  });
        document.getElementById("login_button").innerHTML = "Connected";
        // const accounts = await ethereum.request({ method: "eth_accounts" });
        document.getElementById("swap_button").disabled = false;
    } else {
        document.getElementById("login_button").innerHTML = "Please install MetaMask";
    }
}

function openModal(side){
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}

function closeModal(){
    document.getElementById("token_modal").style.display = "none";
}

async function getPrice(){
    console.log("Getting Price");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
    }

    const headers = {'0x-api-key': '[api-key]'}; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
  
    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`, { headers });
    
    swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    
    document.getElementById("to_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas;
}
const from_Value=50000000000000000
async function getQuote(account){
    console.log("Getting Quote");
    currentTrade.from = {
        
            "chainId": 1,
            "address": "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
            "name": "WETH",
            "symbol": "WETH",
            "decimals": 18,
            "logoURI": "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295"
        
    }
    currentTrade.to = {
        "chainId": 1,
        "address": "0xb93cba7013f4557cdfb590fd152d24ef4063485f",
        "name": "Dai",
        "symbol": "DAI",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734"
    }
    document.getElementById("from_amount").value = from_Value/(10 ** currentTrade.to.decimals);
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
        takerAddress: account,
    }
    
//     const headers = {
//     "vip": "c47def34-8f96-456c-9f3a-c30a4c18988f",
//     "0x-api-key": "[api-key]",
//     "Access-Control-Allow-Headers":""
// }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
  
    // Fetch the swap quote.
    // const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
    //  { headers });
    
    //const response = await fetch(`https://api.0x.org/swap/v1/quote?sellToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&buyToken=0x6b175474e89094c44da98b954eedeac495271d0f&sellAmount=1000&takerAddress=0xcb976099df1484c87b96685879571749cc007197`);
    
    
    // const response = await fetch(`https://api.0x.org/swap/v1/quote?sellToken=WETH&buyToken=DAI&sellAmount=100000000000000000000`,{ headers });
    // response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,**Authorization**');
    
//     const response= await fetch(`https://api.0x.org/swap/v1/quote?sellToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&buyToken=0x6b175474e89094c44da98b954eedeac495271d0f&sellAmount=100&takerAddress=0xcb976099df1484c87b96685879571749cc007197`, {
//   method: "GET",
//   headers: [
//     // ["Content-Type", "application/json"],
//     // ["Content-Type", "text/plain"],
//     ["0x-api-key","6b321e0f-8d29-45de-ac49-ef0726c2b4cc"],
    
//     //["mode", "no-cors"]
//   ],
//   //credentials: "include",
//   //body: JSON.stringify(exerciseForTheReader)
//   //mode: 'cors'
// });
const sellToken = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
const buyToken = "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844"; // DAI
//const buyToken = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; // DAI
const sellAmount = from_Value; // 0.1 ETH (18 decimals)
const headers = { "0x-api-key": "6b321e0f-8d29-45de-ac49-ef0726c2b4cc" }; // 
const takerAddress = "0xcb976099df1484C87B96685879571749CC007197"; 
// const response = await fetch(
//     `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`,
//     { headers },
//     gasLimit: '500000',
//   );
const response = await fetch(`https://goerli.api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`
//{
//   method: 'GET',
//   headers: [
//     ['0x-api-key', '6b321e0f-8d29-45de-ac49-ef0726c2b4cc']
//   ],
//   gasLimit: '500000'
//}
);
// const response = await fetch('https://api.0x.org/swap/v1/quote?sellToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&buyToken=0x6b175474e89094c44da98b954eedeac495271d0f&sellAmount=10000000000000000&takerAddress=0xcb976099df1484c87b96685879571749cc007197', {
//   method: 'GET',
//   headers: [
//     ['0x-api-key', '6b321e0f-8d29-45de-ac49-ef0726c2b4cc']
//   ],
//   gasLimit: '500000'
// });
//console.log(response);
    swapQuoteJSON = await response.json();
    console.log("Quote: 202", swapQuoteJSON);
    
    document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
   // document.getElementById("to_amount").value = swapQuoteJSON.buyAmount;
    document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas;
  
    return swapQuoteJSON;
}

async function trySwap(){
    const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
    console.log("trying swap");
  
    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);
  
    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);
  
    const swapQuoteJSON = await getQuote(takerAddress);
    console.log("164");
    console.log(swapQuoteJSON);

     // Set Token Allowance
    // Set up approval amount
    // const fromTokenAddress = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6';
    // const maxApproval = new BigNumber(2).pow(256).minus(1);
    // console.log("approval amount: ", maxApproval);
    // const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
    // console.log("setup ERC20TokenContract: ", ERC20TokenContract);
  
    // // Grant the allowance target an allowance to spend our tokens.
    // const tx = await ERC20TokenContract.methods.approve(
    //     swapQuoteJSON.allowanceTarget,
    //     maxApproval,
    // )
    // .send({ from: takerAddress })
    // .then(tx => {
    //     console.log("tx: ", tx)
    // });

    // Perform the swap
    const receipt = await web3.eth.sendTransaction({...swapQuoteJSON,from:takerAddress,value:from_Value});
    console.log("receipt: ", receipt);
   
}

init();

document.getElementById("login_button").onclick = connect;
document.getElementById("from_token_select").onclick = () => {
    openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
    openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
document.getElementById("from_amount").onblur = getPrice;
document.getElementById("swap_button").onclick = trySwap;