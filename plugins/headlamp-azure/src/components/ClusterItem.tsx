import { Checkbox } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';

interface ClusterItemProps {
    name: string,
    id: string,
    subscriptionId: string,
    handleClusterClick: (clusterId: string) => void,
    selected:boolean,
}

export function ClusterItem(props: ClusterItemProps) {

    return (
        <FormControlLabel
            key={props.id}
            value={props.name}
            label={<><img src="http://code.benco.io/icon-collection/azure-icons/Kubernetes-Services.svg" alt="aks logo" style={{ height: "20px", verticalAlign: "middle" }} />{` ${props.name}`}</>}
            control={<Checkbox
                checked={props.selected}
                color="primary"
                onChange={() => { props.handleClusterClick(props.id);}}
            />}
        />
    )
}
{/* // <Button key={props.id} onClick={() => fetchKubeConfig()}>{`>>>> ${props.name}`}</Button> */ }
        // <Checkbox><img src="http://code.benco.io/icon-collection/azure-icons/Kubernetes-Services.svg" alt="aks logo" style={{height:"20px"}}/> {` ${props.name}`}</Checkbox>
