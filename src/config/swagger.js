import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, '../docs/swagger.yaml');
const swaggerDocs = YAML.load(swaggerPath);

export { swaggerDocs, swaggerUi };
