import App from "./app";
import { PaymentRoute } from "./routes/payment";

const app = new App([PaymentRoute]);

app.listen();
