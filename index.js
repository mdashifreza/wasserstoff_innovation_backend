const express = require("express");
const app = express();
require("dotenv").config();
const axios = require('axios');
//moralis
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const chain = EvmChain.ETHEREUM;

// Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Router instance
const router = express.Router();
//moralis api key & port env
const PORT = process.env.PORT || 8085;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

//api call test
const apiCall = async() =>{
    try{
        const url = "https://api.etherscan.io/api?module=account&action=txlist&address=0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=ZJKR78KDP7MJ334H4K423I1G3589ICEWQK"
        const response = await axios.get(url);
        // console.log("api testing", response.data);
        const timestamp = 1654646411 * 1000; // converting seconds to milliseconds
const date = new Date(timestamp);

// console.log(date);
    }catch(error){
        console.log("error", error)
    }
}
apiCall();

router.get("/eth-price", async (req, res) => {
    try {
        const response = await Moralis.EvmApi.token.getTokenPrice({
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            chain,
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({error : "error while fething price of ether"});
    }
});

router.get("/address-search", async (req, res) => {
    try {
        const { query } = req;
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            address: query.wallAddToSearch,
            chain,
        });

        return res.status(200).json(response);
    } catch (error){
        return res.status(400).json({error : `Error in fetching price:`});
    }
});

// endpoint using router instances
app.use("/api", router);

//server start with moralis
Moralis.start({
    apiKey: MORALIS_API_KEY,
}).then(() => {
    app.listen(PORT, () => {
        console.log("server is listening at:-",PORT);
    });
});