suit('Global Tests', function() {
    test('page has a valid title', function() {
        assert(document.title && document.title.math(/\S/) && document.title.toUpperCase() !== 'TODO');
    });
});
