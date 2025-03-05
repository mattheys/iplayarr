import User from '../types/User'
import {Router, Express, Request, Response, NextFunction} from 'express';
import session from 'express-session'
import { ApiError, ApiResponse } from '../types/responses/ApiResponse';
import { getParameter } from '../service/configService';
import { IplayarrParameter } from '../types/IplayarrParameters';
import { md5 } from '../utils/Utils';

declare module 'express-session' {
    interface SessionData {
        user: User;
    }
}

const isDebug = process.env.DEBUG == 'true';
const router : Router = Router();

export const addAuthMiddleware = (app : Express) => {
    const sessionCookieSettings : any = {secure : false, maxAge: 1000 * 60 * 60 * 24}
    if (isDebug){
        sessionCookieSettings.sameSite = "lax";
    }

    app.use(session({
        secret: process.env.SESSION_SECRET || 'default_secret_key', // Replace in production
        resave: false,
        saveUninitialized: false,
        cookie: sessionCookieSettings
    }));

    // app.use("*", (req: Request, res: Response, next: NextFunction) => {    
    //     if (req.originalUrl == '/auth/me' && !req.session?.user) {
    //         res.status(401).json({ error : ApiError.NOT_AUTHORISED} as ApiResponse);
    //         return;
    //     } else {
    //         return next();
    //     }
    // });
}

router.post('/login', async (req: Request, res: Response) => {
    const [AUTH_USERNAME, AUTH_PASSWORD] = await Promise.all([
        getParameter(IplayarrParameter.AUTH_USERNAME),
        getParameter(IplayarrParameter.AUTH_PASSWORD),
    ])
    const { username, password } = req.body;

    // Replace this with actual authentication logic
    if (username === AUTH_USERNAME && md5(password) === AUTH_PASSWORD) {
        req.session.user = { username };
        res.json(true);
        return;
    }

    res.status(401).json({ error : ApiError.INVALID_CREDENTIALS} as ApiResponse);

});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.json(true);
    });
  });

router.get('/me', (req : Request, res : Response) => {
    if (!req.session?.user){
        res.status(401).json({ error : ApiError.NOT_AUTHORISED} as ApiResponse);
        return;
    } else {
        res.json(req.session.user);
        return;
    }
});

export default router;