# Slack_Clone
This is a clone of Slack that has a technology stack of React, Node, MongoDB, and Redis.

## Getting Started:

### Warning:
For now, the passwords to both the MongoDB server and Redis server are not available with the github repo alone. Therefore, one will not be able to run tests or interact with the node server; however, if one has my resume, one will be able to find both passwords in the Project section of the resume under the Slack_Clone project section.

### Perquisites:
To be able to run this application, one will need to install a couple of things in order to use the software.
Brew and the command-line/terminal will be used to help install the following things.
```
brew install node
npm install -g mocha
```

### Installing:
After one clones the repository onto their computer, enter the repository and run this command.
```
npm install
```
After it finishes installing and one has the username, url, and passwords for both Reids and MongoDB servers.
Then...

### Testing:
> - The tests are only available if one has the credentials for both the MongoDB and Redis servers.

To run the test one would use the command:
```
npm test
```

This command will go through all 26 unit tests built with Mocha and Chai.
The tests progress from simple to complex unit tests, so any simple errors are spotted immediately and fixed.

The unit tests are split into 3 categories:
1. Testing databases such as MongoDB and Redis directly (e.g. directly adding channel).
2. Testing database services directly (e.g. creating user, JWT verification).
3. Testing server api endpoints directly (e.g. logging in user, creating new user).

### Future Plans:
This project is still a work in progress with a lot of work done on the backend and a bit on the frontend.
Moving forward, the main objectives would be connecting the react app and node server together and
fixing any security and performance issues that may arise.

### Comments/Suggestions:
Any comments or suggestions are greatly appreciated!
My email is cinefiled@yahoo.com
