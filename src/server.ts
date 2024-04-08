import express, { Express } from 'express';
import dotenv from "dotenv";
import { db } from './config/db.config.js';
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




dotenv.config();

export const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(errorHandler);

// my routes
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/addblog', isAdmin);



//routes
app.use("/api", usersRouter, blogRouter, contactRouter, commentRouter)
db.then(() => {
    app.listen(port, () => console.log(`Server started at http://localhost:${port}`))
    
});

   
   
   

   