import pytest
import json

def test_Brian_in_Portland(author_file_json):
    with author_file_json.open() as f:
        authors = json.load(f)
    assert authors['Brian']['City'] == 'Portland'

def test_all_have_cities(author_file_json):
    with author_file_json.open() as f:
        authors = json.load(f)
    for a in authors:
        assert len(authors[a]['City']) > 0

