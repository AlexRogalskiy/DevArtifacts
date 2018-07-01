    // We need to check if the browser supports WebSockets
    if ("WebSocket" in window) {
      // Before we can connect to the WebSocket, we need to start it in Processing.
      // Example using WebSocketP5
      // https://github.com/muthesius/WebSocketP5
      var ws = new WebSocket("ws://localhost:1337/p5websocket");
    } else {
      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your Browser!");
    }
    // Now we can start the speech recognition
    // Supported only in Chrome
    // Once started, you need to allow Chrome to use the microphone
    var recognition = new webkitSpeechRecognition();
    // Be default, Chrome will only return a single result.
    // By enabling "continuous", Chrome will keep the microphone active.
    recognition.continuous = true;
recognition.lang = "en-US";
    recognition.onresult = function(event) {
        // Get the current result from the results object
        var transcript = event.results[event.results.length - 1][0].transcript;
        // Send the result string via WebSocket to the running Processing Sketch
        ws.send(transcript);
      console.log(transcript)
      }
      // Start the recognition
    recognition.start();

recognition.onend = function(){
    recognition.start();
}
