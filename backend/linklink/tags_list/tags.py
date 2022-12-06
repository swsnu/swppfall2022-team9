"""
tags module for linklink app

keeps a list of quality tags & skill tags
will be imported into models to initialize QualityTag and SkillTag
"""

# --------------------------------------------------------------------------
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
#
#   Changes:
#   The below good words are translated into Korean (2022.12.01)
# --------------------------------------------------------------------------

QUALITY_TAGS = [
    # Korean good words
    "성실한",
    "정직한",
    "이해심이 깊은",
    "논리적인",
    "유쾌한",
    "쾌활한",
    "분석적인",
    "배려심이 깊은",
    "유머러스한",
    "유능한",
    "믿음직한",
    "리더십 있는",
    "열려 있는",
    "신중한",
    "따뜻한",
    "열정적인",
    "흥미로운",
    "책임감 있는",
    "모험적인",
    "한결 같은",
    "감각적인",
    "밝은",
    "솔선수범 하는",
    "효율적인",
    "꼼꼼한",
    # 100 good words
    # "Sincere",
    # "Honest",
    # "Understanding",
    # "Loyal",
    # "Truthful",
    # "Trustworthy",
    # "Intelligent",
    # "Dependable",
    # "Open-Minded",
    # "Thoughtful",
    # "Wise",
    # "Considerate",
    # "Good-Natured",
    # "Reliable",
    # "Mature",
    # "Warm",
    # "Earnest",
    # "Kind",
    # "Friendly",
    # "Kind-Hearted",
    # "Happy",
    # "Clean",
    # "Interesting",
    # "Unselfish",
    # "Good-Humored",
    # "Honorable",
    # "Humorous",
    # "Responsible",
    # "Cheerful",
    # "Trustful",
    # "Warm-Hearted",
    # "Broad-Minded",
    # "Gentle",
    # "Well-Spoken",
    # "Educated",
    # "Reasonable",
    # "Companionable",
    # "Likable",
    # "Trusting",
    # "Clever",
    # "Pleasant",
    # "Courteous",
    # "Quick-Witted",
    # "Tactful",
    # "Helpful",
    # "Appreciative",
    # "Imaginative",
    # "Outstanding",
    # "Self-Disciplined",
    # "Brilliant",
    # "Enthusiastic",
    # "Level-Headed",
    # "Polite",
    # "Original",
    # "Smart",
    # "Forgiving",
    # "Sharp-Witted",
    # "Well-Read",
    # "Ambitious",
    # "Bright",
    # "Respectful",
    # "Efficient",
    # "Good-Tempered",
    # "Grateful",
    # "Conscientious",
    # "Resourceful",
    # "Alert",
    # "Good",
    # "Witty",
    # "Clear-Headed",
    # "Kindly",
    # "Admirable",
    # "Patient",
    # "Talented",
    # "Perceptive",
    # "Spirited",
    # "Sportsmanlike",
    # "Well-Mannered",
    # "Cooperative",
    # "Ethical",
    # "Intellectual",
    # "Versatile",
    # "Capable",
    # "Courageous",
    # "Constructive",
    # "Productive",
    # "Progressive",
    # "Individualistic",
    # "Observant",
    # "Ingenious",
    # "Lively",
    # "Neat",
    # "Punctual",
    # "Logical",
    # "Prompt",
    # "Accurate",
    # "Sensible",
    # "Creative",
    # "Self-Reliant",
    # "Tolerant",
]

# --------------------------------------------------------------------------
#   Skill Tags
#
#   Source: Manually Written
# --------------------------------------------------------------------------

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

SEARCHABLE_KEYWORDS = {
    "프론트엔드": ["Frontend"],
    "프런트엔드": ["Frontend"],
    "프론트": ["Frontend"],
    "프런트": ["Frontend"],
    "웹": ["Frontend"],
    "웹 개발": ["Frontend"],
    "web": ["Frontend"],
    "web development": ["Frontend"],

    "개발": ["Frontend", "Backend", "Software Engineering"],
    "개발자": ["Frontend", "Backend", "Software Engineering"],

    "coding": ["Frontend",
               "Backend",
               "Software Engineering",
               "Deep Learning",
               "Machine Learning",
               "DevOps",
               "MLOps"],

    "백": ["Backend"],
    "백엔드": ["Backend"],
    "서버": ["Backend", "DevOps", "Software Engineering"],
    "server": ["Backend", "DevOps", "Software Engineering"],

    "소프트웨어 공학": ["Software Engineering"],
    "소프트웨어": ["Software Engineering"],

    "딥러닝": ["Deep Learning", "Machine Learning"],
    "딥 러닝": ["Deep Learning", "Machine Learning"],
    "deep": ["Deep Learning", "Machine Learning"],

    "머신러닝": ["Deep Learning", "Machine Learning"],
    "머신 러닝": ["Deep Learning", "Machine Learning"],
    "ml": ["Deep Learning", "Machine Learning"],

    "data science": ["Deep Learning", "Machine Learning"],
    "데이터": ["Deep Learning", "Machine Learning"],
    "데이터 사이언스": ["Deep Learning", "Machine Learning"],
    "데이터 과학": ["Deep Learning", "Machine Learning"],

    "데브옵스": ["DevOps"],
    "development": ["DevOps"],

    "금융공학": ["Financial Engineering"],
    "금융 공학": ["Financial Engineering"],
    "금융": ["Financial Engineering"],
    "증권": ["Financial Engineering"],
    "finance": ["Financial Engineering"],

    "컨설팅": ["Consulting"],
    "전략": ["Consulting"],
    "strategy": ["Consulting"],
    "strategies": ["Consulting"],
    "consultant": ["Consulting"],

    "인사관리": ["Human Resources"],
    "인사 관리": ["Human Resources"],
    "인사": ["Human Resources"],
    "hr": ["Human Resources"],
    "manager": ["Human Resources"],
    "매니저": ["Human Resources"],

    "창업": ["Entrepreneurship"],
    "스타트업": ["Entrepreneurship"],
    "startup": ["Entrepreneurship"],
    "startups": ["Entrepreneurship"],

    "블록체인": ["Blockchain"],
    "블록 체인": ["Blockchain"],
    "회계": ["Accounting"],
    "경영": ["Accounting", "Entrepreneurship"]
}
