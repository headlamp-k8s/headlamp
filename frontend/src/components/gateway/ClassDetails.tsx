import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import GatewayClass, { KubeGatewayClass } from '../../lib/k8s/gatewayClass';
import { ConditionsTable, DetailsGrid } from '../common/Resource';
import SectionBox from '../common/SectionBox';

export default function GatewayClassDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={GatewayClass}
      name={name}
      withEvents
      extraInfo={gatewayClass =>
        gatewayClass && [
          {
            name: t('Controller Name'),
            value: gatewayClass.controllerName,
          },
        ]
      }
      extraSections={(item: KubeGatewayClass) =>
        item && [
          {
            id: 'headlamp.gatewayclass-conditions',
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
