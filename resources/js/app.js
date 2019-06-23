
/*********************
 * Section for creating in file function
 * eg:
 *      rendering custom html from json,
 *      load and resize some specific elements on page,
 *      and other
 * Initialize examples:
 *********************/
/**
 *
 * @param {*} parameter
 */
function someFunction(parameter) {}
function loadAndResize(parameter) {}

/*********************
 * Section import custom functions
 * Import examples:
 *********************/
import {
    // readCookie,
    // createCookie,
    // FormValidation,
    isTouchDevice,
    onReady,
    onResize,
    createEvent
} from "./delta-functions";


/*********************
 * initialize some site properties
 *********************/
if (!window.site.hasOwnProperty("scrollBarWidth")){
    window.site.scrollBarWidth = window.innerWidth - document.body.scrollWidth;
}
if (!window.site.hasOwnProperty("supportsVibrate")) {
    window.site.supportsVibrate = "vibrate" in navigator;
}
if (!window.site.hasOwnProperty("isTouch")) {
    window.site.isTouch = isTouchDevice();
}


/*********************
 * Section import jquery and libs
 * Import examples:
 *********************/
// import $ from "jquery";
// window.$ = window.jQuery = $;
// import "jquery-ui/ui/widgets/tabs";


/*********************
 * Section import vanilla JS libs
 * Import examples:
 *********************/
// import { TweenMax } from "gsap/TweenMax";
// import TimelineMax from "gsap/TimelineMax"
// import ScrollToPlugin from "gsap/ScrollToPlugin"
// let scrollTo = ScrollToPlugin;
// import ScrollMagic from 'ScrollMagic';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';


/*********************
 * Section Initialize some constant and manipulate DOM
 * Initialize examples:
 *********************/
// if (!site.isTouch) { } else { }
// function initFormValidation(object) {
//     new FormValidation(object);
// }
// window.initFormValidation = initFormValidation;

// if you use jQuery
$(document)
    .ajaxError(function(event, request, settings) {})
    .ajaxStart(function(event) {})
    .ajaxSuccess(function(event) {})
    .ready(function () {})
    //if you need another instance
    .ready(function () {});

$(window)
    .on("load", function () {
        loadAndResize();
        //etc
    })
    .on("resize", function () {
        loadAndResize();
        //etc
    })
    .on("scroll", function () {});

// else if you use blessed JavaScript
onReady(function() {

});


createEvent(window, "resize", function (e) {
    loadAndResize();
});

createEvent(window, "load", function (e) {
    loadAndResize();
});

createEvent(window, "scroll", function (e) {
    
});
