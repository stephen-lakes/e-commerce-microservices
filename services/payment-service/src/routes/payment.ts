import PaymentController from "../controllers/payment";
import { TransactionSample } from "../samples/payment";
import { responseFormatter, Utility } from "../utils/utilities";

export const PaymentRoute = Utility.swaggerRouteToAppRoute({
  path: `payments`,
  controller: PaymentController,
  routes: [
    {
      route: `/`,
      method: `post`,
      handlerName: `makePayment`,
      description: `make payment`,
      sampleRequestData: TransactionSample.transaction,
      sampleResponseData: responseFormatter(
        TransactionSample.transactionResponse
      ),
    },
  ],
});
