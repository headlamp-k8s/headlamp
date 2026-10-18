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

import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { KubeCondition } from '../../lib/k8s/cluster';
import {
  GatewayListener,
  GatewayListenerStatus,
  GatewayParentReference,
} from '../../lib/k8s/gateway';
import { GATEWAY_API_GROUP, resolveGatewayParentReference } from '../../lib/k8s/gatewayReferences';
import GRPCRoute from '../../lib/k8s/grpcRoute';
import HTTPRoute from '../../lib/k8s/httpRoute';
import ListenerSet from '../../lib/k8s/listenerSet';
import TCPRoute from '../../lib/k8s/tcpRoute';
import UDPRoute from '../../lib/k8s/udpRoute';
import EmptyContent from '../common/EmptyContent';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import Link from '../common/Link';
import { ConditionsTable, DetailsGrid } from '../common/Resource';
import SectionBox from '../common/SectionBox';
import SimpleTable, { NameValueTable } from '../common/SimpleTable';

/**
 * Gateway API listener conditions whose healthy state is `status: "False"`
 * (i.e. the condition reports a problem only when True). For these we render a
 * chip only when there actually is a problem, so a `Conflicted=False` listener
 * is not mislabelled as conflicted.
 */
const NEGATIVE_LISTENER_CONDITIONS = ['Conflicted', 'Overlapping', 'Detached'];

/** A certificate reference on a listener's TLS config. */
interface ListenerTLSCertRef {
  group?: string;
  kind?: string;
  name: string;
  namespace?: string;
}

/** The TLS block of a Gateway API listener. */
interface ListenerTLS {
  mode?: string;
  certificateRefs?: ListenerTLSCertRef[];
  [key: string]: any;
}

function makeConditionLabel(condition: KubeCondition) {
  const isNegative = NEGATIVE_LISTENER_CONDITIONS.includes(condition.type);
  // Skip healthy negative-polarity conditions (e.g. Conflicted=False) entirely.
  if (isNegative && condition.status !== 'True') {
    return null;
  }

  const healthy = isNegative ? condition.status === 'False' : condition.status === 'True';
  const status: StatusLabelProps['status'] = healthy ? 'success' : 'error';

  return (
    <Box
      key={condition.type}
      display="inline-block"
      sx={theme => ({ paddingRight: theme.spacing(1) })}
    >
      <StatusLabel status={status}>{condition.type}</StatusLabel>
    </Box>
  );
}

function ListenerSetListenerTable(props: {
  listener: GatewayListener;
  status: GatewayListenerStatus | null;
  namespace?: string;
  cluster?: string;
}) {
  const { listener, status, namespace, cluster } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  const tls: ListenerTLS | undefined = (listener as any).tls;

  const mainRows: any[] = [
    {
      name: listener.name,
      withHighlightStyle: true,
    },
    {
      name: t('translation|Hostname'),
      value: listener.hostname,
    },
    {
      name: t('translation|Port'),
      value: listener.port,
    },
    {
      name: t('translation|Protocol'),
      value: listener.protocol,
    },
  ];

  if (tls) {
    mainRows.push({
      name: t('glossary|TLS Mode'),
      value: tls.mode ?? t('translation|Not specified'),
    });
    mainRows.push({
      name: t('glossary|Certificates'),
      value:
        tls.certificateRefs && tls.certificateRefs.length > 0
          ? tls.certificateRefs.map((ref, i) => {
              const isSecret = (ref.kind ?? 'Secret') === 'Secret' && !ref.group;
              const label = `${ref.kind ?? 'Secret'}/${ref.name}`;
              return (
                <Box key={`${ref.name}-${i}`} display="inline-block" pr={1}>
                  {isSecret ? (
                    <Link
                      routeName="secret"
                      params={{ namespace: ref.namespace ?? namespace, name: ref.name }}
                      activeCluster={cluster}
                    >
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </Box>
              );
            })
          : t('translation|None'),
    });
  }

  mainRows.push({
    name: t('translation|Conditions'),
    value: status?.conditions?.map(c => makeConditionLabel(c)).filter(Boolean) ?? null,
  });

  return <NameValueTable rows={mainRows} />;
}

/** True if the route's parentRefs target the given ListenerSet. */
function routeTargetsListenerSet(
  parentRefs: GatewayParentReference[],
  listenerSet: ListenerSet
): GatewayParentReference | undefined {
  return parentRefs.find(ref => {
    const resolved = resolveGatewayParentReference(ref, listenerSet.metadata.namespace);
    return (
      resolved.kind === 'ListenerSet' &&
      resolved.group === GATEWAY_API_GROUP &&
      ref.name === listenerSet.metadata.name &&
      resolved.namespace === listenerSet.metadata.namespace
    );
  });
}

function ListenerSetAttachedRoutes(props: { listenerSet: ListenerSet }) {
  const { listenerSet } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  // Query every route kind across namespaces; a route may live in another
  // namespace yet target this ListenerSet by setting parentRef.namespace.
  const { items: httpRoutes } = HTTPRoute.useList({ cluster: listenerSet.cluster });
  const { items: grpcRoutes } = GRPCRoute.useList({ cluster: listenerSet.cluster });
  const { items: tcpRoutes } = TCPRoute.useList({ cluster: listenerSet.cluster });
  const { items: udpRoutes } = UDPRoute.useList({ cluster: listenerSet.cluster });

  const allRoutes = [
    ...(httpRoutes ?? []),
    ...(grpcRoutes ?? []),
    ...(tcpRoutes ?? []),
    ...(udpRoutes ?? []),
  ];

  const attached = allRoutes
    .map(route => {
      const match = routeTargetsListenerSet(route.parentRefs ?? [], listenerSet);
      return match ? { route, sectionName: match.sectionName } : null;
    })
    .filter(Boolean) as { route: any; sectionName?: string }[];

  return (
    <SectionBox title={t('glossary|Attached Routes')}>
      {attached.length === 0 ? (
        <EmptyContent>{t('glossary|No routes are attached to this ListenerSet')}</EmptyContent>
      ) : (
        <SimpleTable
          columns={[
            {
              label: t('translation|Name'),
              getter: ({ route }) => (
                <Link
                  routeName={(route.kind as string)?.toLowerCase()}
                  params={{ namespace: route.metadata.namespace, name: route.metadata.name }}
                  activeCluster={route.cluster}
                >
                  {route.metadata.name}
                </Link>
              ),
            },
            {
              label: t('translation|Kind'),
              getter: ({ route }) => route.kind,
            },
            {
              label: t('translation|Namespace'),
              getter: ({ route }) => route.metadata.namespace,
            },
            {
              label: t('glossary|Listener'),
              getter: ({ sectionName }) => sectionName ?? '*',
            },
            {
              label: t('glossary|Hostnames'),
              getter: ({ route }) => (route.jsonData.spec?.hostnames ?? []).join(', '),
            },
          ]}
          data={attached}
          reflectInURL="attachedRoutes"
        />
      )}
    </SectionBox>
  );
}

export default function ListenerSetDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={ListenerSet}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('glossary|Parent Gateway'),
            value: item.parentRef?.name ? (
              <Link
                routeName="gateway"
                params={{
                  name: item.parentRef.name,
                  namespace: item.parentRef.namespace ?? item.metadata.namespace,
                }}
                activeCluster={item.cluster}
              >
                {item.parentRef.name}
              </Link>
            ) : null,
          },
        ]
      }
      extraSections={(item: ListenerSet) =>
        item && [
          {
            id: 'headlamp.listenerset-listeners',
            section: item && (
              <SectionBox title={t('translation|Listeners')}>
                {item.getListeners().length === 0 ? (
                  <EmptyContent>{t('No data')}</EmptyContent>
                ) : (
                  item
                    .getListeners()
                    .map((listener: GatewayListener) => (
                      <ListenerSetListenerTable
                        key={listener.name}
                        listener={listener}
                        status={item.getListenerStatusByName(listener.name)}
                        namespace={item.metadata.namespace}
                        cluster={item.cluster}
                      />
                    ))
                )}
              </SectionBox>
            ),
          },
          {
            id: 'headlamp.listenerset-attached-routes',
            section: item && <ListenerSetAttachedRoutes listenerSet={item} />,
          },
          {
            id: 'headlamp.listenerset-conditions',
            section: (
              <SectionBox title={t('translation|Conditions')}>
                <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
