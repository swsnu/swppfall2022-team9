# Linklink
[![Build Status](https://travis-ci.com/swsnu/swppfall2022-team9.svg?branch=main)](https://travis-ci.com/swsnu/swppfall2022-team9)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swppfall2022-team9)

## Site Address

# How to run

## Frontend

- `yarn installf`
- `yarn start`

## Backend

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
