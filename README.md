# Linklink
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team9.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team9)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team9&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swppfall2022-team9)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team9/badge.svg)](https://coveralls.io/github/swsnu/swppfall2022-team9?branch=main)

# Site Address
TBD

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

- `coverage run --branch --source="." -m pytest`
- `coverage report --fail-under=80 -m`

  Or just type

- `yarn testb`

### Lint Check

Used `Pylint`

- `pylint ./*/` or `yarn lintb`

# Language & Framework Versions
- python == 3.8
- Django == 4.1
