import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import blogRouter from './routes/blogRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './swagger/swaggerOptions';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import { usersRouter } from './routes/usersRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import { isAdmin } from './middleware/adminMiddleware.js';
import adminRouter from './routes/adminRoutes.js';

dotenv.config();

export const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(errorHandler);

// Define Swagger documentation route
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to ensure isAdmin is applied only to /api/addblog route
app.use('/api/addblog', isAdmin);

// Define routes
app.use('/api', usersRouter);
app.use('/api', blogRouter);
app.use('/api', contactRouter);
app.use('/api', commentRouter);
app.use('/api', adminRouter)

// Establish database connection and start server
connectDB().then(() => {
    app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
}).catch(err => {
    console.error('Error connecting to database:', err);
});
