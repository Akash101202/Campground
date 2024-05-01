const campgroundArray = coordinateString.split(',').map(Number);
const campTitleString = campgroundTitle.split(',').map(String);
const campLocString = campgroundLoc.split(',').map(String);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: campgroundArray, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(campgroundArray)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${campTitleString}</h3><p>${campLocString}</p>`
        )
)
.addTo(map)