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

import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import {
  buildExportKubeconfigYaml,
  configWithSelectedClusters,
  resolveLoadedContextNames,
} from './kubeconfigExport';

const fullConfig = {
  clusters: [
    { name: 'cluster-a', cluster: { server: 'https://a.example.invalid' } },
    { name: 'cluster-b', cluster: { server: 'https://b.example.invalid' } },
    { name: 'cluster-c', cluster: { server: 'https://c.example.invalid' } },
  ],
  users: [
    { name: 'user-a', user: { token: 'token-a' } },
    { name: 'user-b', user: { token: 'token-b' } },
    { name: 'user-c', user: { token: 'token-c' } },
  ],
  contexts: [
    { name: 'ctx-a', context: { cluster: 'cluster-a', user: 'user-a' } },
    { name: 'ctx-b', context: { cluster: 'cluster-b', user: 'user-b' } },
    { name: 'ctx-c', context: { cluster: 'cluster-c', user: 'user-c' } },
  ],
  currentContext: 'ctx-a',
};

describe('configWithSelectedClusters', () => {
  it('keeps only the selected contexts and the clusters/users they reference', () => {
    const filtered = configWithSelectedClusters(fullConfig, ['ctx-a', 'ctx-c']);

    expect(filtered.contexts.map(c => c.name)).toEqual(['ctx-a', 'ctx-c']);
    expect(filtered.clusters.map(c => c.name)).toEqual(['cluster-a', 'cluster-c']);
    expect(filtered.users.map(u => u.name)).toEqual(['user-a', 'user-c']);
  });

  it('deduplicates clusters and users shared by multiple selected contexts', () => {
    const sharedConfig = {
      ...fullConfig,
      contexts: [
        { name: 'ctx-a', context: { cluster: 'cluster-a', user: 'user-a' } },
        { name: 'ctx-a2', context: { cluster: 'cluster-a', user: 'user-a' } },
      ],
    };

    const filtered = configWithSelectedClusters(sharedConfig, ['ctx-a', 'ctx-a2']);

    expect(filtered.contexts).toHaveLength(2);
    expect(filtered.clusters).toHaveLength(1);
    expect(filtered.users).toHaveLength(1);
  });

  it('matches raw context names against the DNS-friendly names the backend reports', () => {
    // convertToContext sanitizes context names ('/' -> '--', ' ' -> '__') before
    // exposing meta_data.originalName, so the loaded list reports 'team--dev'
    // while the source file still uses 'team/dev'. Export must still match.
    const slashConfig = {
      clusters: [{ name: 'dev-cluster', cluster: { server: 'https://dev.example.invalid' } }],
      users: [{ name: 'dev-user', user: { token: 'dev-token' } }],
      contexts: [
        { name: 'team/dev', context: { cluster: 'dev-cluster', user: 'dev-user' } },
        { name: 'my context', context: { cluster: 'dev-cluster', user: 'dev-user' } },
      ],
      currentContext: 'team/dev',
    };

    const filtered = configWithSelectedClusters(slashConfig, ['team--dev', 'my__context']);

    expect(filtered.contexts.map(c => c.name)).toEqual(['team/dev', 'my context']);
    expect(filtered.clusters).toHaveLength(1);
    expect(filtered.users).toHaveLength(1);
  });

  it('prefers an exact name match over a DNS-friendly one', () => {
    const ambiguous = {
      clusters: [
        { name: 'raw', cluster: { server: 'https://raw.example.invalid' } },
        { name: 'dashed', cluster: { server: 'https://dashed.example.invalid' } },
      ],
      users: [],
      contexts: [
        { name: 'a/b', context: { cluster: 'raw', user: '' } },
        { name: 'a--b', context: { cluster: 'dashed', user: '' } },
      ],
      currentContext: 'a/b',
    };

    const filtered = configWithSelectedClusters(ambiguous, ['a--b']);

    expect(filtered.contexts.map(c => c.name)).toEqual(['a--b']);
  });

  it('ignores selected names that do not match any context', () => {
    const filtered = configWithSelectedClusters(fullConfig, ['ctx-a', 'nope']);

    expect(filtered.contexts.map(c => c.name)).toEqual(['ctx-a']);
  });
});

describe('buildExportKubeconfigYaml', () => {
  it('produces a portable kubeconfig with only the selected entries', () => {
    const exported = yaml.load(buildExportKubeconfigYaml(fullConfig, ['ctx-b'])) as any;

    expect(exported.apiVersion).toBe('v1');
    expect(exported.kind).toBe('Config');
    expect(exported['current-context']).toBe('ctx-b');
    expect(exported.contexts).toHaveLength(1);
    expect(exported.contexts[0].name).toBe('ctx-b');
    expect(exported.clusters).toHaveLength(1);
    expect(exported.clusters[0].name).toBe('cluster-b');
    expect(exported.users).toHaveLength(1);
    expect(exported.users[0].name).toBe('user-b');
  });

  it('excludes credentials of contexts that were not selected', () => {
    const exported = yaml.load(buildExportKubeconfigYaml(fullConfig, ['ctx-a'])) as any;

    const yamlText = buildExportKubeconfigYaml(fullConfig, ['ctx-a']);
    expect(yamlText).not.toContain('token-b');
    expect(yamlText).not.toContain('token-c');
    expect(yamlText).toContain('token-a');
    expect(exported.clusters).toHaveLength(1);
  });

  it('import-to-export: never leaks an unselected look-alike context when the backend reports a DNS-friendly name', () => {
    // Source has both 'team/dev' and a literal 'team--dev'. Only 'team/dev' is
    // imported; the backend reports it as originalName 'team--dev'. The loader
    // pre-filters the source to the selected contexts before resolving loaded
    // names, so export must carry 'team/dev' credentials only.
    const colliding = {
      clusters: [
        { name: 'dev-cluster', cluster: { server: 'https://dev.example.invalid' } },
        { name: 'other-cluster', cluster: { server: 'https://other.example.invalid' } },
      ],
      users: [
        { name: 'dev-user', user: { token: 'token-dev' } },
        { name: 'other-user', user: { token: 'token-other-secret' } },
      ],
      contexts: [
        { name: 'team/dev', context: { cluster: 'dev-cluster', user: 'dev-user' } },
        { name: 'team--dev', context: { cluster: 'other-cluster', user: 'other-user' } },
      ],
      currentContext: 'team/dev',
    };

    // Loader flow: resolve the backend-reported loaded name back to the raw
    // selected context (the unselected literal is not in the selection, so it
    // resolves to 'team/dev'), then export.
    const resolved = resolveLoadedContextNames(['team/dev'], ['team--dev']);
    expect(resolved).toEqual(['team/dev']);
    const exported = buildExportKubeconfigYaml(colliding, resolved);

    expect(exported).toContain('token-dev');
    expect(exported).not.toContain('token-other-secret');
    expect(exported).not.toContain('other.example.invalid');
    expect(yaml.load(exported)).toHaveProperty('current-context', 'team/dev');
  });

  it('both look-alikes selected: loads resolve one-to-one to the raw contexts, not twice to the literal', () => {
    // Source has both 'team/dev' and a literal 'team--dev', both selected with
    // distinct customNames. The backend reports originalName 'team--dev' for
    // each, so a naive match would export the literal context twice and drop
    // 'team/dev'.
    const both = {
      clusters: [
        { name: 'dev-cluster', cluster: { server: 'https://dev.example.invalid' } },
        { name: 'other-cluster', cluster: { server: 'https://other.example.invalid' } },
      ],
      users: [
        { name: 'dev-user', user: { token: 'token-dev' } },
        { name: 'other-user', user: { token: 'token-other' } },
      ],
      contexts: [
        { name: 'team/dev', context: { cluster: 'dev-cluster', user: 'dev-user' } },
        { name: 'team--dev', context: { cluster: 'other-cluster', user: 'other-user' } },
      ],
      currentContext: 'team/dev',
    };

    // Exact resolution first: the literal loaded 'team--dev' claims the literal
    // context; the duplicate 'team--dev' entry falls back to the raw 'team/dev'.
    const resolved = resolveLoadedContextNames(
      ['team/dev', 'team--dev'],
      ['team--dev', 'team--dev']
    );
    expect(resolved.sort()).toEqual(['team--dev', 'team/dev']);

    const exported = buildExportKubeconfigYaml(both, resolved);
    expect(exported).toContain('token-dev');
    expect(exported).toContain('token-other');
    expect(exported).toContain('dev.example.invalid');
    expect(exported).toContain('other.example.invalid');
    const parsed: any = yaml.load(exported);
    expect(parsed.contexts.map((c: any) => c.name).sort()).toEqual(['team--dev', 'team/dev']);
  });

  it('falls back to the first retained context when no selected name survives filtering', () => {
    // e.g. renamed contexts where the selected name no longer matches the stored one.
    const exported = yaml.load(buildExportKubeconfigYaml(fullConfig, ['renamed-away'])) as any;

    expect(exported['current-context']).toBe('');
  });
});
