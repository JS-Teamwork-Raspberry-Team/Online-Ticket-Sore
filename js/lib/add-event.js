jQuery('#mapsearch').on("keypress", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});

//set map to the corresponding place in html
let map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: {
        lat: 42.7339,
        lng: 25.4858
    },
    zoom: 8
});

$('#map-canvas').width(700).height(300);

//set marker on the map
let marker = new google.maps.Marker({
    position: {
        lat: 42.7339,
        lng: 25.4858
    },
    map:map,
    draggable: true
});

// handle autocomplete in search input
let searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));

// set event for dragging marker by the user and set the lat and lng from new marker location
let lat;
let lng;
google.maps.event.addListener(searchBox, 'places_changed', function () {
    let places = searchBox.getPlaces();
    let bounds = new google.maps.LatLngBounds();

    let i, place;
    for(i = 0; place = places[i]; i++) {
        bounds.extend(place.geometry.location);
        marker.setPosition(place.geometry.location);
    }

    lat = marker.getPosition().lat();
    lng = marker.getPosition().lng();

    $('#lat').val(lat);
    $('#lng').val(lng);

    map.fitBounds(bounds);
    map.setZoom(12);
});

// set into the html field the new lat and lng after marker is dragged
google.maps.event.addListener(marker, 'dragend', function () {
    lat = marker.getPosition().lat();
    lng = marker.getPosition().lng();

    $('#lat').val(lat);
    $('#lng').val(lng);
});

// add and preview image script
function filePreview(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let file = e.target;
            $("<span class=\"pip\">" +
                "<img class=\"mainImg\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                "<span class=\"remove\">Delete</span>" +
                "</span>").insertAfter("#file");
            $(".remove").click(function(){
                $(this).parent(".pip").remove();
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
    $('#images').css("margin-top", 240);
}

$("#file").change(function () {
    filePreview(this);
});

var margin = 140;
$(document).ready(function() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files").on("change", function(e) {
            let files = e.target.files,
                filesLength = files.length;
            for (let i = 0; i < filesLength; i++) {
                let f = files[i];
                let fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    let file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<span class=\"remove\">Delete/Change</span>" +
                        "</span>").insertAfter("#files");
                    $(".remove").click(function(){
                        $(this).parent(".pip").remove();
                    });

                    let imageThumbCount = $('.imageThumb').length;

                    if (imageThumbCount % 3 === 0) {
                        margin += 140;
                    }
                    $('#submitBtn').css('margin-top', margin);

                });
                fileReader.readAsDataURL(f);
            }
        });
    } else {
        alert("Your browser not allowed this file format!")
    }
});
