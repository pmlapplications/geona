import express from 'express';
import * as hello from '../controllers/hello_world';

// Setup and export main router
const router = express.Router();
export default router;

// Setup sub routers
const helloRouter = express.Router({ mergeParams: true });

// Add sub routers
router.use('/hello', helloRouter);

// Add hello routes (could be in a seperate module)

/**
 * @swagger
 * /hello:
 *   get:
 *     description: Hello World!
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Hello World!
 */
helloRouter.get('/', hello.world);

/**
 * @swagger
 * /hello/world:
 *   get:
 *     description: Hello World!
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Hello World!
 */
helloRouter.get('/world', hello.world);

/**
 * @swagger
 * /hello/galaxy:
 *   get:
 *     description: Hello Galaxy!
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Hello Galaxy!
 */
helloRouter.get('/galaxy', hello.galaxy);

/**
 * @swagger
 * /hello/universe:
 *   get:
 *     description: Hello Universe!
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Hello Universe!
 */
helloRouter.get('/universe', hello.universe);
