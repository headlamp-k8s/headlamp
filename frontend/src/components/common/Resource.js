import _ from 'lodash';
import React from 'react';
import { InfoLabel, ValueLabel } from '../common/Label';

export function MetadataDisplay(props) {
  const { resource } = props;

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
