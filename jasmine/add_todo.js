var ToDo = {
  setup: function(){
    ToDo.setupCreateClickEvent();
  },
  setupCreateClickEvent: function(){
    $('#create').click(function(event){
      event.preventDefault();
      ToDo.addToDo($('#todo').val());
      $('#todo').val("").focus();
    });
  },
  addToDo: function(todo){
    $('#todo_list').append("<li>" + todo + "</li>"); 
  }
};
