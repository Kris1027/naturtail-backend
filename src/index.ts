import express, { Express, Request, Response } from 'express';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from Express with TypeScript!' });
});

app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
