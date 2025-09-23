import App from "./app";
import { CustomerRoute } from "./routes/customer";

const app = new App([CustomerRoute]);

app.listen();
