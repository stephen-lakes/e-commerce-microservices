import { swaggerMetadataStore } from "./utils/utilities";

export class Swagger {
  static authKey = "ApiKeyAuth";

  static pathGen(): Record<string, any> {
    return swaggerMetadataStore;
  }
}
