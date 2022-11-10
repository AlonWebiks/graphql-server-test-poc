import { createDuck, duckSub, getDucks } from "./duck.service";
import { DuckCreate } from "./types";


const resolvers = {
    Query: {
        GetDucks: () => getDucks(),
    },
    Mutation: {
        CreateDuck: (root: any, { duck }: { duck: DuckCreate }) => createDuck(duck),
    },
    Subscription: {
        SubscribeDucks: {
            subscribe: duckSub
        }
    }
}

export default resolvers;