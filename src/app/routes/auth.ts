import { Router, Request, Response, NextFunction } from 'express';
import Logger from '@loaders/logger';
import { Models } from '@app/models'
import { signInValidator, handlerValidator } from '@app/validator'
import { AuthController } from '@app/controller'
import { SERVER_ERROR, BAD_REQUEST } from '@utils/codes'

const route: Router = Router();

export default (app: Router) => {
  // GET INSTANCE OF AUTH_CONTROLLER
  const authController = new AuthController();
  const ROUTE = {
    prefixRoute: '/auth',
    signIn: '/sign-in',
    signUp: '/sign-up',
    logOut: '/logout',
  }

  app.use(ROUTE.prefixRoute, route);

  route.post(
    ROUTE.signIn,
    signInValidator,
    async (req: Request, res: Response) => {
      Logger.debug('Calling Sign In endpoint with body: %o', req.body)
      try {
        let { email, password } = req.body
        let response = await authController.signIn({ email, password })

        return res.json(response)
      } catch (err) {
        Logger.error('🔥 error: %o', err);
        return res.status(SERVER_ERROR).json(await handlerValidator.serializeErrors(err))
      }
    }
  )

  route.post(
    ROUTE.signUp,
    async (req: Request, res: Response, next: NextFunction) => {
      Logger.debug('Calling Sign Up endpoint with body: %o', req.body)
      try {
        let data = req.body
        let user = new Models.User(data)
        
        let userRegistered = await user.save()
        return res.json(userRegistered)
      } catch (err) {
        Logger.error('🔥 error: %o', err);
        return next(err);
      }
    }
  )

  route.post(
    ROUTE.logOut,
    async (req: Request, res: Response, next: NextFunction) => {
      Logger.debug('Calling Logout endpoint with body: %o')
      try {
        return res.end();
      } catch (err) {
        Logger.error('🔥 error: %o', err);
        return next(err);
      }
    }
  )
  /**
   * Handle Errors from celebrate
   */
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    let errors: any = []
     //if joi produces an error, it's likely a client-side problem
    if (error.details) {
      error.details.forEach((element: any) => {
        let item = element.details[0]
        errors.push({
          message: item.message,
          field: item.context.key
        })
      })
      return res.status(BAD_REQUEST).json({
        errors
      })
    }
    //otherwise, it's probably a server-side problem.  
    return res.status(SERVER_ERROR).send(error)
  });
}