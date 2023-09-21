const { TwitterApi } = require('twitter-api-v2')

const client = new TwitterApi({
    appKey: "B1zNwqoVDroUqDESwzyKHiqWr",
    appSecret: "DKK9iPr9833nE6W83afX919xC3fci1HenuqL8xaNnoEXcpXNzR",
    accessToken: "1679239838372073472-xjErnEF30BrV3H7i7P1IzevInSLbBL",
    accessSecret: "C8LOQ6qWyEMqTWOP9F5bwt0NqEFynze6Dchrh18uFi1Xe"
})

const rwClient = client.readWrite

async function tweet(){
    try{
        await rwClient.v2.tweet("Tutorly Api test")
    }
    catch(e){
        console.log(e);
    }
}

module.exports = { tweet }