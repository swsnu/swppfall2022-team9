"""
This module generates a init_fake_skill_tags.json file
based on tags_list/tags.py
"""

import json # pragma: no cover

import tags_list.tags as tags # pragma: no cover

if __name__=="__main__": # pragma: no cover
    skill_tags = tags.SKILL_TAGS
    skill_tags_json_fixture = []
    for idx, skill_tag in enumerate(skill_tags):
        skill_tag_json = {
            "model": "linklink.skilltag",
            "pk": idx+1,
            "fields": {
                "name": skill_tag
            }
        }
        skill_tags_json_fixture.append(skill_tag_json)
    with open("init_fake_skill_tags.json", "w") as json_file:
        json.dump(skill_tags_json_fixture, json_file, indent=4)
