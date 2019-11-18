import _ from 'lodash';
import React from 'react';
import { InfoLabel, ValueLabel } from '../common/Label';
import Link from './Link';

export function MetadataDisplay(props) {
  let { resource } = props;

  return (
    <React.Fragment>
      <InfoLabel name="Name" value={resource.metadata.name} />
      <InfoLabel name="UID" value={resource.metadata.uid} />
      {resource.metadata.resourceVersion &&
        <InfoLabel name="Version" value={resource.metadata.resourceVersion} />
      }
      <InfoLabel name="Creation">
        <ValueLabel>{new Date(resource.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
      </InfoLabel>
      {resource.metadata.annotations &&
        <InfoLabel name="Annotations">
          {_.map(resource.metadata.annotations, (value, key) => {
            return (
              <p key={key}><ValueLabel>{key}{': '}{value}</ValueLabel></p>
            );
          })}
        </InfoLabel>
      }
    </React.Fragment>
  );
}

export function ResourceLink(props) {
  let {
    routeName=props.resource.kind,
    routeParams=props.resource.metadata,
    name=props.resource.metadata.name,
  } = props;

  return (
    <Link
      routeName={routeName}
      params={routeParams}
    >
      {name}
    </Link>
  );
}