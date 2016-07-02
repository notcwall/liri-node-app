var keys = require('./keys.js');
var fs = require('fs');
var spotify = require('spotify');
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var userName = keys.screen_name;
var request = require('request');
var command = process.argv[2];
var userInput = process.argv[3];
var log = "";

function spotifySearch(trackName){
	spotify.search({ type: 'track', query: trackName}, function(err, data){
		if(err){
			console.log("Error occurred: " + err);
			return;
		}
		else if(data.tracks.items[0] != undefined){
			for(var i = 1; i <= data.tracks.items.length; i++){
				if(data.tracks.items[i] != undefined){
					log = log + "\n" + i + "\r\nArtist: " + data.tracks.items[i].artists[0].name +
					"\r\nTrack: " + data.tracks.items[i].name +
					"\r\nAlbum: " + data.tracks.items[i].album.name +
					"\r\nPreview: " + data.tracks.items[i].external_urls.spotify + "\r\n-\r\n";
					console.log("\n" + i + "\n" + "Artist: " + data.tracks.items[i].artists[0].name + "\n" + 
						"Track: " + data.tracks.items[i].name + "\n" + 
						"Album: " + data.tracks.items[i].album.name + "\n" +
						"Preview: " + data.tracks.items[i].external_urls.spotify);					
				}
				else{
					i = data.tracks.items.length + 1;
				}
			}
			fs.appendFile('log.txt', "" + log + ",\r\n", function(err){
				if(err){
					console.log(err);
					return;
				}
			});
		}
		else{
			console.log("Track not found. Default:")
			spotifySearch("what's-my-age-again");
		}
	});
}

function tweets(){
	if(userName != undefined){
		client.get('statuses/user_timeline', userName, function(error, tweets, response){
			if(error){
				log = error[0].message;
				console.log(error);
			}
			else{
				log = "Last 20 tweets from user @" + userName.screen_name + "\r\n----------\r\n";
				console.log("Last 20 tweets from user @" + userName.screen_name + "\n----------");
				for(var i = tweets.length - 1; i > tweets.length - 20; i--){
					log = log + tweets[i].created_at + "\r\n" + tweets[i].text + "\r\n-\r\n";
					console.log(tweets[i].created_at + "\n" + tweets[i].text + "\n");
					if(tweets[i - 1] == undefined){
						i = tweets.length - 20;
					}
				}
			}
			fs.appendFile('log.txt', "" + log + "\r\n,\r\n", function(err){
				if(err){
					console.log(err);
					return;
				}
			});	
		});
	}
	else{
		log = "Twitter user name is undefined.";
		console.log("Twitter user name is undefined.");
		fs.appendFile('log.txt', "" + log + ",\r\n", function(err){
			if(err){
				console.log(err);
				return;
			}
		});	
	}
}

function omdbRequest(title){
	request('http://www.omdbapi.com/?t=' + title + '&&y=&&r=json&&plot=short&&tomatoes=true', function (error, response, body){
		if(!error && response.statusCode == 200){
			if(!body.includes("Movie not found!")){
				var result = [];
				result = body.split('",');
				var searchTitle = "";
				var searchYear = "";
				var searchRating = "";
				var searchCountry = "";
				var searchLanguage = "";
				var searchPlot = "";
				var searchActors = "";
				var searchTomatoesRating = "";
				var searchTomatoesURL = "";
				for(var i = 0; i < result.length; i++){
					if(result[i].includes("Title")){
						searchTitle = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("Year")){
						searchYear = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("imdbRating")){
						searchRating = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("Country")){
						searchCountry = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("Language")){
						searchLanguage = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("Plot")){
						searchPlot = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("Actors")){
						searchActors = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("tomatoRating")){
						searchTomatoesRating = result[i].split(':')[1].split('"')[1];
					}
					if(result[i].includes("tomatoURL")){
						searchTomatoesURL = result[i].split('":')[1].split('"')[1];
					}
				}
				log = "Title: " + searchTitle +
					"\r\nYear: " + searchYear +
					"\r\nIMDB Rating: " + searchRating +
					"\r\nLanguage(s): " + searchLanguage +
					"\r\nPlot: " + searchPlot +
					"\r\nActors: " + searchActors +
					"\r\nRotten Tomatoes Rating: " + searchTomatoesRating +
					"\r\nRotten Tomatoes URL: " + searchTomatoesURL
				console.log("Title: " + searchTitle +
					"\nYear: " + searchYear +
					"\nIMDB Rating: " + searchRating +
					"\nLanguage(s): " + searchLanguage +
					"\nPlot: " + searchPlot +
					"\nActors: " + searchActors +
					"\nRotten Tomatoes Rating: " + searchTomatoesRating +
					"\nRotten Tomatoes URL: " + searchTomatoesURL);
			}
			else{
				console.log("Invalid search term. Default:");
				omdbRequest("mr-nobody");
			}
		fs.appendFile('log.txt', "" + log + "\r\n,\r\n", function(err){
			if(err){
				console.log(err);
				return;
			}
		});
	}
	});
}

function run(){
	switch(command){
		case "spotify-this-song":
			spotifySearch(userInput);
			break;
		case "my-tweets":
			tweets();
			break;
		case "movie-this":
			omdbRequest(userInput);
			break;
		default:
			console.log("Invalid command.");
	}	
}

if(command == "do-what-it-says"){
	fs.readFile("random.txt", "utf-8", function(err, data){
		if(err){
			return console.log(err);
		}
		var dataArray = data.split(',');
		command = dataArray[0];
		userInput = dataArray[1].replace(/ /g, '-');
		run();
	});
}
else{
	run();
}