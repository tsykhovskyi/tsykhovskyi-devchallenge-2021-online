import express from "express";
import { SimpleBoxController } from './controller/simple-box-controller';

const app = express();
app.use(express.json());

const simpleBoxController = new SimpleBoxController();

app.post('/api/simple_box', simpleBoxController.index.bind(simpleBoxController));

app.listen(8080, () =>
  console.log("application was started on http://localhost:8080")
);

process.on("SIGTERM", () => {
  process.exit(0);
});
process.on("SIGINT", () => {
  process.exit(0);
});
