# Dollert
Get notified when dollar reaches the price you're looking for

[![Code Climate](https://codeclimate.com/github/rafaelcamargo/dollert/badges/gpa.svg)](https://codeclimate.com/github/rafaelcamargo/dollert) [![Test Coverage](https://codeclimate.com/github/rafaelcamargo/dollert/badges/coverage.svg)](https://codeclimate.com/github/rafaelcamargo/dollert/coverage) [![Build Status](https://travis-ci.org/rafaelcamargo/dollert.svg?branch=master)](https://travis-ci.org/rafaelcamargo/dollert)

Dollert is a [Chrome extension](https://chrome.google.com/webstore/detail/dollert/lkbhlmhaiggihoihajncjlnmbpigbkam) to help people who often need to know the current price of USD in BRL. So, the solution was create a little application that accepts expected prices for USD and, in case of USD price to reach the expected price in BRL, a desktop notification is fired.

## Contribute
To contribute with this project, do the following:
- You need to have Nodejs installed. Use `apt-get`, `brew` or get it direct from its website (https://nodejs.org/en/)
- Fork and clone the project.
- Go to its directory `cd dollert`
- Install grunt `npm install -g grunt grunt-cli`
- Install all dependencies `npm install`
- Build the project and keep watching for your changes `grunt start`
- Upload `dist` directory as a *develop extension* (https://developer.chrome.com/extensions/getstarted#unpacked)
- Done!

## Pull Requests
Make sure to run `grunt karma` in your branch before open a PR. We use coverage threshold to ensure 100% of code coverage.
So, if you added one function only, but did not write an unit test for that, build will not pass.

## Release History
- 2017/12/13 **0.3.1** Changed currency API
- 2016/11/15 **0.3.0** Added form validation and dismissing last notified alert during 30 minutes
- 2016/05/23 **0.2.0** Added dollar current value and its variation and changed currency API
- 2016/04/10 **0.1.0** Initial Release
