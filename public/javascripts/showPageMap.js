// mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>';
mapboxgl.accessToken = mapBoxToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    // center: [-74.5, 40],
    center: foundId.geometry.coordinates,
    zoom: 9
  });

const marker = new mapboxgl.Marker()
// .setLngLat([-74.5, 40])
.setLngLat(foundId.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
  .setHTML(
      `<h6>${foundId.title}<h6><p>${foundId.location}</p>`
)
)
.addTo(map);