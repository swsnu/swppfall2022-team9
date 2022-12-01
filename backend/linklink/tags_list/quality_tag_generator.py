"""
This module generates a init_fake_quality_tags.json file
based on tags_list/tags.py
"""

import json # pragma: no cover

from tags import QUALITY_TAGS # pragma: no cover

if __name__=="__main__": # pragma: no cover
    quality_tags = QUALITY_TAGS
    quality_tags_json_fixture = []
    for idx, quality_tag in enumerate(quality_tags):
        quality_tag_json = {
            "model": "linklink.qualitytag",
            "pk": idx+1,
            "fields": {
                "name": quality_tag
            }
        }
        quality_tags_json_fixture.append(quality_tag_json)
    with open("../fixtures/init_fake_quality_tags.json", "w") as json_file:
        json.dump(quality_tags_json_fixture, json_file, indent=4)
