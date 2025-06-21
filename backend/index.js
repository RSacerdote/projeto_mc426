import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();
const port = 3000;

app.use(cors()); // Permite requisições de origens diferentes
app.use(express.json()); // Middleware para lidar com JSON no corpo das requisições
app.use(router)

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app