# LinkLink
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team9.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team9)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team9&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swppfall2022-team9)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team9/badge.svg?branch=main&kill_cache=17)](https://coveralls.io/github/swsnu/swppfall2022-team9?branch=main)

# Preview
https://user-images.githubusercontent.com/74580163/208284850-d7c12217-b77c-4685-a9e2-4b859738b812.mov


# Site Address
<https://linklinkchon.netlify.app/>

# How to run

## Frontend

- `yarn installf`
- `yarn start`

## Backend

- `cd backend`
- `pip install -r requirements.txt`
- `python manage.py runserver`

# How to test

## Frontend

### Unit Test

Used `Enzyme` for frontend testing

- `yarn testf`

### Lint Check

Used `Eslint` with `eslint-config-airbnb`

- `eslint src`or `yarn lintf`

## Backend

### Unit Test

Used `Pytest` and `Coverage`

- `cd backend`
- `coverage run --branch --source='./linklink' manage.py test linklink/tests`

Or type:
- `yarn testb`

### Lint Check

Used `Pylint`

- `cd backend`
- `pylint --rcfile=pylintrc **/*.py`

Or type:
- `yarn lintb`

# Language & Framework Versions
- python == 3.8
- Django == 4.1

# Backend Commands

## Load initial fake data
- `cd backend`
- `python manage.py loaddata */fixtures/*.json`

Or simply type:
- `yarn loaddb`
