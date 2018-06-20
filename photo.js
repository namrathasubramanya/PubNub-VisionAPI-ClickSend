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
            publish_key: 'pub-c-7fdfeca3-5a0d-4530-8ca9-d299c15d9994',
        		subscribe_key : 'sub-c-3731efe6-6814-11e8-847f-0e36953de9e2'
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
		var message = 'cat!';
		request.open('POST', 'https://api-mapper.clicksend.com/http/v2/send.php');
		
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				console.log('Status:', this.status);
				console.log('Headers:', this.getAllResponseHeaders());
				console.log('Body:', this.responseText);
			}
		};
		var body = "username=namratha&key=7952FDD6-3B27-D217-9A98-E3C684622E2C&to=+61411111111&message=" + message;
		request.send(body);
	}


