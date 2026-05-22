import shutdown from '@config/shutdown';
import app from './app.js';

const server = app.listen(3000, () => {
  console.log('running on port 3000');
});
shutdown(server);
