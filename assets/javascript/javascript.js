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
		event.preventDefault();

		var nameInput = $("#nameInput").val().trim(),
			destinationInput = $("#destinationInput").val().trim(),
			trainTimeInput = $("#trainTimeInput").val().trim(),
			frequencyInput = $("#frequencyInput").val().trim(),
			timeConverted = moment(trainTimeInput, "hh:mm").subtract(1, "years"),
			currentTime = moment(),
			timeDiff = moment().diff(moment(timeConverted), "minutes"),
			timeRemainder = timeDiff % frequencyInput,
			minutes = frequencyInput - timeRemainder,
			nextTrain = moment().add(minutes, "minutes"),
			nextTrainTime = moment(nextTrain).format("hh:mm");


		database.ref().push({
			name: nameInput,
			destination: destinationInput,
			firstTime: trainTimeInput,
			frequency: frequencyInput,
			nextArrival: nextTrainTime,
			minutesAway: minutes
		})

	})

	database.ref().on("child_added", function(childSnapshot) {
    // full list of items to the well
	    $("#trainTable").append("<tr><td id='trainName'>" + childSnapshot.val().name +
	      "</td><td id='destination'>" + childSnapshot.val().destination +
	      "</td><td id='frequency'>" + childSnapshot.val().frequency +
	      "</td><td id='arrival'>"+childSnapshot.val().nextArrival+
	      "</td><td id='minutes'>"+childSnapshot.val().minutesAway+"</td></tr>");
    // Handle the errors
    }, function(errorObject) {
    	console.log("Errors handled: " + errorObject.code);
    });

	/*database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
		$("#trainName").html(snapshot.val().name);
		$("#destination").html(snapshot.val().destination);
		$("#frequency").html(snapshot.val().frequency);
		$("#arrival").html(snapshot.val().monthlyRate);
		$("#minutes").html(snapshot.val().monthlyRate);
	});	*/



})