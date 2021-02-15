import { Router } from 'express';
// import middlewares from '../middlewares';
import { graphqlHTTP } from 'express-graphql';

/** SCHEMA AND RESOLVERS */
import { userSchema } from '../graphql/schema'

const route: Router = Router();
export default (app: Router) => {
  app.use(route)

  // set routes and set middlewares, required user logged
  route.use('/users',
    graphqlHTTP({
      schema: userSchema,
      graphiql: true,
    })
  )
}