$(function(){
	var recognition = new webkitSpeechRecognition();
	console.log(recognition);
	recognition.onresult = function(event) {
		console.log(event.results[0][0].transcript);
		$("#result").html(event.results[0][0].transcript);
	};
	$("#startRecog").on('click', function(evt){
		recognition.start();
	});
	$("#submit").on('click', function(evt){
		let string = $("#result").html();
		window.open("/NLPdemo?query="+string);
	});
});