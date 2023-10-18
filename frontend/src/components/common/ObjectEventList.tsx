import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../lib/k8s/cluster';
import Event, { KubeEvent } from '../../lib/k8s/event';
import { localeDate, timeAgo } from '../../lib/util';
import { HoverInfoLabel, SectionBox, SimpleTable } from '../common';
import ShowHideLabel from './ShowHideLabel';

export interface ObjectEventListProps {
  object: KubeObject;
}

export default function ObjectEventList(props: ObjectEventListProps) {
  const [events, setEvents] = useState([]);

  async function fetchEvents() {
    const events = await Event.objectEvents(props.object);
    setEvents(events);
  }
  const { t } = useTranslation(['translation', 'glossary']);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SectionBox title={t('glossary|Events')}>
      <SimpleTable
        columns={[
          {
            label: t('Type'),
            getter: item => {
              return item.type;
            },
          },
          {
            label: t('Reason'),
            getter: item => {
              return item.reason;
            },
          },
          {
            label: t('From'),
            getter: item => {
              return item.source.component;
            },
          },
          {
            label: t('Message'),
            getter: item => {
              return (
                item && (
                  <ShowHideLabel labelId={item?.metadata?.uid || ''}>
                    {item.message || ''}
                  </ShowHideLabel>
                )
              );
            },
          },
          {
            label: t('Age'),
            getter: item => {
              if (item.count > 1) {
                return `${timeAgo(item.lastTimestamp)} (${item.count} times over ${timeAgo(
                  item.firstTimestamp
                )})`;
              }
              const eventDate = timeAgo(item.lastTimestamp, { format: 'mini' });
              let label: string;
              if (item.count > 1) {
                label = t('{{ eventDate }} ({{ count }} times since {{ firstEventDate }})', {
                  eventDate,
                  count: item.count,
                  firstEventDate: timeAgo(item.firstTimestamp),
                });
              } else {
                label = eventDate;
              }

              return (
                <HoverInfoLabel
                  label={label}
                  hoverInfo={localeDate(item.lastTimestamp)}
                  icon="mdi:calendar"
                />
              );
            },
            sort: (n1: KubeEvent, n2: KubeEvent) =>
              new Date(n2.lastTimestamp).getTime() - new Date(n1.lastTimestamp).getTime(),
          },
        ]}
        data={events}
      />
    </SectionBox>
  );
}
