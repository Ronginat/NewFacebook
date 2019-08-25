Final project of Web technologies course. Demonstrates use of different technologies for web environment.

# New Facebook
Client-Server project that implements some main features from [Facebook](https://facebook.com) - share posts with your friends, manage your friends list, comments on posts, etc.
As a second part of the assignment, we needed to integrate a multiplayer game, that you can invite friends to play against you. We chose one-on-one War (cards) game.
Facebook was worth 60 points and the game was 30 (the rest of 10 pts was a presentation explaining the project).

## About this Project
We were given more than 2 months to develop, it took us about a month.
We worked in pairs (some were working alone). My partner and i used [Github](https://github.org) Version Control Repository for our code management (not this repo) and [Visual Studio Code](https://code.visualstudio.com/) as our code editor.<br />
Our lecturer was <em>Mr. Barshap Mica</em>.

The project was built for academic and study purposes, in Internet Technologies course for Software Engineering BSc.
The project goal was to demonstrate our knowlege by building two web clients with different technologies.
We built our new facebook's web client with [React](https://reactjs.org/), and its server with [Php](https://www.php.net/).
For the game's web client we used html/css and [nodejs](https://nodejs.org/) that manages the connections between players.

Because **New Facebook** is the main and more interesting issue here, we'll discuss it at the main README file. The game will be described in a second [README](War/README.md).
### The development process
From the begining it was clear that it would be most efficient if we worked separately (client and server) and later integrate our work.
It wasn't a requirement, but we knew it'll be easier, quicker and most true to a real development process - build client and server that are communicating with http requests.
First thing, we decided about a Restful API that will be the most easy to use and will cover all of the assignment's requirements.
The API is best described [here](RESTful_API.pdf).

For our server's http requests we used [Apache](https://www.apache.org/) and the database that holds all of the project's data was [MySQL](https://www.mysql.com/). It was easily established using [XAMPP](https://www.apachefriends.org/index.html).
For our http client we used [axios - promise based http client for the browser and node.js](https://github.com/axios/axios).

Each had developed his own part of the bigger (new) facebook. My partner built the client while i was responsible for the server. By the end of the development, we integrated the two projects together.

During development, I learned a whole new language (php) and worked with mysql for the first time, so this project was very interesting project for me.


## Features 
#### Users
- The platform supports user's registration and sign in.<br />
As a security requirement, passwords weren't saved in the db, but their hashes were (using [md5](https://www.php.net/manual/en/function.md5.php)).
- Users can be friends with any user of the platform.<br />
	- There isn't friend request, but one may add/remove anyone to his friends list.<br />
	- Be friends means that you'll see your friend's posts in your feed page.
- There is a search bar for searching users, add or remove them as friends and send them invitation to play (more details later).

#### Posts
- The most important attributes of a post are:
	- content, the actual message of the post.
	- privacy flag. Private post can be viewed only by the user who wrote it.
	- comments, list of comments about the post.
	- images, a user may upload multiple images in his post. <em>Was a requirment.</em>
- Post privacy flag may be changed at any time.

#### More info
- Users can comment on all of the posts.
- Users can like/unlike posts.
- Posts are fetched and viewed in a decsending order and with one request (without pagination), as required by the lecturer.
- When sending an invitation to play, you'll be redirected to the game in a new tab. The game will start when there are 2 users that are ready to play.

## Installation
### Server
In order to run the project, please follow these steps:

1. Install [node with npm](https://nodejs.org/en/download/).
Make sure that node and npm added to [environment PATH](https://www.java.com/en/download/help/path.xml).
2. Install [Xampp](https://www.apachefriends.org/download.html) or any other web development environment that supports php, apache and mysql ([WampServer](http://www.wampserver.com/en/) for example).
3. Create new database with the name "api_db" and run all of our table creation queries that presented [here](Server/create_tables).
4. Download or clone our [server](Server/src) code into xampp/htdocs/newFacebook directory (if using xampp).
5. Run the apache server ("start" next to apache label in xampp-control.exe program).
You will find our server running at PORT 80 with base url of /newFacebook.

### Client
#### [Screenshots](Client/README.md)
You may skip step 1 if already installed node and npm.
1. Install [node with npm](https://nodejs.org/en/download/).
Make sure that node and npm added to [environment PATH](https://www.java.com/en/download/help/path.xml).
2. Download or clone our [client](Client/) code.
3. In the [utils](Client/src/utils) directory of the client project, there is a consts.js file, containing the url of the server, 
currently defined as localhost. Update it if necessary.
4. Open cmd and change directory to the local root directory.
5. Type 'npm install' and wait for the required packages to be installed.
6. When installation finished, type 'npm start'.

The client should be opened automatically in your default browser.<br />
In any case, it will be available at your localhost, port 3000.



## Technologies
* Apache server
* phpMyAdmin
* MySQL - running with MariaDB engine
	* [PDO](https://www.php.net/manual/en/ref.pdo-mysql.php) driver
* [Php7](https://www.php.net/manual/en/migration70.new-features.php)
	* [md5](https://www.php.net/manual/en/function.md5.php)
* JavaScript
* HTML
* CSS
* Development Tools
	* Git
		* Github
	* VSCode
* Platforms:
	* ReactJS
		* axios 
		* [scss](https://github.com/sass/node-sass) - Sassy Cascading Style Sheets
	* NodeJS
		* [socket.io](https://github.com/socketio/socket.io)