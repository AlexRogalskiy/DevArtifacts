import pytest

@pytest.fixture(name='lue')
def fixture_with_a_name_much_longer_than_lue():
    'life, the universe, and everything'
    return 42

def test_everything_2(lue):
    assert lue == 42
