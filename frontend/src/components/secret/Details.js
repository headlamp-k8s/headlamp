import deleteIcon from '@iconify/icons-mdi/delete';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { getRoute } from '../../lib/router';
import { deleteClusterObjects } from '../../redux/actions/actions';
import { MainInfoSection, SecretField } from '../common/Resource';

export default function SecretDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  useConnectApi(
    api.secret.get.bind(null, namespace, name, setItem),
  );

  function handleDelete() {
    api.secret.delete(namespace, name);
  }

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && _.map(item.data, (value, key) => (
        {
          name: key,
          valueComponent: <SecretField label={key} value={value} />
        }
      ))}
      actions={item && [
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              dispatch(deleteClusterObjects([item], handleDelete,
                {startUrl: getRoute('secrets').path, cancelUrl: location.pathname }));
            }}
          >
            <Icon icon={deleteIcon} />
          </IconButton>
        </Tooltip>,
      ]}
    />
  );
}
