import { useTranslation } from 'react-i18next';
import headlampBrokenImage from '../../assets/headlamp-404.svg';
import ErrorComponent from '../common/ErrorPage';

export default function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <ErrorComponent graphic={headlampBrokenImage} title={t(`Whoops! This page doesn't exist`)} />
  );
}
