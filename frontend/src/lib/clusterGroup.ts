interface Group {
  name: string;
  clusters: string[];
}

const groupStoragePrefix = 'group_settings.';

export function storeGroupSettings(group: Group) {
  const { name } = group;
  localStorage.setItem(groupStoragePrefix + name, JSON.stringify(group));
}

export function loadGroupSettings(name: string): Group | null {
  const storedGroup = localStorage.getItem(groupStoragePrefix + name);

  if (!storedGroup) {
    return null;
  }

  return {
    name,
    clusters: [],
    ...JSON.parse(storedGroup),
  };
}

export function deleteGroupSettings(name: string) {
  localStorage.removeItem(groupStoragePrefix + name);
}
