import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import blogRouter from './routes/blogRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './swagger/swaggerOptions';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import { usersRouter } from './routes/usersRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import { isAdmin } from './middleware/adminMiddleware.js';
import { extractUserId } from './middleware/authmiddleware.js';
import adminRouter from './routes/adminRoutes.js';
import { updateBlog } from './controllers/blogController.js';
import commentRouter from './routes/commentRoutes';
import likeRouter from './routes/likeRoutes';

dotenv.config();

export const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: ['https://my-brand-backend-5-pk68.onrender.com', 'http://127.0.0.1:5500', 'https://eracmsme13.github.io', 'https://hozerasme.netlify.app'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(errorHandler);

// Define Swagger documentation route
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api', usersRouter);
app.use('/api', contactRouter);
app.use('/api', adminRouter);
app.use('/api', blogRouter);
app.use('/api', commentRouter);
app.use('/api', likeRouter);

// Define route for updating a blog
app.put('/api/blog/update/:id', extractUserId, isAdmin, async (req, res, next) => {
    try {
        await updateBlog(req, res);
    } catch (error) {
        next(error); 
    }
});

// Establish database connection and start server
connectDB().then(() => {
    app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
}).catch(err => {
    console.error('Error connecting to database:', err);
});
