import { gql } from "apollo-server-core";

export default gql`
    type Duck {
        id: ID!
        name: String!
        age: Int!
    }
    
    input  DuckCreate {
        name: String!
        age: Int!
    }

    type Query {
        GetDucks: [Duck]
    }

    type Mutation {
        CreateDuck(duck: DuckCreate!): Duck
    }

    type Subscription {
        SubscribeDucks: Duck
    }
`