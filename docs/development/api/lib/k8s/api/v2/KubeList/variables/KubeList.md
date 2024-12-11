# Variable: KubeList

```ts
KubeList: object;
```

## Type declaration

### applyUpdate()

Apply an update event to the existing list

#### Type Parameters

| Type Parameter |
| ------ |
| `ObjectInterface` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |
| `ObjectClass` *extends* *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `list` | [`KubeList`](../interfaces/KubeList.md)\<[`KubeObject`](../../../../KubeObject/classes/KubeObject.md)\<`ObjectInterface`\>\> | List of kubernetes resources |
| `update` | [`KubeListUpdateEvent`](../interfaces/KubeListUpdateEvent.md)\<`ObjectInterface`\> | Update event to apply to the list |
| `itemClass` | `ObjectClass` | Class of an item in the list. Used to instantiate each item |

#### Returns

[`KubeList`](../interfaces/KubeList.md)\<[`KubeObject`](../../../../KubeObject/classes/KubeObject.md)\<`ObjectInterface`\>\>

New list with the updated values

## Defined in

[frontend/src/lib/k8s/api/v2/KubeList.ts:3](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/KubeList.ts#L3)
