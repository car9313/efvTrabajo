import 'reflect-metadata';

const metadataKey = 'IsFilter';

export function IsFilter(): (target: object, propertyKey: string) => void {
  return registerProperty;
}

function registerProperty(target: object, propertyKey: string): void {
  let properties: string[] = Reflect.getMetadata(IsFilter.name, target);

  if (properties) {
    properties.push(propertyKey);
  } else {
    properties = [propertyKey];
    Reflect.defineMetadata(IsFilter.name, properties, target);
  }
}
