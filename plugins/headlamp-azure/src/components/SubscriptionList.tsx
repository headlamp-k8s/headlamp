import { Icon } from '@iconify/react';
import { Headlamp } from '@kinvolk/headlamp-plugin/lib';
import { DialogTitle } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Dialog } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react'
import { SubscriptionItem } from './SubscriptionItem';
import { accessToken } from './utils';


export function SubscriptionList() {

    interface subs {
        value: [{

        }]

    }
    const [subscriptions, setSubscriptions] = useState<subs>({ value: [] });

    useEffect(() => {
        const fetchSubscriptions = async () => {
            const token = await accessToken()
            const response = await fetch("https://management.azure.com/subscriptions?api-version=2020-01-01", {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log("debug: data", data)
            console.log("debug: data", data.value, subscriptions, Object.keys(subscriptions))
            setSubscriptions(data)
        }
        fetchSubscriptions()
    }, []);

    const [selectedClusters, setSelectedClusters] = useState<String[]>([])

    function handleClusterClick(clusterId: string) {
        console.log("debug: handleClusterClick", clusterId, selectedClusters)
        selectedClusters.includes(clusterId) ? setSelectedClusters(selectedClusters.filter((id) => id !== clusterId)) : setSelectedClusters([...selectedClusters, clusterId])
    }

    function clusterSelected(clusterId: string) {
        return selectedClusters.includes(clusterId)
    }

    useEffect(() => {
        console.log("debug: selectedClusters", selectedClusters)
    }, [selectedClusters])

    const subsTree = []
    subscriptions.value?.forEach((sub) => {
        subsTree.push(<SubscriptionItem clusterSelected={clusterSelected} handleClusterClick={handleClusterClick} key={sub.SubscriptionId} SubscriptionId={sub.subscriptionId} Name={sub.displayName} />)
    })


    async function fetchKubeConfig(clusterId) {
        const url = `https://management.azure.com/${clusterId}/listClusterUserCredential?api-version=2022-04-01`
        const token = await accessToken()
        const response = await fetch(url, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        const data = await response.json()
        const setupResponse = await Headlamp.setCluster({
            kubeConfig: data["kubeconfigs"][0]["value"],
            metadata: { "source": "azure_aks" }
        })
        console.log("debug: setupResponse", setupResponse)
    }

    async function setupClusters() {
        console.log("debug: setupClusters", selectedClusters)
        selectedClusters.forEach(async (clusterId) => {
            await fetchKubeConfig(clusterId)
        })
    }

    function handleClose() {
        window.location.href = "/"
    }


    return (
        
        <>
        <Dialog open onClose={handleClose}>
            {/* <Dialog> */}
            <DialogTitle buttons={[<Button onClick={handleClose}>
                <Icon icon="material-symbols:close" height="30" width="30" />
            </Button>]}>Choose Clusters</DialogTitle>
            <div>
                {/* <div style={{minWidth:"450px"}}>
                <div style={{ paddingTop:"10px",paddingBottom:"10px", backgroundColor: "black", textAlign: "center", display:"flex",justifyContent:"center" }}>
                    <Typography variant="h1" color="primary" style={{width:"80%",paddingTop:"7px"}}>Choose Clusters</Typography>
                    <Button onClick={handleClose}>
                    <Icon icon="material-symbols:close" color="white" height="30" width="30"/>
                    </Button>
    </div>*/}
                <div style={{ padding: "20px" }}>
                    {subsTree}
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                <Button variant="contained" disabled={!(subsTree.length > 0)} color="primary" onClick={() => { setupClusters() }}>Setup clusters</Button>
            </div>
        </Dialog>
        </>
    )
}
