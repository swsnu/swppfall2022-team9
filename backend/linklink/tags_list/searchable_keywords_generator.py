"""
This module generates a init_fake_skill_tags.json file
based on tags_list/tags.py
"""

import json # pragma: no cover

from tags import SEARCHABLE_KEYWORDS # pragma: no cover

if __name__=="__main__": # pragma: no cover
    searchable_keywords = SEARCHABLE_KEYWORDS
    searchable_keywords_json_fixture = []
    for idx, keyword in enumerate(searchable_keywords):
        searchable_keywords_json = {
            "model": "linklink.searchable_keywords",
            "pk": idx+1,
            "fields": {
                "name": keyword,
                "values": searchable_keywords[keyword],
            }
        }
        searchable_keywords_json_fixture.append(searchable_keywords_json)
    # pylint:disable=unspecified-encoding
    with open("../fixtures/init_fake_skill_tags.json", "w") as json_file:
        json.dump(searchable_keywords_json_fixture, json_file, indent=4)
