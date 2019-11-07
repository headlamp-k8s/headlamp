/*
 * This module was taken from the k8dash project.
 */

import Swagger from 'swagger-parser';
import apis from './api';

let docsPromise;

async function getDocs() {
    const docs = await apis.swagger();
    return Swagger.dereference(docs);
}

export default async function getDocDefinitions(apiVersion, kind) {
    if (!docsPromise) {
        docsPromise = getDocs(); // Don't wait here. Just kick off the request
    }

    const {definitions} = await docsPromise;

    let [group, version] = apiVersion.split('/');
    if (!version) {
        version = group;
        group = '';
    }

    return Object.values(definitions)
        .filter(x => !!x['x-kubernetes-group-version-kind'])
        .find(x => x['x-kubernetes-group-version-kind'].some(comparer));

    function comparer(info) {
        return info.group === group
            && info.version === version
            && info.kind === kind;
    }
}
