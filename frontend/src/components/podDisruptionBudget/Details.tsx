import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PDB from '../../lib/k8s/podDisruptionBudget';
import { DetailsGrid, ObjectEventList, StatusLabel } from '../common';

export default function PDBDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  function selectorsToJSX(selectors: string[]) {
    const values: JSX.Element[] = [];

    selectors.forEach((selector: string) => {
      values.push(
        <StatusLabel key={selector} status="">
          {selector}
        </StatusLabel>
      );
    });

    return values;
  }

  const { t } = useTranslation(['pdb', 'frequent']);
  return (
    <DetailsGrid
      resourceType={PDB}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('pdb|Selector'),
            value: <>{selectorsToJSX(item.selectors)}</>,
          },
          {
            name: t('frequent|Status'),
            value: (
              <>
                <StatusLabel status="">
                  {t('pdb|Allowed disruptions')}:{item.status.disruptionsAllowed}
                </StatusLabel>
                <br />
                <StatusLabel status="">
                  {t('pdb|Current')}:{item.status.currentHealthy}
                </StatusLabel>
                <br />
                <StatusLabel status="">
                  {t('pdb|Desired')}:{item.status.desiredHealthy}
                </StatusLabel>
                <br />
                <StatusLabel status="">
                  {t('pdb|Total')}:{item.status.expectedPods}
                </StatusLabel>
                <br />
              </>
            ),
          },
        ]
      }
      sectionsFunc={item => item && <ObjectEventList object={item} />}
    />
  );
}
