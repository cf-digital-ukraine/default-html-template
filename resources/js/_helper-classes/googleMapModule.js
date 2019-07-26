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

let snippet = `<div>
        <p>{{title}}</p>
</div>`;

new GoogleMap({
    extend: {
        clusterJson: googleJson,
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
        center: { lat: 48.2558897, lng: 26.6927347 },
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
        
        this.options = Object.assign(
            {
                container: false,
                center: { lat: 48.2558897, lng: 26.6927347 },
                icon: false,
                onFullScreen: false,
                clusterIcon: false,
                zoom: 10,
                zoomOnClick: 15,
                styles: [],
                clusters: false,
                onInit: false,
                direction: false
            },
            data
        );
        
        if(this.options.container && typeof this.options.container === "string"){
            this.options.container = document.querySelector(this.options.container);
        }
        
        if(this.options.container.hasAttribute('data-center')){
            this.options.center.lat = parseFloat(this.options.container.getAttribute('data-center').split(',')[0]);
            this.options.center.lng = parseFloat(this.options.container.getAttribute('data-center').split(',')[1]);
        }
        
        this.data = this.options;
        this.configure();
        this.tryInit();
    }
    
    set data(params) {
        
        this.mainMap = null;
        this.infoWindow = null;
        this.interval = null;
        this.loaded = false;
        
        this.clusterOptions = Object.assign(
            {
                onClick: false,
                markerTrigger: false,
                imagePath: "https://gmaps-marker-clusterer.github.io/gmaps-marker-clusterer/assets/images/m"
            },
            params.clusters
        );
        
        this.markerCluster = {};
        this.markersArray = [];
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
    
    configure() {
        if (!this.options.container) throw Error('Initialize without container');
        if (!this.options.center || this.options.center === '') throw Error('Initialize without center positions');
        if (!this.options.center && !this.options.clusters) throw Error('Initialize without any positions');
        if (this.options.clusters && !this.options.clusters.json) throw Error('Initialize without clusterJson');
        if (!this.options.container.length) return false;
    }
    
    
    init() {
        
        this.mainMap = new google.maps.Map(this.options.container, {
            center: new google.maps.LatLng(this.options.center),
            zoom: this.options.zoom,
            icon: this.options.icon,
            styles: this.options.styles,
            
            disableDefaultUI: true,
            
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.ZOOM_PAN
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            fullscreenControl: false,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            scrollwheel: false
        });
        this.infoWindow = new google.maps.InfoWindow();
        
        if (this.options.clusters) {
            this.buildCluster(this.options, this.options.clusters.json);
        }
        
        if(typeof this.options.geocoding === "object") {
            this.makeGeoCoding(this.options.geocoding);
        }
        
        this.onMapClick();
        this.onFullScreen();
    
        if(this.options.onInit) {
            this.options.onInit(this, this.mainMap);
        }
        
    }
    
    makeGeoCoding(params) {
        this.mainMap.geocodingWindow = {markers: [], infoWindow: []};
    
        let geocoder = new google.maps.Geocoder(),
            _this = this;
        
        if(!params.input || typeof params.input === "string") return false;
        
        params.input.addEventListener(params.type, function () {
            let input = this;
            if (this.value) {
                if (geocoder) {
                    geocoder.geocode({'address': input.value},
                        function(results, status) {
                            //clear old search;
                            _this.mainMap.geocodingWindow.infoWindow.forEach((windowItem) => {
                                windowItem.close();
                            });

                            _this.mainMap.geocodingWindow.markers.forEach((windowItem) => {
                                windowItem.setMap(null);
                            });

                            _this.mainMap.geocodingWindow = {markers: [], infoWindow: []};

                            if (status === google.maps.GeocoderStatus.OK) {
                                if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    _this.mainMap.panTo(results[0].geometry.location);

                                    let marker = new google.maps.Marker({
                                        position: results[0].geometry.location,
                                        map: _this.mainMap,
                                        title: results[0].formatted_address
                                    });

                                    let infoWindow = new google.maps.InfoWindow({
                                        content: '<b>' + results[0].formatted_address + '</b>',
                                        size: new google.maps.Size(150, 50)
                                    });
                                    google.maps.event.addListener(infoWindow,'closeclick',function(){
                                        marker.setMap(null);
                                        _this.mainMap.geocodingWindow = {markers: [], infoWindow: []};
                                    });

                                    _this.mainMap.geocodingWindow.markers.push(marker);
                                    _this.mainMap.geocodingWindow.infoWindow.push(infoWindow);
                                    infoWindow.open(_this.mainMap, marker);
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
                _this.mainMap.setZoom(_this.options.zoom);
                _this.mainMap.panTo(_this.options.center);
            }

            return false;
        });
    }
    
    onFullScreen() {
        let self = this;
        document.addEventListener('fullscreenchange', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            self.mainMap.setOptions({ scrollwheel: isFullScreen });
            if(self.options.onFullScreen) {
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
    markerSnippet(data) {
        return `<div class="marker-snippet">
                    <p class="title">${data.title}</p>
                    <p class="address">${data.address}</p>
                </div>`;
    }
    buildCluster(options, locations) {
        
        if (this.markerCluster.clusters_) {
            this.markerCluster.clearMarkers();
            this.mainMap.setZoom(options.zoom);
            this.mainMap.panTo(options.center);
            this.infoWindow.close();
        }
        
        let icon = options.icon,
            self= this;
        
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
            
            if(this.options.clusters.markerTrigger) {
                if(document.querySelector(`[${this.options.clusters.markerTrigger}="${locations[i].id}"]`)) {
                    document.querySelector(`[${this.options.clusters.markerTrigger}="${locations[i].id}"]`).addEventListener('click', function () {
                        let message = self.markerSnippet(locations[i]);
        
                        if(self.options.clusters.onClick) {
            
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








