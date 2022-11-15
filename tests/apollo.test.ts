import request from 'supertest';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import { v4 } from 'uuid';
import {Duck} from '../src/types';
import dotenv from 'dotenv';

dotenv.config();

describe("apollo query test", () => {
    jest.setTimeout(20000);
    const client = createClient({
        url: `ws://${process.env.HOST}:${process.env.PORT}/graphql`,
        webSocketImpl: WebSocket,
        generateID: () => v4()
    })
    test("getDucks", async () => {
        const res = await request( `http://${process.env.HOST}:${process.env.PORT}`)
            .post("/graphql")
            .send({
                query: `query getDucks {
                GetDucks {
                    id
                    name
                    age
                }
            }`
            });
        expect(res.body.data.GetDucks).toHaveLength(res.body.data.GetDucks.length);

    })
    test("createDuck", async () => {
        const res = await request("http://localhost:4000")
            .post("/graphql")
            .send({
                query: `mutation CreateDuck($duck: DuckCreate!) {
                    CreateDuck(duck: $duck) {
                      id
                      name
                      age
                    }
                  }`,
                variables: {
                    "duck": {
                        "age": 5,
                        "name": "Alon"
                    }
                }
            });
        expect(res.body.data.CreateDuck.age).toBe(5);
        expect(res.body.data.CreateDuck.name).toBe("Alon");
    })


    test("subscribeDucks", async () => {
        let resolveNext;
        const messagePromise = new Promise<{data: {SubscribeDucks: Duck}}>(resolve => {
            resolveNext = resolve;
        })
        const unsub = client.subscribe({
            query: `subscription SubscribeDucks {
                SubscribeDucks {
                  id
                  name
                  age
                }
            }`

        },
            {
                next: (message) => {
                    resolveNext(message);
                },
                error: () => { },
                complete: () => { }
            }
        )
        client.on("opened", () => {
            console.log("opened");
        })

        await new Promise<void>(resolve => {
            client.on("connected", (sink, payload) => {
                console.log(payload);
                 
                resolve();
            })
        })
        // await new Promise<void>(resolve => {
        //     setTimeout(resolve, 5000);
        // })
        const res = await request("http://localhost:4000")
            .post("/graphql")
            .send({
                query: `mutation CreateDuck($duck: DuckCreate!) {
                    CreateDuck(duck: $duck) {
                      id
                      name
                      age
                    }
                  }`,
                variables: {
                    "duck": {
                        "age": 5,
                        "name": "Alon"
                    }
                }
            });
        const message = await messagePromise;
        unsub();
        expect(message.data.SubscribeDucks).toStrictEqual(res.body.data.CreateDuck);
    })
})