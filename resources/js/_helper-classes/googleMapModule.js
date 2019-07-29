/* Usage Example

    new GoogleMap({
        extend: {
        
        },
        map: {
        
        }
        container: '.map',
        icon: `${window.site.theme}/img/svg/pin.svg`,
        zoom: zoom,
        zoomOnClick: 15,
        center: center,
        styles: googleStyles,
        clusters: {
            markerTrigger: 'data-marker',
            onClick(done) {
                TweenMax.to(window, .6, {
                    scrollTo: {y: ".map", offsetY: 70, autoKill: false},
                    onComplete() {done()}
                });
            },
            imagePath: `${window.site.theme}/img/svg/cluster-icon.svg`,
            json: googleJson,
            styles: [{
                className: '.cluster-image',
                url: `${window.site.theme}/img/svg/cluster-icon.svg`,
                width: 36,
                height: 52,
                textColor: "#ffffff",
                textSize: 16
            }]
        },
        geocoding: {
            input: document.querySelector(".map-navigation label input"),
            type: "change",
            callback(response) {
                console.log('geocoding done', response);
            }
        },
        onInit(instance, map) {
        
        }
    });
 *
 */

new GoogleMap({
    extend: {
        clusterJson: googleJson,
        snippetTpl: `<div><p>{{title}}</p><a href="tel:{{phone}}">{{phone}}</a></div>`,
        showOnMap: {
            elements: "data-marker",
            zoom: 15,
            callback(done) {
                //some actions
                // setTimeout(() => {
                //    done()
                // }, 5000)
            }
        },
        geocoding: {
            input: document.querySelector(".map-navigation label input"),
            type: "change",
            callback(response) {
                console.log('geocoding done', response);
            }
        },
        onInit(instance, map) {
        
        }
    },
    map: {
        container: '.map',
        icon: `${window.site.theme}/img/svg/pin.svg`,
        zoom: 10,
        center: {lat: 48.2558897, lng: 26.6927347},
        styles: [],
    },
    cluster: {
        imagePath: `${window.site.theme}/img/svg/cluster-icon.svg`,
        styles: [{
            className: '.cluster-image',
            url: `${window.site.theme}/img/svg/cluster-icon.svg`,
            width: 36,
            height: 52,
            textColor: "#ffffff",
            textSize: 16
        }]
    }
});


const MarkerClusterer = require('node-js-marker-clusterer');

export default class GoogleMap {
    
    constructor(data) {
        
        this.configuration = data;
        this.setupData();
        this.exceptions();
        
        if (this.mapOtions.container && typeof this.mapOtions.container === "string") {
            this.mapOtions.container = document.querySelector(this.mapOtions.container);
        }
        if (this.mapOtions.container.hasAttribute('data-center')) {
            this.mapOtions.center.lat = parseFloat(this.mapOtions.container.getAttribute('data-center').split(',')[0]);
            this.mapOtions.center.lng = parseFloat(this.mapOtions.container.getAttribute('data-center').split(',')[1]);
        }
        
        this.tryInit();
    }
    
    set configuration(allOptions) {
        
        this.extend = Object.assign(
            {
                clusterJson: false,
                snippetTpl: `<div><p>{{title}}</p><a href="tel:{{phone}}">{{phone}}</a></div>`,
                showOnMap: {
                    elements: false,
                    zoom: false,
                    callback: false
                },
                geocoding: {
                    input: false,
                    type: false,
                    callback: false
                },
                onInit: false
            },
            allOptions.extend
        );
        
        this.mapOtions = Object.assign(
            {
                container: false,
                icon: false,
                zoom: 15,
                center: {lat: 48.2558897, lng: 26.6927347}
            },
            allOptions.map
        );
        
        this.cluster = Object.assign(
            {
                imagePath: "https://gmaps-marker-clusterer.github.io/gmaps-marker-clusterer/assets/images/m"
            },
            allOptions.cluster
        );
    }
    
    setupData() {
        this.map = null;
        this.infoWindow = null;
        this.interval = null;
        this.loaded = false;
        this.markerCluster = {};
        this.markersArray = [];
        this.geocodingWindow = {markers: [], infoWindow: []};
    }
    
    exceptions() {
        if (!this.mapOtions.container) new TypeError('Initialize without container');
        if (!this.mapOtions.center || this.mapOtions.center === '') new TypeError('Initialize without center positions');
        if (!this.mapOtions.center && !this.extend.clusterJson) new TypeError('Initialize without any positions');
        if (this.extend && !this.extend.clusterJson) new TypeError('Initialize without clusterJson');
    }
    
    tryInit() {
        if (this.loaded) {
            this.checkGoogleApi();
        } else {
            this.interval = setInterval(() => {
                this.checkGoogleApi();
            }, 2000);
        }
    }
    
    checkGoogleApi() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            this.loaded = true;
            clearInterval(this.interval);
            this.init();
            
            console.log('API for Google Maps was loaded');
            delete this.loaded;
            delete this.interval;
        }
    }
    
    init() {
        
        this.map = new google.maps.Map(this.mapOtions.container, this.mapOtions);
        
        this.infoWindow = new google.maps.InfoWindow();
        
        if (this.extend.clusterJson) {
            this.buildCluster(this.extend);
        }
        
        if (this.extend.geocoding.input) {
            this.makeGeocoding(this.extend.geocoding);
        }
        
        // this.onMapClick();
        // this.onFullScreen();
        
        if (this.extend.onInit) {
            this.extend.onInit(this, this.map);
        }
        
    }
    
    clearGeocoding() {
        this.geocodingWindow.infoWindow.forEach((windowItem) => {
            windowItem.close();
        });
        
        this.geocodingWindow.markers.forEach((windowItem) => {
            windowItem.setMap(null);
        });
        
        this.geocodingWindow = {markers: [], infoWindow: []};
    }
    
    makeGeocoding(params) {
        
        let geocoder = new google.maps.Geocoder(),
            self = this;
        
        try {
            if (params.input && typeof params.input === "string") params.input = document.querySelector(params.input)
        }
        catch (e) {
            new TypeError('Initialize without input element');
        }
        
        params.input.addEventListener(params.type, function () {
            
            if (this.value) {
                if (geocoder) {
                    geocoder.geocode({'address': this.value},
                        function (results, status) {
                            //clear old search;
                            self.clearGeocoding();
                            
                            if (status === google.maps.GeocoderStatus.OK) {
                                if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    self.map.panTo(results[0].geometry.location);
                                    
                                    let marker = new google.maps.Marker({
                                        position: results[0].geometry.location,
                                        map: self.map,
                                        title: results[0].formatted_address
                                    });
                                    
                                    let infoWindow = new google.maps.InfoWindow({
                                        content: '<b>' + results[0].formatted_address + '</b>',
                                        size: new google.maps.Size(150, 50)
                                    });
                                    
                                    google.maps.event.addListener(infoWindow, 'closeclick', function () {
                                        self.clearGeocoding();
                                    });
                                    
                                    self.geocodingWindow.markers.push(marker);
                                    self.geocodingWindow.infoWindow.push(infoWindow);
                                    infoWindow.open(self.map, marker);
                                    params.callback(results);
                                } else {
                                    console.log("No results found");
                                }
                            } else {
                                console.log("Geocode was not successful for the following reason: " + status);
                            }
                            return false;
                        });
                }
            } else {
                self.map.setZoom(self.mapOtions.zoom);
                self.map.panTo(self.mapOtions.center);
            }
            
            return false;
        });
    }
    
    markerSnippet(data) {
        
        console.log(this.extend.snippetTpl);
        
        return `<div class="marker-snippet">
                    <p class="title">${data.title}</p>
                    <p class="address">${data.address}</p>
                </div>`;
    }
    
    getSnippetVars() {
        return this.extend.snippetTpl.match(/{{[a-zA-Z]+}}/gm);
    }
    
    buildCluster(options, locations) {
        
        if (this.markerCluster.clusters_) {
            this.markerCluster.clearMarkers();
            this.mainMap.setZoom(options.zoom);
            this.mainMap.panTo(options.center);
            this.infoWindow.close();
        }
        
        let icon = options.icon,
            self = this;
        
        this.mainMap.panTo(options.center);
        
        for (let i = 0; i < locations.length; i++) {
            
            let position = locations[i].latlng.split(','),
                positionObject = {lat: parseFloat(position[0]), lng: parseFloat(position[1])};
            
            let marker = new google.maps.Marker({position: positionObject, icon: icon});
            
            google.maps.event.addListener(marker, 'click', function (evt) {
                let message = self.markerSnippet(locations[i]);
                console.log('click on marker', evt);
                self.infoWindow.setContent(message);
                self.mainMap.setZoom(self.options.zoomOnClick);
                self.mainMap.panTo(positionObject);
                self.infoWindow.open(self.mainMap, marker);
                return false;
            });
            
            if (this.options.clusters.markerTrigger) {
                if (document.querySelector(`[${this.options.clusters.markerTrigger}="${locations[i].id}"]`)) {
                    document.querySelector(`[${this.options.clusters.markerTrigger}="${locations[i].id}"]`).addEventListener('click', function () {
                        let message = self.markerSnippet(locations[i]);
                        
                        if (self.options.clusters.onClick) {
                            
                            self.options.clusters.onClick(function () {
                                self.infoWindow.setContent(message);
                                if (self.options.zoomOnClick) {
                                    self.mainMap.setZoom(self.options.zoomOnClick);
                                }
                                self.mainMap.panTo(positionObject);
                                self.infoWindow.open(self.mainMap, marker);
                                return false;
                            });
                            
                        } else {
                            self.infoWindow.setContent(message);
                            if (self.options.clusters.zoomOnClick) {
                                self.mainMap.setZoom(self.options.clusters.zoomOnClick);
                            }
                            self.mainMap.panTo(positionObject);
                            self.infoWindow.open(self.mainMap, marker);
                            return false;
                        }
                    });
                }
            }
            
            marker.setMap(this.mainMap);
            this.markersArray.push(marker)
        }
        
        this.markerCluster = new MarkerClusterer(this.mainMap, this.markersArray, this.clusterOptions);
    }
    
    
    
    
    
    
    onFullScreen() {
        let self = this;
        document.addEventListener('fullscreenchange', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            self.mainMap.setOptions({scrollwheel: isFullScreen});
            if (self.options.onFullScreen) {
                self.options.onFullScreen(e, self, isFullScreen);
            }
            return false;
        });
    }
    
    onMapClick() {
        google.maps.event.addListener(this.mainMap, 'click', function (evt) {
            console.log('click on map', evt);
        });
    }
    
}

// function openMarkerInfo(id) {
//     console.log(id);
//     infowindow.close();
//     var marker = markersArray[id];
//     var message = generateMapSnippet(marker.markerContent);
//
//
//     map.setZoom(15);
//     map.panTo(marker.getPosition());
//     infowindow = new google.maps.InfoWindow({
//         content: message
//     });
//     console.log(map);
//     console.log(marker);
//
//     infowindow.open(map, marker);
// }
//
// $('[data-point-id]').click(function () {
//
//     let th = $(this);
//
//     $("html, body").animate({
//         scrollTop: $('.map').offset().top - $('.header').height()
//     }, 500);
//
//     setTimeout(function () {
//         openMarkerInfo(th.attr('data-point-id'));
//     }, 500);
//
// });


// function attachMessage(marker, message, forclicklat, lng) {
//
// 	var infowindow = new google.maps.InfoWindow({
// 		content: message,
// 		disableAutoPan: true
// 	});
//
// 	var mapshere = marker.get('map');
// 	google.maps.event.addListener(marker, 'click', function() {
// 		infowindow.open(mapshere, marker);
// 		mapshere.setZoom(9);
// 		mapshere.setCenter({lat:forclicklat, lng:lng});
// 	});
//
// 	google.maps.event.addListener(map, 'click', function() {
// 		infowindow.close();
// 	});
// }
//

// function getMessage(id, address, phone, time) {
//
// 	if (time.length > 0) {
// 		var text_time   = $("#text_time").val();
// 		time   = "<b>"+text_time+"</b><span class='shop_time'>"+time+"</span>";
// 	}
// 	markersMessages[id] = "<div class='open_store_info'><span class='shop_adress'>"+address+"</span>"+time+"<span class='shop_phone'>"+phone+"</span></div>";
//
// 	return markersMessages[id];
// }
//
//
//
//
// function changeMap()
// {
// 	clearMarkers();
// 	$('#form_maps').submit();
// 	return false;
// }
//
//
// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers() {
// 	//setAllMap(null);
// 	markersArray.forEach(function(item, i, arr) {
// 		markersArray[i].setMap(null);
// 	});
// }
//
// function showStore(str) {
// 	$('.store__item').hide();
// 	$(str).show();
// }


//function add_open_marker( latLng, titleStore, addresStore, phones ) {
//    var latlngStr = latLng.split(',', 2);
//    var lat = parseFloat(latlngStr[0]);
//    var lng = parseFloat(latlngStr[1]);
//    var location = new google.maps.LatLng(lat, lng);
//
//    var image = new google.maps.MarkerImage('/design/promo/img/mapsG.png');
//
//    var marker = new google.maps.Marker({
//        position: location,
//        map: map,
//        icon:image,
//        title: titleStore
//    });

//    var info_content = getMessage(titleStore, addresStore, phones);
//
//    var infowindow = new google.maps.InfoWindow({
//        content: info_content
//    });
//
//    map.setCenter( marker.getPosition() );
//    map.setZoom(12);
//    infowindow.open(map, marker);
//  infowindow.setContent(info_content);

//    markersArray.push(marker);
//}








