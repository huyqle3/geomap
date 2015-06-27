function drawMap() {
    console.log('draw a basic map');
    map  = new google.maps.Map(document.getElementById('mapsDiv'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(48.33521, 14.32389),
        zoom: 15
    });
    mymarker = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11)),
        shadow: null,
        zIndex: 999,
        map: map
    });
};

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
