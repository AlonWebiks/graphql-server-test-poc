import { Duck, DuckCreate } from "./types";

const ducks: Duck[] = [
    {
        id: "1",
        name: "joe",
        age: 5
    },
    {
        id: "2",
        name: "brown",
        age: 7
    },
    {
        id: "3",
        name: "bob",
        age: 2
    },
]

export const getDucks = () => ducks;

let pushMessage: (...args: any[]) => any = () => {};

const getMessage = () => {
    return new Promise<Duck>(resolve => {
        pushMessage = resolve
    })
}

const publishDuck = (duck: Duck) => {
    pushMessage({SubscribeDucks: duck});
}

export async function* duckSub() {
    while (true) {
        const duck = await getMessage();
        yield duck;
    }
}

export const createDuck = (duck: DuckCreate) => {
    const newDuck = {
        id: Math.round(Math.random() * 10000).toString(),
        ...duck
    };
    ducks.push(newDuck);
    publishDuck(newDuck);
    return newDuck;
}