import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const app = express();
const swaggerDocument = load(readFileSync('docs/openapi.yaml', 'utf8'));

app.use('/api-docs', serve, setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
