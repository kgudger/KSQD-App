/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/** @file index.js
 *	Purpose:  contains all of the javascript for the index file
 *
 * @author Keith Gudger
 * @copyright  (c) 2023, Keith Gudger, all rights reserved
 * @license    http://www.apache.org/licenses/LICENSE-2.0
 * @version    Release: 0.1
 * @package    KSQD
 *
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

/**
 * Things to do when the device is ready.
 */

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
//    document.getElementById('deviceready').classList.add('ready');
    document.getElementById("stream").addEventListener("click", playAudio);
    document.getElementById("psched").addEventListener("click", schedule);
    document.getElementById("donate").addEventListener("click", donate);

}

var myMedia = null;

/**
 * Onclick from "Play Livestream".
 *
 */
function playAudio() {
   var src = "https://ksqd.info:8100/stream";

   if(myMedia === null) {
      myMedia = new Media(src, onSuccess, onError);

      function onSuccess() {
         console.log("playAudio Success");
      }

      function onError(error) {
         console.log("playAudio Error: " + error.code);
      }
	  myMedia.play();
	  let strm  = document.getElementById('stream')
	  strm.innerHTML = "KSQD LIVESTREAM STOP"; 
	}
	else {
		stopAudio();
	}
}

/**
 * Onclick to stop the livestream
 *
 */
function stopAudio() {
   if(myMedia) {
      myMedia.stop(); 
   }
	document.getElementById("stream").innerHTML="KSQD LIVESTREAM";
   myMedia = null;
}
// http://ksqd.info:8000/stream

/**
 * Onclick to display the schedule from spinitron.
 *
 */
function schedule() {
   var iframe = document.getElementById("schedule");
   iframe.setAttribute("src","https://widgets.spinitron.com/widget/schedule?station=ksqd");
//   iframe.height = iframe.contentWindow.document.body.scrollHeight;

//	var ref = cordova.InAppBrowser.open('https://widgets.spinitron.com/widget/schedule?station=ksqd','_blank', 'location=yes');
}

/**
 * Onclick to open the donate page.
 *
 */
function donate() {
	var ref = cordova.InAppBrowser.open('https://ksqd.org/donate/', '_blank', 'location=yes');
//	window.location="https://ksqd.org/donate/"
}
