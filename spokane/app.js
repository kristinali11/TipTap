async function initMap() {
  /*
  This function is used to initialize the map, set up a function for Map,
  Pin, and Marker elements on the map, as well as determines
  mapOptions
  INPUT: none
*/
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const mapOptions = {
    // center: { lat: 47.641675, lng: -122.3440076 },
    center: { lat: 47.656812026129046, lng: -117.40419062836163 },
    zoom: 12,
    mapId: "468f9db6bb952a25",
  };

  const map = new Map(document.getElementById("map"), mapOptions);
  infoWindow = new google.maps.InfoWindow();
  const markers = [];
  const placeListItems = document.querySelectorAll(".container");
  const placeListNames = document.querySelectorAll("h1");
  placeListItems.forEach((item, i) => {
    const placeId = item.getAttribute("data-place-id");
    const lat = parseFloat(item.getAttribute("data-lat"));
    const lng = parseFloat(item.getAttribute("data-lng"));
    const title = placeListNames[i].innerText;
    const adressLink = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    var placeListAnchors = document.querySelectorAll(".item-content a");
    placeListAnchors[i].href = adressLink;
    placeListAnchors[i].target = "_blank";
    const marker = new AdvancedMarkerElement({
      position: { lat, lng },
      map,
      title: title,
    });
    markers.push(marker);
    marker.addListener("click", () => {
      highlightListItem(title);
      placeDetailsOnClick(this, placeId, map, infoWindow, lat, lng, PinElement);
    });

    item.addEventListener("click", function () {
      item.classList.toggle("expanded");
      highlightListItem(title);
      placeDetailsOnClick(
        marker,
        placeId,
        map,
        infoWindow,
        lat,
        lng,
        PinElement
      );
    });

    item.addEventListener("mouseover", () => {
      const pinBackground = new PinElement({
        background: "370617",
      });
      marker.content = pinBackground.element;
    });
    item.addEventListener("mouseout", () => {
      marker.content = null;
    });
  });
}

function navigateToPage() {
  /*
  This function is used to navigate to a different webpage
  INPUT: none
*/
  const citySelector = document.getElementById("citySelector");
  const selectedCity = citySelector.value;
  const placeSelector = document.getElementById("placeSelector");
  const selectedPlace = placeSelector.value;
  const targetUrl = `../${selectedCity}/${selectedPlace}.html`;
  if (targetUrl) {
    window.location.href = targetUrl;
  }
}

function highlightListItem(itemName) {
  /*
  This function is used to
  INPUT:
*/
  const parentDivs = document.querySelectorAll(".container");
  parentDivs.forEach((div) => {
    const item = div.querySelector("h1");
    if (item && item.innerText === itemName) {
      div.classList.add("highlight");
      const rect = div.getBoundingClientRect();
      if (rect.bottom > window.innerHeight || rect.top < 0) {
        div.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } else {
      div.classList.remove("highlight");
    }
  });
}

function placeDetailsOnClick(
  marker,
  placeId,
  map,
  infoWindow,
  lat,
  lng,
  PinElement
) {
  /*
  This function is used to zoom in and center the map on the place location,
  highlight the marker on the map, and request the Goggle places server to show the details
  of the selected place (name and an adress) on the map
  INPUT: marker object, placeId - str, map - object, infondow - object, lat and lng - float, pinElement - object
*/
  map.setCenter({ lat, lng });
  map.setZoom(15);
  const pinBackground = new PinElement({
    background: "370617",
  });
  marker.content = pinBackground.element;
  const request = {
    placeId: placeId,
    fields: ["name", "formatted_address", "geometry"],
  };
  const service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const adressArray = place.formatted_address.split(", ");
      const content = `<strong>${place.name}</strong><br>${adressArray[0]}<br>${adressArray[1]}, ${adressArray[2]}`;
      infoWindow.setContent(content);
      infoWindow.setPosition(place.geometry.location);
      infoWindow.open(map);
    } else {
      console.error("Error fetching place details:", status);
    }
  });
}
