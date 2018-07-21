$(document).ready(function() {

	// Event that triggers the minimization of the chat window.
	$('.chat-conversation-user-info, .chat-list-header').on('click', function(){
		$('.chat-window-mask').toggleClass('minimize-chat');
	});

	function sendMessage() {
		// Get text message from input.
		var newMessage = $('#chat-input').val();
		// If input is empty on trying to send message, prevent sending.
		if (newMessage == '') {
			return false;
		} else {
			// Add to conversation.
			$('<article class="chat-bubble-containter"><p class="chat-bubble-right">' + newMessage + '</p></article>').appendTo('.chat-conversation-body');
			// Add message as last message received in the chat list.
			$('#chatID-1 .chat-item-last-message').html('<span class=".chat-item-last-message">' + newMessage + '</span');
			// Clear input.
			$('#chat-input').val('');
		}
	}

	$('.chat-conversation-send').on('click', function() {
		sendMessage();
	});

	$('#chat-input').keypress(function(e) {
		if(e.which == 13) {
			sendMessage();
		}
	});

	// Show new message notification after x seconds.
	function newMessage() {
		$('.chat-back-arrow').addClass('chat-conversation-new-message');
		$('#chatID-2 .chat-item-user').addClass('chat-item-new-message');
	}
	setTimeout(newMessage, 4000);

	// Go to chat list view.
	$('.chat-back-arrow').on('click', function() {
		$('.chat-window-box').addClass('chat-list-toggle');
	});

	// Click chat to go to its conversation view.
	$('#chatID-1, #chatID-2').on('click', function() {
		$('.chat-window-box').removeClass('chat-list-toggle');
	});

	// Remove notification classes.
	$('#chatID-2').on('click', function() {
		$('.chat-back-arrow').removeClass('chat-conversation-new-message');
		$('#chatID-2 .chat-item-user').removeClass('chat-item-new-message');
	});

	// Click to close chat conversation from the list.
	$('.chat-item-close').on('click', function() {
		$('.chat-item').addClass('close-chat');
	});

	// Click to close chat window altogether.
	$('.chat-close-window').on('click', function() {
		$('.chat-window-mask').addClass('close-chat');
	});

});