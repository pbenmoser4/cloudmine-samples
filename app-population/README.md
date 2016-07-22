# CloudMine Application Population Script

This is a script written in [node.js]('https://nodejs.org/en/') intended to help new users populate an application with dummy data for testing purposes.

## Use

To use this script, clone or download the [`cloudmine-samples`]('https://github.com/pbenmoser4/cloudmine-samples') repo and navigate to the `app-population` directory in your terminal.

### CloudMine credentials

Before taking any actions, you will need to enter in the appropriate credentials for the application that you are using. These can be found in the [Compass Dashboard]('https://compass.cloudmine.io/dashboard/#/'). The CloudMine WebService object being used to carry out all of the functionality of this application is defined at the top of the `populate.js` script; enter in the appropriate `appid` (Application ID) and `apikey` (API Key) credentials here.

### Making it run

Within the `populate.js` script, there are two options: `run()` and `clearData()`. To clear all application level objects (delete all), go to the bottom of the script and uncomment the line calling `clearData()`, and comment out the `run()` line above it. To create new objects within an application, uncomment the `run()` line, and comment out the `clearData()` line. The `run()` function takes two arguments: `count` and `structure`. Enter in the number of objects you would like to create as the `count` argument (first argument), and designate the structure of the objects you would like to create as the `structure` argument (second argument).

Once you have made these changes, run `node populate.js` from within the `app-population` directory in your terminal to carry out the deletion or creation process.

## A Note on `structure`

The `structure` variable is used as the foundation of the objects being created within this script, and is of the following format:

```
{
  "field_name_1": {
    "values": ["value1", "value2"],
    "count": COUNT_SINGLE
  },
  "field_name_2": {
    "values": [1,2,3,4],
    "count": COUNT_MULTI
  },
  "field_name_3": {
    "values": {
      "subfield1": {
        "values": ["subvalue1", "subvalue2"],
        "count": COUNT_SINGLE
      }
    }
  }
}
```

Where each of the `field_name`s above correspond to the name of an object field in the created object, the `values` of each `field_name` correspond to the possible values of that field, and the `count` refers to whether a single value or an array of values should be generated.

Notice that, when sub-fielding, creating one structure for the subfield is enough. Specifying `COUNT_MULTI` on a subfield will generate an array of subfields based on the seed structure of that subfield. 

---------

Created by Ben Moser, 2016
