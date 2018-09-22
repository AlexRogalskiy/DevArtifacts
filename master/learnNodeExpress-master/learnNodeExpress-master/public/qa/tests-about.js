suite('"About" Page Tests', function() {
    test('page should contain link to contact page', function() {
        asserts($('a[href="/contact"]').length);
    });
});
