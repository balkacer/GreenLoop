import { createApp } from './app.js';
import { config } from './config.js';
import { seedDatabase } from './db/memoryStore.js';

seedDatabase();

const app = createApp();
app.listen(config.port, () => {
  console.log(`GreenLoop API en http://localhost:${config.port}`);
});
