import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import routes from './routes';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  }));

// Static files (e.g., uploaded images/videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API Routes
app.use('/api', routes);

app.get('/', (_req, res) => {
    res.send('API is working!');
  });
  

export default app;
