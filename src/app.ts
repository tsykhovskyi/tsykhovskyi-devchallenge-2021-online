import express from "express";
import { SimpleBoxController } from './controller/simple-box-controller';

const app = express();
app.use(express.json());

app.post('/api/simple_box', (req, res) => (new SimpleBoxController()).index(req, res));

app.listen(8080, () =>
  console.log("application was started on http://localhost:8080")
);

process.on("SIGTERM", () => {
  process.exit(0);
});
process.on("SIGINT", () => {
  process.exit(0);
});
