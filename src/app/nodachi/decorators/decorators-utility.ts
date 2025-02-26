import 'reflect-metadata';
export class DecoratorsUtility {
  static getDecoratedProperties(origin: object, decorator: any): object {
    let metadataKey = decorator;
    if (typeof decorator == 'function') {
      metadataKey = decorator.name;
    }
    const properties: string[] = Reflect.getMetadata(metadataKey, origin);
    const result = {};
    if (properties) {
      properties.forEach((key) => (result[key] = origin[key]));
    }
    return result;
  }
}
