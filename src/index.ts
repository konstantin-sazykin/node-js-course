import colors from 'colors';

import { launchDb } from './db/db';
import { app } from './settings';

const port = 8080;

const bootstrap = async (): Promise<void> => {
  try {
    await launchDb();
    app.listen(port, () => {
      console.info(colors.green(`Server started on port ${port}`));
    });
  } catch (error) {
    console.info(error);
  }
};

void bootstrap();
