import App from "./app";
import { OrderRoute } from "./routes/order";

const app = new App([OrderRoute]);

app.listen();
