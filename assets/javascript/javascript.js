$(document).ready(function() {

// Initialize Firebase
  	var config = {
    apiKey: "AIzaSyA03gG3hEkm4aHsTKwz1mNjX1jkP5cdh4U",
    authDomain: "trainhw-ff478.firebaseapp.com",
    databaseURL: "https://trainhw-ff478.firebaseio.com",
    projectId: "trainhw-ff478",
    storageBucket: "",
    messagingSenderId: "729033102280"
  	};
  	firebase.initializeApp(config);

  	var database = firebase.database();
// On click push user input to Firebase
  	$("#addTrain").on("click", function(){
  		// Prevents page from refreshing
		event.preventDefault();

		var nameInput = $("#nameInput").val().trim(),
			destinationInput = $("#destinationInput").val().trim(),
			trainTimeInput = $("#trainTimeInput").val().trim(),
			frequencyInput = $("#frequencyInput").val().trim(),
			// Converts the user input to time data in momentjs
			timeConverted = moment(trainTimeInput, "hh:mm").subtract(1, "years"),
			// Stores the current time
			currentTime = moment(),
			// Stores the time difference (in minutes) from when the train started to the current time
			timeDiff = moment().diff(moment(timeConverted), "minutes"),
			// Stores the modulo of the time difference and the frequency
			timeRemainder = timeDiff % frequencyInput,
			// Stores the amount of minutes until the next train
			minutes = frequencyInput - timeRemainder,
			// Stores the time with the added minutes until the next train
			nextTrain = moment().add(minutes, "minutes"),
			// Stores the formatted time data
			nextTrainTime = moment(nextTrain).format("hh:mm");

// Pushes the submitted data to firebase
		database.ref().push({
			name: nameInput,
			destination: destinationInput,
			firstTime: trainTimeInput,
			frequency: frequencyInput,
			nextArrival: nextTrainTime,
			minutesAway: minutes
		})

	})
// Whenever data is added, start this function
	database.ref().on("child_added", function(childSnapshot) {
    // Start filling the table with the data that was added to firebase
	    $("#trainTable").append("<tr><td id='trainName'>" + childSnapshot.val().name +
	      "</td><td id='destination'>" + childSnapshot.val().destination +
	      "</td><td id='frequency'>" + childSnapshot.val().frequency +
	      "</td><td id='arrival'>"+childSnapshot.val().nextArrival+
	      "</td><td id='minutes'>"+childSnapshot.val().minutesAway+"</td></tr>");
    // Handle the errors
    }, function(errorObject) {
    	console.log("Errors handled: " + errorObject.code);
    });


})