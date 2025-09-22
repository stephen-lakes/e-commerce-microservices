import App from "./app";
import { ProductRoute } from "./routes/product.route";

const app = new App([ProductRoute]);

app.listen();
