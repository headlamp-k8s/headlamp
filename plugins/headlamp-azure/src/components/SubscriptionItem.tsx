import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react'
import { ClusterItem } from './ClusterItem';
import { accessToken } from './utils';

interface SubscriptionItemProps {
    SubscriptionId: string
    Name: string
    handleClusterClick: (clusterId: string) => void
    clusterSelected: (clusterId: string) => boolean
}


export function SubscriptionItem(props: SubscriptionItemProps) {
    interface clusters {
        value: [{

        }]

    }
    const [open, setOpen] = useState<boolean>(false)
    const [clusters, setClusters] = useState<clusters>({ value: [] })
    useEffect(() => {
        if (open) {
            const fetchClusters = async () => {
                const url = `https://management.azure.com/subscriptions/${props.SubscriptionId}/resources?$filter=resourceType%20eq%20%27Microsoft.ContainerService%2FmanagedClusters%27&api-version=2019-10-01`
                const token = await accessToken()
                const response = await fetch(url, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const clustersResp = await response.json()
                setClusters(clustersResp)
                console.log("debug: clusters:", clusters, clustersResp)
            }
            fetchClusters()
        }
    }, [open])

    const clusterItems = []
    clusters.value.forEach((cluster) => {
        console.log("debug: values:", cluster)
        clusterItems.push(<ClusterItem selected={props.clusterSelected(cluster.id)} handleClusterClick={props.handleClusterClick} name={cluster.name} id={cluster.id} subscriptionId={props.SubscriptionId} />)
    })

    return (
        <div key={props.SubscriptionId}>
            <Button key={props.SubscriptionId} onClick={() => setOpen(!open)}> <img alt="subscription logo" src="https://code.benco.io/icon-collection/azure-icons/Subscriptions.svg" style={{height:"20px"}}/>{` ${props.Name}`}</Button>
            <br />
            {open&& <div style={{paddingLeft:"25px",width:"100%"}}>{clusterItems}</div>}
        </div>
    )
}
