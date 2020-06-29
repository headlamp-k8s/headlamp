/*
 * This module was taken from the k8dash project.
 */

import { OpenAPIV2 } from 'openapi-types';
import Swagger from 'swagger-parser';
import apis from './k8s/api';

let docsPromise: ReturnType<typeof getDocs>;

async function getDocs() {
  const docs = await apis.swagger();
  return Swagger.dereference(docs);
}

export default async function getDocDefinitions(apiVersion: string, kind: string) {
  if (!docsPromise) {
    docsPromise = getDocs(); // Don't wait here. Just kick off the request
  }

  const {definitions = {}} = (await docsPromise) as OpenAPIV2.Document;

  let [group, version] = apiVersion.split('/');
  if (!version) {
    version = group;
    group = '';
  }

  return Object.values(definitions)
    .filter(x => !!x['x-kubernetes-group-version-kind'])
    .find(x => x['x-kubernetes-group-version-kind'].some(comparer));

  function comparer(info: OpenAPIV2.SchemaObject) {
    return info.group === group
            && info.version === version
            && info.kind === kind;
  }
}
