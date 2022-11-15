const { createClient } = require('graphql-ws');
const WebSocket = require('ws');
const { v4 } = require( 'uuid');


async function start() {
    
    console.log("starting");

    const client = createClient({
        url: `ws://localhost:4000/graphql`,
        webSocketImpl: WebSocket,
        generateID: () => v4()
    })
    console.log("client created");
    
    client.on("opened", () => console.log("opened"));
    client.on("connecting", () => console.log("connecting"));
    client.on("connected", () => console.log("connected"));
    client.on("error", () => console.log("error"));
    client.on("message", () => console.log("message"));
    client.on("ping", () => console.log("ping"));
    client.on("pong", () => console.log("pong"));
    
    await new Promise(resolve => {
        setTimeout(resolve, 3000);
    })
    
    console.log("subscribing 1");
    
    const unsub1 = client.subscribe({
        query: `subscription SubscribeDucks {
            SubscribeDucks {
                id
                name
                age
            }
        }`
    },
    {
        next: (message) => { console.log("subscription message", message) },
        error: (error) => { console.log("subscription Error", error) },
        complete: () => {console.log("subscription Completed") }
    }
    )
    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    })
    console.log("subscribing 2");
    const unsub2 = client.subscribe({
        query: `subscription SubscribeDucks {
            SubscribeDucks {
                id
                name
            }
        }`
    },
    {
        next: (message) => { console.log("subscription2 message", message) },
        error: (error) => { console.log("subscription2 Error", error) },
        complete: () => {console.log("subscription2 Completed") }
    }
    )
    
    await new Promise(resolve => {
        setTimeout(resolve, 3000);
    })
    
    console.log("unsubscribing 1");
    unsub1();

    await new Promise(resolve => {
        setTimeout(resolve, 3000);
    })
    
    // console.log("unsubscribing 2");
    // unsub2();
    
    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    })
    
    console.log("dispose");
    await client.dispose();
} 

start();