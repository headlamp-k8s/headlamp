export function fetchChartsFromArtifact() {
  return fetch('https://artifacthub.io/api/v1/packages/search?kind=0').then(response =>
    response.json()
  );
}
