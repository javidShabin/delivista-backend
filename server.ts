import express, { Request, Response } from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Weclo"Welcome to Delivista!"');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
