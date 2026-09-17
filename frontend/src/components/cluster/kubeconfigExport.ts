/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as yaml from 'js-yaml';

interface Cluster {
  name: string;
  cluster: {
    server: string;
    [key: string]: any;
  };
}

interface User {
  name: string;
  user: {
    token: string;
    [key: string]: any;
  };
}

export interface Kubeconfig {
  clusters: Cluster[];
  users: User[];
  contexts: { name: string; context: { cluster: string; user: string } }[];
  currentContext: string;
}

/**
 * Mirrors the backend's MakeDNSFriendly (backend/pkg/kubeconfig/kubeconfig.go):
 * context names are sanitized ('/' -> "--", ' ' -> '__') before they are
 * exposed as meta_data.originalName. Export selection therefore matches both
 * the raw context name and its sanitized form, so contexts literally named
 * with a slash or space (e.g. "team/dev") still export correctly.
 */
function toDnsFriendly(name: string): string {
  return name.replace(/\//g, '--').replace(/ /g, '__');
}

/**
 * Returns the subset of `config` containing only the entries referenced by the
 * given context names (the contexts themselves plus the clusters and users they
 * point at).
 *
 * @param config The full parsed kubeconfig.
 * @param selectedClusters The context names that were selected for import.
 */
export function configWithSelectedClusters(
  config: Kubeconfig,
  selectedClusters: string[]
): Kubeconfig {
  const newConfig: Kubeconfig = {
    clusters: [],
    users: [],
    contexts: [],
    currentContext: '',
  };

  // We use a map to avoid duplicates since many contexts can point to the same cluster/user.
  // Null-prototype so entries literally named "__proto__" become own properties
  // instead of hitting the legacy prototype setter and being dropped.
  const clusters: Record<string, Cluster> = Object.create(null);
  const users: Record<string, User> = Object.create(null);

  selectedClusters.forEach(clusterName => {
    const context =
      config.contexts.find(c => c.name === clusterName) ??
      config.contexts.find(c => toDnsFriendly(c.name) === clusterName);
    if (!context) {
      return;
    }

    const cluster = config.clusters.find(c => c.name === context.context.cluster);
    if (!cluster) {
      return;
    }
    clusters[cluster.name] = cluster;

    // Optionally add the user.
    const user = config.users?.find(c => c.name === context.context.user);
    if (!!user) {
      users[user.name] = user;
    }

    newConfig.contexts.push(context);
  });

  newConfig.clusters = Object.values(clusters);
  newConfig.users = Object.values(users);

  return newConfig;
}

/**
 * Maps the context names the backend reports as successfully loaded (DNS-friendly
 * sanitized forms, possibly duplicated when raw names collide after sanitization,
 * e.g. 'team/dev' and a literal 'team--dev' both report 'team--dev') back to the
 * raw selected context names, one-to-one: each raw name can be consumed by at most
 * one loaded entry. Exact matches are resolved first, then DNS-friendly matches,
 * so a literal 'team--dev' entry claims the literal context and the duplicate
 * entry falls back to the raw 'team/dev' context instead of exporting the literal
 * one twice.
 *
 * @param selectedClusters The raw context names selected for import.
 * @param loadedNames The context names reported by the backend for loaded clusters
 *   (meta_data.originalName, falling back to the cluster name).
 */
export function resolveLoadedContextNames(
  selectedClusters: string[],
  loadedNames: (string | undefined)[]
): string[] {
  const remaining = [...selectedClusters];
  const resolved: string[] = [];
  const pending: number[] = [];

  loadedNames.forEach((loaded, index) => {
    if (typeof loaded !== 'string' || loaded === '') {
      return;
    }
    const exact = remaining.indexOf(loaded);
    if (exact !== -1) {
      resolved.push(...remaining.splice(exact, 1));
    } else {
      pending.push(index);
    }
  });

  const names = loadedNames as string[];
  pending.forEach(index => {
    const dnsMatch = remaining.findIndex(raw => toDnsFriendly(raw) === names[index]);
    if (dnsMatch !== -1) {
      resolved.push(...remaining.splice(dnsMatch, 1));
    }
  });

  return resolved;
}

/**
 * Builds a portable kubeconfig YAML (apiVersion/kind/current-context included)
 * scoped to only the selected contexts, suitable for handing off to kubectl or
 * another tool.
 *
 * @param config The full parsed kubeconfig.
 * @param selectedClusters The context names that were selected for import.
 */
export function buildExportKubeconfigYaml(config: Kubeconfig, selectedClusters: string[]): string {
  const filtered = configWithSelectedClusters(config, selectedClusters);
  // Prefer the first selected context that survived filtering; fall back to the
  // first retained context so the exported file always has an active context.
  const currentContext =
    selectedClusters.find(name => filtered.contexts.some(c => c.name === name)) ??
    filtered.contexts[0]?.name ??
    '';

  return yaml.dump({
    apiVersion: 'v1',
    kind: 'Config',
    preferences: {},
    clusters: filtered.clusters,
    users: filtered.users,
    contexts: filtered.contexts,
    'current-context': currentContext,
  });
}
