/**
* Population script for generating random application data. By defualt, this
* script will create generic clinical trial data.
*
* For information on use and how to alter the type of objects created, see the
* README on github (https://github.com/pbenmoser4/cloudmine-samples/tree/master/app-population)
*
* Created by Ben Moser, July 2016
*/

var cloudmine = require('cloudmine');
var _ = require('underscore');

////////////////// Settings //////////////////

// ------- DO NOT ALTER -------
var COUNT_SINGLE = "single";
var COUNT_MULTI = "multi";

var LOGS_OFF = 0;
var LOGS_ESSENTIAL_ONLY = 1;
var LOGS_ALL = 2;
// ----------------------------

// Change this to alter what you see in the output
var LOGS_SETTING = LOGS_ESSENTIAL_ONLY;

//////////////////////////////////////////////


////////////////// CloudMine Credentials //////////////////

var ws = new cloudmine.WebService({
	apiroot: 'https://api.cloudmine.me',
	appid: '61aea9c410c3214d47087b858b409c77',
	apikey: '8FCBEFE8284E44BFA79034EC8D148120',
});

//////////////////////////////////////////////////////////

// The structure of the sample objects that you want to create
var structure = {
	"age_group": {
		"values": ["18-24","25-34","35-44","45-54","55-64","65+"],
		"count": COUNT_SINGLE
	},
	"sex" : {
		"values": ["m","f"],
		"count": COUNT_SINGLE
	},
	"cured": {
		"values": [0,1],
		"count": COUNT_SINGLE
	},
	"effect": {
		"values": ["rash","hives","cough","fever","n/a"],
		"count": COUNT_SINGLE
	},
	"income_group": {
		"values": ["$0-$25,000","$25,001-$50,000","$50,001-$75,000","$75,001-$100,000","$100,001-$150,000","$150,000+"],
		"count": COUNT_SINGLE
	},
	"location": {
		"values": [[39.952388, -77.163599],[38.952388, -76.163599],[39.952388, -75.163599],[40.952388, -74.163599],[41.952388, -73.163599]],
		"count": COUNT_SINGLE
	},
	"year": {
		"values": [2015],
		"count": COUNT_SINGLE
	},
	"month": {
		"values": [1,2,3,4,5,6,7,8,9,10,11,12],
		"count": COUNT_SINGLE
	},
	"drug_info": {
		"values": {
			"placebo": {
				"values": [0,1],
				"count": COUNT_SINGLE
			},
			"dosage": {
				"values": [0.0,0.5,1.0,1.5,2.0,2.5],
				"count": COUNT_SINGLE
			}
		},
		"count": COUNT_SINGLE
	}
}

/**
* Clear all of the data within the application
*
*/
function clearData(){
	ws.destroy(null, {all : true}).on('complete', function(data){
		if (LOGS_SETTING > LOGS_OFF){
			console.log(JSON.stringify(data, null, 2));
		}
	})
}

/**
* Run the program, creating the given number of objects based on the given data structure
* @param count {int} - The number of objects to create and populate into the above-specified application
* @param structure {Object} - Structure for the objects that you want to create.
*/
function run(count, structure){

	for (var i = 0; i < count; i++){

		var newObject = createObjectFromJsonStructure(structure)


		if (LOGS_SETTING > LOGS_OFF){
			var divider = "--------------------------------";
			console.log("Saving new object:\n" + divider + "\n");
			console.log(newObject);
			console.log("\n" + divider + "\n");
		}

		ws.set('', newObject).on('complete', function(data, response) {
			if (LOGS_SETTING > LOGS_OFF){
				console.log(JSON.stringify(data, null, 2))
			}
		});
	}

}

/**
* Takes in specified structure as demonstrated above and creates a valid JSON object
* @param structure {Object} - JSON structure to use when creating objects
* @return object {Object} - an object created from the given structure
*/
function createObjectFromJsonStructure(structure){

	var object = {};

	for (var field in structure){
		var jsonField = structure[field];
		var vals = jsonField["values"];
		var count = jsonField["count"];

		var dat = []

		if (vals instanceof Array){
			// base case
			dat = popValues(count, vals)

		} else if (vals instanceof Object){
			// recursive case
			for (var i = 0; i < genPopCount(count, Object.keys(vals).length); i++){
				dat.push(createObjectFromJsonStructure(vals));
			}

		} else {
			// default
		}

		dat = dat.length == 1 ? dat[0] : dat;
		object[field] = dat;
	}

	return object;

}

/**
* Generate a random number of items to pop from an array of given length
* @param countType {String} - the type of count, currently only single or multiple
* @param length {int} - the length of the array that you want to pop items from
* @return popCount {int} - the number of items to pop from the array
*
*/
function genPopCount(countType, length) {

	var popCount = 1

	if (countType == COUNT_SINGLE){
		return popCount;
	} else if (countType == COUNT_MULTI){
		popCount = Math.floor((Math.random() * length));
		return popCount;
	}
}

/**
* Randomize the array, and then pop the appropriate number of values
* @param countType {String} - The type of count (either single or multiple)
* @param arr {Array} - the array to pop values from
* @return retArray {Array} - a subset of the passed in array
*
*/
function popValues(countType, arr){
	var newArr = shuffle(arr);
	var retArray = []
	if (countType == COUNT_SINGLE) {
		return newArr.slice(0,1)
	} else if (countType == COUNT_MULTI){
		var popCount = genPopCount(countType, arr.length);
		popCount = popCount < 1 ? 1 : popCount;
		return newArr.slice(0,popCount)
	}
}

/**
* Shuffle the contents of an array
* @param array {Array} - The array to shuffle
* @return copy {Array} - A shuffled version of the passed in array
*
*/
function shuffle(array) {
	var copy = _.map(array, _.clone);
	var currentIndex = copy.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = copy[currentIndex];
		copy[currentIndex] = copy[randomIndex];
		copy[randomIndex] = temporaryValue;
	}

	return copy;
}

// run(1, structure);

clearData();
