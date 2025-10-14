import app from './app';
import config from './config';

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.debug(`Server running on http://localhost:${PORT}`);
});
