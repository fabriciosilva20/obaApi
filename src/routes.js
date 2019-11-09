import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StoreController from './app/controllers/StoreController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.get('/teste', (req, res) => res.json({ messaeg: 'Olá mundo' }));

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.get('/stores', StoreController.index);
routes.post('/stores', StoreController.store);
routes.put('/stores', StoreController.update);
routes.delete('/stores/:id', StoreController.delete);

export default routes;
