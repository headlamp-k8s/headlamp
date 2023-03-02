import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { createRouteURL } from '../../../lib/router';
import { ActionButton } from '../../common';

export default function SettingsButton(props: { onClickExtra?: () => void }) {
  const { onClickExtra } = props;
  const { t } = useTranslation(['glossary']);
  const history = useHistory();

  return (
    <ActionButton
      icon="mdi:cog"
      description={t('frequent|Settings')}
      onClick={() => {
        history.push(createRouteURL('settings'));
        onClickExtra && onClickExtra();
      }}
    />
  );
}
