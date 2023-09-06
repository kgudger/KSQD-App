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
var monitor = null; // looking for click in iframe.
const rarray = new Uint32Array(1);
self.crypto.getRandomValues(rarray);
var randomnum = rarray[0];   // random number
console.log(randomnum);

/**
 * Things to do when the device is ready.
 */

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById("stream").addEventListener("click", playAudio);
    document.getElementById("psched").addEventListener("click", schedule);
    document.getElementById("donate").addEventListener("click", donate);
    document.getElementById("banner").addEventListener("click", banner);
	fetch_url();
	monitor = setInterval(intervals, 100);
}

var myMedia = null; // media to play
var frameURL = "";  // url in iframe, can be sent to server

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
	  let strm  = document.getElementById('stream')
	  strm.innerHTML = "WAITING FOR STREAM"; 
	  console.log(device.platform);
	  if(device.platform.toLowerCase() == 'android'){
		  myMedia.play();
	  }
	  setTimeout(stopStream, 5000);
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
//   iframe.setAttribute("src","https://widgets.spinitron.com/widget/schedule?station=ksqd");
//   iframe.height = iframe.contentWindow.document.body.scrollHeight;
		var ref = cordova.InAppBrowser.open('https://widgets.spinitron.com/widget/schedule?station=ksqd', '_blank', 'location=yes');

//	var ref = cordova.InAppBrowser.open('https://widgets.spinitron.com/widget/schedule?station=ksqd','_blank', 'location=yes');
}

/**
 * Onclick to open the donate page.
 *
 */
function donate() {
		cordova.InAppBrowser.open('https://ksqd.org/donate/', "_system", "location=yes");
//		var ref = cordova.InAppBrowser.open('https://ksqd.org/donate/', '_blank', 'location=yes');
}

/**
 * Onclick to open the ksqd main page.
 *
 */
function banner() {
		cordova.InAppBrowser.open('https://ksqd.org/', "_system", "location=yes");
//		var ref = cordova.InAppBrowser.open('https://ksqd.org/donate/', '_blank', 'location=yes');
}

/**
 * Timeout function to change the text on the livestream button
 * 
 */
function stopStream() {
	if(device.platform.toLowerCase() != 'android'){
		myMedia.play();
	}
	document.getElementById('stream').innerHTML = "KSQD LIVESTREAM STOP"; 
}

/**
 * Function to change the content in the frame on the page bottom
 * 
 */
function fetch_url() {
    var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", "https://ksqd.org/txt/");
	oReq.send();
}
/**
 * function to receive the info from the url and put it in the frame.
 */
function reqListener () {
  var iframe = document.getElementById("schedule");
  frameURL = this.responseText;
  iframe.setAttribute("src",frameURL);
}

/**
 * function to create an interval to check for a click in the iframe.
 */
function intervals() {
		var elem = document.activeElement;
		if(elem && elem.tagName == 'IFRAME'){
			clearInterval(monitor);
			console.log(frameURL);
			serversend(frameURL); // sends data to server
			monitor = setInterval(exitIframe.bind(null, elem), 100);
		}
}

/**
 * function to reset looking for the click after leaving the iframe.
 */
function exitIframe(iframe) {
	var elem = document.activeElement;
	if((elem && elem.tagName != 'IFRAME') || (elem && elem != iframe)){
		console.log('exited');
		clearInterval(monitor);
		monitor = setInterval(intervals, 100);
	}
}

/**
 * function to send data to server.
 */
function serversend(frameURL) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://ksqd.org/analytics/server.php");
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
//    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
//    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	const body = JSON.stringify({
		random: randomnum,
		url: frameURL,
		click: true
	});
	xhr.onload = () => {
		if (xhr.readyState == 4 && 
				( (xhr.status == 201) || (xhr.status == 200) ) ) {
			console.log(JSON.parse(xhr.responseText));
		} else {
			console.log(`Error: ${xhr.status}`);
		}
	};
	xhr.send(body);	
}
