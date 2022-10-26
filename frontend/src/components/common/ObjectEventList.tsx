import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import { timeAgo } from '../../lib/util';
import { SectionBox, SimpleTable } from '../common';

export interface ObjectEventListProps {
  object: KubeObject;
}

export default function ObjectEventList(props: ObjectEventListProps) {
  const [events, setEvents] = useState([]);

  async function fetchEvents() {
    const events = await Event.objectEvents(props.object);
    setEvents(events);
  }
  const { t } = useTranslation(['frequent']);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SectionBox title={t('frequent|Events')}>
      <SimpleTable
        columns={[
          {
            label: t('frequent|Type'),
            getter: item => {
              return item.type;
            },
          },
          {
            label: t('frequent|Reason'),
            getter: item => {
              return item.reason;
            },
          },
          {
            label: t('frequent|Age'),
            getter: item => {
              if (item.count > 1) {
                return `${timeAgo(item.lastTimestamp)} (${item.count} times over ${timeAgo(
                  item.firstTimestamp
                )})`;
              }
              return item.age;
            },
          },
          {
            label: t('frequent|From'),
            getter: item => {
              return item.source.component;
            },
          },
          {
            label: t('frequent|Message'),
            getter: item => {
              return item.message;
            },
          },
        ]}
        data={events}
      />
    </SectionBox>
  );
}
