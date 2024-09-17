import { KubeObjectClass, KubeObjectInterface } from '../../cluster';

export interface KubeList<T extends KubeObjectInterface> {
  kind: string;
  apiVersion: string;
  items: T[];
  metadata: {
    resourceVersion: string;
  };
}

export interface KubeListUpdateEvent<T extends KubeObjectInterface> {
  type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'ERROR';
  object: T;
}

export const KubeList = {
  /**
   * Apply an update event to the existing list
   *
   * @param list - List of kubernetes resources
   * @param update - Update event to apply to the list
   * @param itemClass - Class of an item in the list. Used to instantiate each item
   * @returns New list with the updated values
   */
  applyUpdate<T extends KubeObjectInterface>(
    list: KubeList<T>,
    update: KubeListUpdateEvent<T>,
    itemClass: KubeObjectClass
  ): KubeList<T> {
    const newItems = [...list.items];
    const index = newItems.findIndex(item => item.metadata.uid === update.object.metadata.uid);

    switch (update.type) {
      case 'ADDED':
      case 'MODIFIED':
        if (index !== -1) {
          newItems[index] = new itemClass(update.object) as T;
        } else {
          newItems.push(new itemClass(update.object) as T);
        }
        break;
      case 'DELETED':
        if (index !== -1) {
          newItems.splice(index, 1);
        }
        break;
      case 'ERROR':
        console.error('Error in update', update);
        break;
      default:
        console.error('Unknown update type', update);
    }

    return {
      ...list,
      metadata: {
        resourceVersion: update.object.metadata.resourceVersion!,
      },
      items: newItems,
    };
  },
};
