import { GraphSource } from './GraphModel';
import { ConfigurationSource } from './sources/ConfigurationSource';
import { igSource } from './sources/igSource';
import { NetworkSource } from './sources/NetworkSource';
import { SecuritySource } from './sources/SecuritySource';
import { StorageSource } from './sources/StorageSource';
import { WorkloadsSource } from './sources/WorkloadSource';

export const allSources: GraphSource[] = [
  WorkloadsSource,
  StorageSource,
  NetworkSource,
  SecuritySource,
  ConfigurationSource,
  igSource,
];
