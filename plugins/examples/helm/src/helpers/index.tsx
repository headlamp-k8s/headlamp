import yaml from 'js-yaml';

export function yamlToJSON(yamlObj: string) {
  return yaml.loadAll(yamlObj);
}

export function jsonToYAML(jsonObj: any) {
  return yaml.dump(jsonObj);
}
