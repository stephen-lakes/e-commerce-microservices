import OrderController from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrderSample } from "../samples/order.sample";
import { responseFormatter, Utility } from "../utils/utilities";

export const OrderRoute = Utility.swaggerRouteToAppRoute({
  path: `orders`,
  controller: OrderController,
  routes: [
    {
      route: `/`,
      method: `post`,
      handlerName: `createOrder`,
      description: `create an order`,
      middlewares: [authMiddleware],
      sampleRequestData: OrderSample.create,
      sampleResponseData: responseFormatter(OrderSample.order),
    },
    {
      route: `/:id`,
      method: `get`,
      handlerName: `getOrderById`,
      description: `Retreive a single order by id`,
      parameters: [
        {
          name: `id`,
          in: `path`,
          required: true,
          schema: { type: `string`, example: `68d256de4a655ecc61fdbaf6` },
        },
      ],
      middlewares: [authMiddleware],
      sampleResponseData: responseFormatter(OrderSample.order),
    },
  ],
});
