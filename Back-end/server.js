import express from 'express';
import router from './routes/index';
import db from './models/index';

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening in port ${port}`);
  });
});

export default app;
