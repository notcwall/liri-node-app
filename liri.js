var keys = require('./keys.js');
var fs = require('fs');
var command = process.argv[2];
var userInput = process.argv[3];
console.log(command);

switch(command){
	case "do-what-it-says":
		fs.readFile("random.txt", "utf-8", function(err, data){
			if(err){
				return console.log(err);
			}
			var dataArray = data.split(',');
			command = dataArray[0];
			userInput = dataArray[1];
		});
	case "spotify-this-song":
		console.log("success");
		break;
	default:
		console.log("Invalid command.");
}