var fs = require('fs'),
	xml2js = require('xml2js');



// parse xml file to JSON and write JSON object to file
this.parseDB = function(callback) {
	var self = this;
	console.log("Beginning XML parse (29MB)");
	var parser = new xml2js.Parser();
	fs.readFile('./cloud/CalorieKingDB/foods.xml', function(err, data) {
		// var xml ="<root>Hello xml2js!</root>";
		if (err) {
			console.log("Error reading xml: ", err);
			return;
		}
		var res = data;
		parser.parseString(res, function(err, result) {
			if (err) {
				console.log('Error parsing xml2json: ', err);
				return;
			}
			console.log('Done XML parse');
			console.log('Begin writing to JSON file');
			result = JSON.stringify(result);

			fs.writeFile('./cloud/CalorieKingDB/foods.json', result, function(err) {
				if (err) {
					console.log('Error writing JSON file: ', err);
					throw err;
				}
				console.log('JSON file saved!');
				self.updateDB(function() {
					return callback('test');
				});
			});

		});
	});
}


// populate DB using foods.json file
this.updateDB = function(callback) {
	console.log('BOOM');
	return callback('test');
}