"""
tags module for linklink app

keeps a list of quality tags & skill tags
will be imported into models to initialize QualityTag and SkillTag
"""

#--------------------------------------------------------------------------
#   Quality Tags
#
#   Source:
#   Anderson, N. H. (1968).
#   "Likableness ratings of 555 personality-trait words."
#   Journal of Social Psychology, 9, 272-279.
#
#   Dataset Background:
#   The above study conducted a study on 100 college students
#   to rank 555 personal qualities. They are sorted in good->bad order.
#
#   The below list is a shortened version of the original ranked list
#   It contains top 100 good words.
#--------------------------------------------------------------------------

QUALITY_TAGS = [
    # 100 good words
    "Sincere",
    "Honest",
    "Understanding",
    "Loyal",
    "Truthful",
    "Trustworthy",
    "Intelligent",
    "Dependable",
    "Open-Minded",
    "Thoughtful",
    "Wise",
    "Considerate",
    "Good-Natured",
    "Reliable",
    "Mature",
    "Warm",
    "Earnest",
    "Kind",
    "Friendly",
    "Kind-Hearted",
    "Happy",
    "Clean",
    "Interesting",
    "Unselfish",
    "Good-Humored",
    "Honorable",
    "Humorous",
    "Responsible",
    "Cheerful",
    "Trustful",
    "Warm-Hearted",
    "Broad-Minded",
    "Gentle",
    "Well-Spoken",
    "Educated",
    "Reasonable",
    "Companionable",
    "Likable",
    "Trusting",
    "Clever",
    "Pleasant",
    "Courteous",
    "Quick-Witted",
    "Tactful",
    "Helpful",
    "Appreciative",
    "Imaginative",
    "Outstanding",
    "Self-Disciplined",
    "Brilliant",
    "Enthusiastic",
    "Level-Headed",
    "Polite",
    "Original",
    "Smart",
    "Forgiving",
    "Sharp-Witted",
    "Well-Read",
    "Ambitious",
    "Bright",
    "Respectful",
    "Efficient",
    "Good-Tempered",
    "Grateful",
    "Conscientious",
    "Resourceful",
    "Alert",
    "Good",
    "Witty",
    "Clear-Headed",
    "Kindly",
    "Admirable",
    "Patient",
    "Talented",
    "Perceptive",
    "Spirited",
    "Sportsmanlike",
    "Well-Mannered",
    "Cooperative",
    "Ethical",
    "Intellectual",
    "Versatile",
    "Capable",
    "Courageous",
    "Constructive",
    "Productive",
    "Progressive",
    "Individualistic",
    "Observant",
    "Ingenious",
    "Lively",
    "Neat",
    "Punctual",
    "Logical",
    "Prompt",
    "Accurate",
    "Sensible",
    "Creative",
    "Self-Reliant",
    "Tolerant",
]

#--------------------------------------------------------------------------
#   Skill Tags
#
#   Source: Manually Written
#--------------------------------------------------------------------------

SKILL_TAGS = [
    # CS related skills
    "Frontend",
    "Backend",
    "Software Engineering",
    "Deep Learning",
    "Machine Learning",
    "DevOps",
    "MLOps",
    # fields
    "Financial Engineering",
    "Consulting",
    "Human Resources",
    "Entrepreneurship",
    "Blockchain",
    "Accounting",
]
