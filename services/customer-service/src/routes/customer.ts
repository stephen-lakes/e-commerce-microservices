import CustomerController from "../controllers/customer.controller";
import { CustomerSample } from "../samples/customer.sample";
import { responseFormatter, Utility } from "../utils/utilities";

export const CustomerRoute = Utility.swaggerRouteToAppRoute({
  path: `customers`,
  controller: CustomerController,
  routes: [
    {
      route: `/`,
      method: `get`,
      handlerName: `getCustomers`,
      description: `Retrieve all customers`,
      sampleResponseData: responseFormatter(CustomerSample.customers),
    },
    {
      route: `/:id`,
      method: `get`,
      handlerName: `getCustomerById`,
      description: `Retreive a single customer by id`,
      parameters: [
        {
          name: `id`,
          in: `path`,
          required: true,
          schema: { type: `string`, example: `68d256de4a655ecc61fdbaf6` },
        },
      ],
      sampleResponseData: responseFormatter(CustomerSample.customer),
    },
  ],
});
