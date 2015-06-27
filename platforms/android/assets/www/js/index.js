var myLatlng;
var mapOptions;
var map;
var sampleAPI = "https://dl.dropboxusercontent.com/u/72466829/walmart.json";
var marker;
var contentString;
var infowindow;
var url = 'http://server-api.dquid.io/api/v1/data';

function drawMap() {
    myLatlng = new google.maps.LatLng(36.334145, -94.148036);
    console.log(myLatlng);
    mapOptions = {
        zoom: 5,
        center: myLatlng
    };
    map = new google.maps.Map(document.getElementById('mapsDiv'), mapOptions);

    $.getJSON( sampleAPI, {
        tags: "mount rainier",
        tagmode: "any",
        format: "json"
    })
    .done(function( data ) {
        for (var i = 0; i < data.length; i++) {
            myLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);

            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data[i].storenum
            });
            
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', (function(marker, streetaddr, strcity, strstate, zipcode, storenum){
                return function() {
                    var sn;
                    switch (storenum % 3) {
                        case 0: sn = "115";
                        break;
                        case 1: sn = "116";
                        break;
                        case 2: sn = "117";
                        break;
                    }
                    var serialNumber = "0000000000000" + sn;
                    var url3 = url + '/' + serialNumber + '/latest';
                    function callBack(message) {
                        contentString = 
                            '<div id="content">'+
                                '<div id="siteNotice">'+ '</div>'+
                                '<h1 id="firstHeading" class="firstHeading">Store' + storenum + '</h1>'+
                                '<div id="bodyContent">'+
                                    '<p><b>Street Address:</b></br>' + 
                                    streetaddr + "</br>" + 
                                    strcity + ", " + strstate + " " + zipcode +
                                    '</p>'+
                                    '<p>' + message + '</p>' +
                                    '<p>Chart with us: <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                                    'https:/baytekhackandplay.com</a>'+
                                '</div>'+
                            '</div>';

                        infowindow.setContent(contentString);
                        infowindow.open(map, marker);
                    }

                    $.ajax({
                        url: url3,
                        statusCode: {
                            200: function(response) {
                                var prettyPrintResponse = JSON.stringify(response,null,2);
                                prettyPrintResponse = '200, OK \n\n' + prettyPrintResponse;
                                callBack(prettyPrintResponse);
                            },
                            400: function() {
                                callBack("400, Bad Request");
                            },
                            404: function() {
                                callBack("404, Not Found");
                            },
                        }
                    });
                };
            })(marker, data[i].streetaddr, data[i].strcity, data[i].strstate, data[i].zipcode,
                 data[i].storenum ));
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
