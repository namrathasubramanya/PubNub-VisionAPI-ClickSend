(function() {
	var video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var vendorUrl = window.URL || window.webkitURL;
	var photo = document.getElementById('photo');

	navigator.getMedia =  	navigator.getUserMedia ||
						 	navigator.webkitGetUserMedia ||
						 	navigator.mozGetUserMedia ||
						 	navigator.msGetUserMedia;

	navigator.getMedia({
		video: true,
		audio: false
	}, function(stream) {
		video.src = vendorUrl.createObjectURL(stream);
		video.play();
	}, function(error) {
			//error
	});

	document.getElementById("capture").addEventListener("click",function(){
		context.drawImage(video,0,0,400,300);
		photo.setAttribute('src',canvas.toDataURL('image/jpeg',0.7));
	});

	document.getElementById("save").addEventListener('click', function(e) {
	 	this.href = document.getElementById('canvas').toDataURL();
    	this.download = 'my-file-name.jpeg';
	 });  
})();

$(document).ready(function() {
	var pubnub = new PubNub({
		publish_key: 'Enter your publish key here',
		subscribe_key : 'Enter your subscribe key here'
	});
	pubnub.addListener({
      		message: function(message) {
        	console.log(message);
        	console.log(message.message);
        	notifyMe(message.message);
       	 	chatSend(message.message);
      	}
    })

    pubnub.subscribe({
      channels: ["alert_notify"]
    });
	});
	function notifyMe(message) {
		if (message == undefined){
			message = "Hi there! You clicked a button.";
		};
  		if (!("Notification" in window)) {
    			alert("This browser does not support desktop notification");
  		}
  		else if (Notification.permission === "granted") {
  			var options = {
  				image: '/Users/namratha/Downloads/300.jpg'
  			}
    			var notification = new Notification(message, options);
    			// notification.image = '/Users/namratha/Downloads/300.jpg';

  		}
  		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
  				if (permission === "granted") {
    				var notification = new Notification("Hi there!");
  				}
			});
  		}
	}

       	function chatSend(message) {
       		var request = new XMLHttpRequest();
       		var username = 'Enter your ClickSend username here'; 
       		var key = 'YOUR_CLICKSEND_API_KEY';
       		var number = 'Enter your number here';
       		request.open('POST', 'https://api-mapper.clicksend.com/http/v2/send.php');
       		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
       		request.onreadystatechange = function () {
          		if (this.readyState === 4) {
          	   		console.log('Status:', this.status);
          		}
       		};
       		var body = "username="+username+"&key="+key+"&to="+number+"&message=" + message;
       		request.send(body);
       	}


