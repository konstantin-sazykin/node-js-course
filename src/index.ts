import colors from 'colors';
import { launchDb } from './db/db';
import { app } from './settings';

const port = 8080;

const bootstrap = async () => {
  try {
    await launchDb();
    app.listen(port, () => {
      console.log(colors.green(`Server started on port ${port}`));
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();
