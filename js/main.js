let marker;
let key = '';
let selectedLocation = [];
let address = [];

const url = 'https://data.sfgov.org/resource/rqzj-sfat.json';

// xml http resquests for post data
const httpGetRequestForMoviesData = new XMLHttpRequest();

httpGetRequestForMoviesData.open('GET', url);

httpGetRequestForMoviesData.onload = function () {

    if (httpGetRequestForMoviesData.status >= 200 & httpGetRequestForMoviesData.status < 400) {
        data = [];
        data = JSON.parse(httpGetRequestForMoviesData.responseText);
        address = data.map((item, index) => {
            if (!address.find(x => x.address === item.address)) {
                return item;
            }
        });

        // after getting posts creates html template in DOM
        initializeList();

        document.getElementById("loader").style.display = 'none';
        document.getElementById("content").style.display = '';

    } else {
        console.log("We connected to the server, but it returend an error");
    }
};

httpGetRequestForMoviesData.send();

httpGetRequestForMoviesData.onerror = function () {
    console.error("Connection error");
}

//fetch available food truck services of selected location
function getSelectedLocations(address) {
    const httpGetRequestForGeoLocation = new XMLHttpRequest();

    const googleApiUrl = `https://data.sfgov.org/resource/rqzj-sfat.json?address=${address}`;
    httpGetRequestForGeoLocation.open('GET', googleApiUrl);
    let filtered;

    httpGetRequestForGeoLocation.onload = function () {
        if (httpGetRequestForGeoLocation.status >= 200 & httpGetRequestForGeoLocation.status < 400) {
            filtered = JSON.parse(httpGetRequestForGeoLocation.responseText);
            selectedLocation = [];
            selectedLocation = filtered;
            console.log(data);

            if (selectedLocation) {

                var map = creatMap();
                setMarker(map, selectedLocation[0]);

                document.getElementById('selected').innerHTML = '';

                selectedLocation.forEach((element, index) => {
                    createElement(`selected-${index}`, 'selected', 'DIV', '', 'card');
                    createElement(`body-${index}`, `selected-${index}`, 'DIV', '', 'card-body');
                    createElement('title', `body-${index}`, 'H4', element.applicant, 'card-title');
                    createElement('text', `body-${index}`, 'DIV', element.fooditems, 'card-text');
                    createElement('footer', `selected-${index}`, 'DIV', element.locationdescription, 'card-footer');
                });
            }
        } else {
            console.log("We connected to the server, but it returend an error");
        }
    }

    httpGetRequestForGeoLocation.send();

    return filtered;
}

//initialize map
function creatMap() {

    // Intialize our map
    const center = new google.maps.LatLng(41.7656874, -72.680087);
    const mapOptions = {
        zoom: 8,
        center: center
    };

    let map = new google.maps.Map(document.getElementById("map"), mapOptions);

    return map;

}

//set address marker in the map
function setMarker(mapDetail, element) {
    //Remove previous Marker.
    if (marker != null) {
        marker.setMap(null);
    }

    //Set Marker on Map.
    let latlng = new google.maps.LatLng(+element.latitude, +element.longitude);

    marker = new google.maps.Marker({
        position: latlng,
        map: mapDetail,
        title: element.applicant,
    });

    mapDetail.setZoom(18);
    mapDetail.setCenter(latlng);

    //Create and open InfoWindow.
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<div style = 'width:200px;min-height:20px'>${element.address}</div>`);
    infoWindow.open(mapDetail, marker);
}

//get and initialize data
function initializeList() {
    document.getElementById("list").innerHTML = "";
    creatMap(data);

    address.forEach(element => {

        var node = document.createElement("OPTION");
        var textnode = document.createTextNode(element.address);
        node.appendChild(textnode);
        document.getElementById("locations").appendChild(node);

    });

}

//create element for available food truck services div
function createElement(id, parentId, element, value = '', className = '') {
    var node = document.createElement(element);
    node.setAttribute('id', id);
    node.setAttribute('class', className);

    var textnode = document.createTextNode(value);
    node.appendChild(textnode);
    document.getElementById(parentId).appendChild(node);
}

function onLocationChange($event) {
    const value = $event.target.value;
    if (value) {
        getSelectedLocations(value);
    }
}
