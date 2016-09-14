# Dollert
Get notified when dollar reaches the price you're looking for

Dollert is a [Chrome extension](https://chrome.google.com/webstore/detail/dollert/lkbhlmhaiggihoihajncjlnmbpigbkam) to help people who often need to know the current price of USD in BRL. So, the solution was create a little application that accepts expected prices for USD and, in case, USD price to reach the expected price in BRL, a desktop notification is fired.

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

# Release History
- 2016/05/23 **0.2.0** Added dollar current value and its variation and changed currency API
- 2016/04/10 **0.1.0** Initial Release
