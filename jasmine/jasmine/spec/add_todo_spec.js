describe('Add ToDo', function () {
  var mocks = {};
  beforeEach(function () {
    loadFixtures("index.html");
    mocks.todo = "something fun";
    $('#todo').val(mocks.todo);
    ToDo.setup();
  });
  it('calls the addToDo function when create is clicked', function () { 
    spyOn(ToDo, 'addToDo');
    $('#create').click();
    expect(ToDo.addToDo).toHaveBeenCalledWith(mocks.todo);
  });
  it('triggers a click event when create is clicked.', function() {
    spyOnEvent($('#create'), 'click');
    $('#create').click();
    expect('click').toHaveBeenTriggeredOn($('#create'));
  });
});

