import ProductController from "../controllers/product.controller";
import { ProductSample } from "../samples/product.sample";
import { responseFormatter, Utility } from "../utils/utilities";

export const ProductRoute = Utility.swaggerRouteToAppRoute({
  path: `products`,
  controller: ProductController,
  routes: [
    {
      route: `/`,
      method: `get`,
      handlerName: `getProducts`,
      description: `Retrieve all products`,
      sampleResponseData: responseFormatter(ProductSample.products),
    },
    {
      route: `/:id`,
      method: `get`,
      handlerName: `getProductById`,
      description: `Retreive a single products by id`,
      parameters: [
        {
          name: `id`,
          in: `path`,
          required: true,
          schema: { type: `string`, example: `68d256de4a655ecc61fdbaf6` },
        },
      ],
      sampleResponseData: responseFormatter(ProductSample.product),
    },
  ],
});
