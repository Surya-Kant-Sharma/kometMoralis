import { createClient, gql } from 'urql'
 
const GrapghMintedQuery = async (contractAddress) => {

    try {
        console.log(contractAddress)

        const APIURL = 'https://api.thegraph.com/subgraphs/name/sk1122/komet-nft-subgraph'

        const tokensQuery = gql `
      query {
        nfts(where:{address : "0x01738eD1f0a2E286C32E6D452E2C1E5199b8CFC5"}) {
            id
            address
            tokenId
            amount
            owner
          }
      }
    `

    console.log(tokensQuery)
        const client = createClient({
            url: APIURL,
        })

        const data = await client.query(tokensQuery).toPromise()
        // console.log(data)
        return data
    } catch (err) {
        console.log(err.message)
    }

}
const getUserNfts = async (address) => {

    try {
        console.log(address)

        const APIURL = 'https://api.thegraph.com/subgraphs/name/sk1122/komet-nft-subgraph'

        const tokensQuery = gql `
      query {
        nfts(where:{owner : "${address}"}) {
            id
            address
            tokenId
            amount
            owner
          }
      }
    `

    console.log(tokensQuery)
        const client = createClient({
            url: APIURL,
        })

        const data = await client.query(tokensQuery).toPromise()
        console.log(data)
        return data
    } catch (err) {
        console.log(err.message)
    }

}

export {GrapghMintedQuery, getUserNfts}