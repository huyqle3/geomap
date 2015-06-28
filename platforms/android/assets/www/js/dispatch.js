var myLatlng;
var mapOptions;
var map;
//var projects = "https://api.myjson.com/bins/2735w";
var projects = "https://api.myjson.com/bins/3zlp0";
var employees = "https://api.myjson.com/bins/2uvn8";
var sampleAPI = "https://dl.dropboxusercontent.com/u/72466829/walmart.json";
var marker;
var contentString;
var infowindow;
var img12 ='assets/img/icons/flappybird.png';

function drawMap() {
    myLatlng = new google.maps.LatLng(37.7833, -122.4167);
    console.log(myLatlng);
    mapOptions = {
        zoom: 10,
        center: myLatlng
    };
    map = new google.maps.Map(document.getElementById('mapsDiv'), mapOptions);
    
    var pinColors = ["E63222", "FFFC33", "31D670"];

    $.getJSON( projects, {
        tags: "mount rainier",
        tagmode: "any",
        format: "json"
    })
    .done(function( data ) {
        for (var i = 0; i < data.length; i++) {

            myLatlng = new google.maps.LatLng(data[i].lat, data[i].lon);

            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                icon: "http://maps.google.com/mapfiles/kml/shapes/post_office.png",
                title: data[i].id 

            });
            
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', (function(marker, id, name){
                return function() {
                    contentString = 
                        '<div id="content"><p>'+
                            name + '</p>' +
                            '<img style="width: 40%; height: 40%;" src="http://loremflickr.com/320/240/rooms"/>' +
                            '<p>Chat with:' + name + '<a href="#chatwin" >'+
                            ' Chat</a> <a href="#clientwin" >'+
                            'Forward to Client</a>' + '<span class="fa fa-microphone"></span>' +
                            '<div id="chat"></div><div><input type="text" id="message"><input type="button" value="send" id="send" onclick="sendClick();"></div>' +
                            '</div>'+
                        '</div>';
                      
                marker.setAnimation(google.maps.Animation.DROP);
                var div = document.createElement('div');
                div.innerHTML = contentString;
                infowindow.setContent(div);
//                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
//                    map.setCenter(e.latLng);
                        '</div>';

                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                }
            })(marker, data[i].id, data[i].name));
        }
    });

    $.getJSON( employees, {
            tags: "mount rainier",
            tagmode: "any",
            format: "json"
        })
        .done(function( data ) {
            for (var i = 0; i < data.length; i++) {

                /*
                var personImage = new google.maps.MarkerImage("http://maps.google.com/mapfiles/kml/shapes/man.png",
                        new google.maps.Size(11, 13),
                        new google.maps.Point(0,0),
                        new google.maps.Point(10, 34));
                */

                myLatlng = new google.maps.LatLng(data[i].lat, data[i].lon);

                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: "http://maps.google.com/mapfiles/kml/shapes/man.png",
                    title: data[i].id 

                });
                
                infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', (function(marker, id, name){
                    return function() {
                        contentString = 
                            '<div id="content"><p>'+
                                name + '</p>' +
                                '<img style="width: 40%; height: 40%;" src="http://loremflickr.com/320/240/rooms"/>' +
                                '<p>Chat with:' + name + '<a href="#chatwin" >'+
                                ' Chat</a> <a href="#clientwin" >'+
                                'Forward to Client</a>' + '<span class="fa fa-microphone"></span>' +
                                '<div id="chat"></div><div><input type="text" id="message"><input type="button" value="send" id="send" onclick="sendClick();"></div>' +
                                '</div>'+
                            '</div>';
                          
                    marker.setAnimation(google.maps.Animation.DROP);
                    var div = document.createElement('div');
                    div.innerHTML = contentString;
                    infowindow.setContent(div);
    //                    infowindow.setContent(contentString);
                        infowindow.open(map, marker);
    //                    map.setCenter(e.latLng);
                            '</div>';

                        infowindow.setContent(contentString);
                        infowindow.open(map, marker);
                    }
                })(marker, data[i].id, data[i].name));
            }
        });
}

function positionUpdate(pos) {
    console.log('recentering maps');
    var myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    console.log(myLocation);
    map.setCenter(myLocation);
    mymarker.setPosition(myLocation);
};

function updateLocation(onSuccess) {
    console.log('updateLocation called');
    setTimeout(function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('position successful');
            positionUpdate(pos);
            onSuccess();
        }, function() {
            console.log('error in updateLocation');
            navigator.notification.alert('Failed to determine your position are you running emulated?', function() {}, 'Location Error');
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: false });
    }, 1000);
};

function startWatch() {
    console.log('startWatch called');
    $('#stopWatchLocationBtn').show();
    $('#watchLocationBtn').hide();

    updateLocation(function() {
        // setup the watch only iff a first position could get gathered
        watchId = navigator.geolocation.watchPosition(function(pos) {
            positionUpdate(pos);
        }, function(err) {
            console.log(err);
            navigator.notification.alert('Failed to watch your location!', function() {}, 'Location Error');
            stopWatch();
        });
    });
};

function stopWatch() {
    console.log('stopWatch called');
    navigator.geolocation.clearWatch(watchId);
    $('#watchLocationBtn').show();
    $('#stopWatchLocationBtn').hide();
};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        $('#stopWatchLocationBtn').hide();
        if(window.device.platform === 'iOS') {
            StatusBar.overlaysWebView(false);
        }
        console.log('draw map');
        drawMap();
        $('#updateLocationBtn').click(updateLocation);
        $('#watchLocationBtn').click(startWatch);
        $('#stopWatchLocationBtn').click(stopWatch);
    }
};

drawMap();
