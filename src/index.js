// TO GET PASSED THE CORS ERROR:
// open windows "run"
// enter command: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
// the window that opens allow the security to be bypassed

var request = require('request'); // "Request" library

var client_id = 'ea788a5aa0034d16a33d9d60488f2f45'; // Your client id
var client_secret = '2a21c40782a34a71bb28701440b287be'; // Your secret

// Application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// the 
var id = "0";
var info = null;
var features = null;

var trackNameToID = function(trackName, artist, callback) {
	var trackNameFormatted = trackName.split(' ').join('+')
	var artistNameFormatted = trackName.split(' ').join('+')
	var query = trackNameFormatted + '+' + artistNameFormatted
	var requestUrl = 'https://api.spotify.com/v1/search/?q=' + query + '&type=track';
	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

	    // use the access token to access the Spotify Web API
	    var token = body.access_token;
	    var options = {
	      url: requestUrl,
	      headers: {
	        'Authorization': 'Bearer ' + token
	      },
	      json: true
	    };
	    request.get(options, function(error, response, body) {
	      	id = body.tracks.items[0].id;
	      	callback(id);
	    });
	  }
	});
}

var trackNameToTrackInfo = function(trackName, artist, callback) {
	trackNameToID(trackName, artist, function(trackID) {
		var requestUrl = 'https://api.spotify.com/v1/tracks/' + trackID;
		request.post(authOptions, function(error, response, body) {
		  if (!error && response.statusCode === 200) {

		    // use the access token to access the Spotify Web API
		    var token = body.access_token;
		    var options = {
		      url: requestUrl,
		      headers: {
		        'Authorization': 'Bearer ' + token
		      },
		      json: true
		    };
		    request.get(options, function(error, response, body) {
		      info = body;
		      callback(info);
		    });
		  }
		});
	})
}

var trackNameToFeatures = function(trackName, artist, callback) {
	trackNameToID(trackName, artist, function(trackID) {
		request.post(authOptions, function(error, response, body) {
		  if (!error && response.statusCode === 200) {

		    // use the access token to access the Spotify Web API
		    var token = body.access_token;
		    var options = {
		      url: 'https://api.spotify.com/v1/audio-features/6rqhFgbbKwnb9MLmUQDhG6',
		      headers: {
		        'Authorization': 'Bearer ' + token
		      },
		      json: true
		    };
		    request.get(options, function(error, response, body) {
		      	features = body;
		      	callback(features);
		    });
		  }
		});
	}) 
}

trackNameToTrackInfo("Castle of Glass", "Linkin Park", function(info) {
	console.log(info);
});
trackNameToFeatures("Castle of Glass", "Linkin Park", function(features) {
	console.log(features);
})
