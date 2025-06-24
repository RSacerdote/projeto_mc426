import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';
import { pathToFileURL } from 'url';

const app = express();
const port = 3000;

app.use(cors()); // Permite requisições de origens diferentes
app.use(express.json()); // Middleware para lidar com JSON no corpo das requisições
app.use(router)

const processArgv1URL = pathToFileURL(process.argv[1]).href; // Converter process.argv[1] para universal URL

if (import.meta.url === processArgv1URL) {
  console.log('Starting server...');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app