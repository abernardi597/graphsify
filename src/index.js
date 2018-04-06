var request = require('request'); // "Request" library

var client_id = 'ea788a5aa0034d16a33d9d60488f2f45'; // Your client id
var client_secret = '2a21c40782a34a71bb28701440b287be'; // Your secret

// your application requests authorization
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

var trackNameToID = function(trackName) {
	var trackNameFormatted = trackName.split(' ').join('+')
	var requestUrl = 'https://api.spotify.com/v1/search/?q=' + trackNameFormatted + '&type=track';
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
	    	console.log(body.tracks.items[0].id);
	      	return body.tracks.items[0].id;
	    });
	  }
	});
}

var trackIDToTrackInfo = function(trackID) {
	var requestUrl = 'https://api.spotify.com/v1/tracks/' + '6rqhFgbbKwnb9MLmUQDhG6'//trackID;
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
	      console.log(body);
	    });
	  }
	});
}

var trackIDToFeatures = function(trackID) {
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
	      	console.log(body);
	    });
	  }
	});
}


var id = trackNameToID("Castle of Glass");
var info = trackIDToTrackInfo(id);
var features = trackIDToFeatures(id);
console.log(info)


// import axios from 'axios';
// var request = require('request');


// var client_id = 'ea788a5aa0034d16a33d9d60488f2f45'; // Your client id
// var client_secret = '2a21c40782a34a71bb28701440b287be'; // Your secret
// var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

// console.log('updated');

// var auth_resp = request.post("https://accounts.spotify.com/api/token", {
// 		Authorization: "Basic ZWE3ODhhNWFhMDAzNGQxNmEzM2Q5ZDYwNDg4ZjJmNDU6MmEyMWM0MDc4MmEzNGE3MWJiMjg3MDE0NDBiMjg3YmU=",
// 		grant_type: "client_credentials",
// 	headers: {
// 		'Content_Type': 'application/json; charset=utf-8',
// 	}
// });

// var auth_resp = axios.post("https://accounts.spotify.com/api/token", {
// 	params: {
// 		Authorization: "Basic ZWE3ODhhNWFhMDAzNGQxNmEzM2Q5ZDYwNDg4ZjJmNDU6MmEyMWM0MDc4MmEzNGE3MWJiMjg3MDE0NDBiMjg3YmU=",
// 		grant_type: "client_credentials",
// 	},
// 	headers: {
// 		'Content_Type': 'application/json; charset=utf-8',
// 	}
// });
//auth_resp.catch(x => console.log(x));


//let resp = axios.get('https://api.spotify.com/v1/tracks/6rqhFgbbKwnb9MLmUQDhG6', {

//});
//resp.then(x => console.log(x));
//resp.catch(x => console.log(x));