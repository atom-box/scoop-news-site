/****************************************************
/*  PROJECT V1.0  THE SCOOP (a Reddit clone)
/*  This program was completed for the 
/*  Codecademy course "Build Your Own API's"
/*
/*  To run this program:
/*  1) Open index.html in a browser
/*  2) In a terminal enter this command:  node server.js
/*  3) As long as you have all the files that came in this package
/*    The Scoop should work.   Functionality: you should see a sort 
/*    of newspost bulletin board that you can upvote/downvote the 
/*    articles and comments.
/*  4) Big downside:  it is not yet persistant.  
/*      Implementing YAML for persistance was extra credit.  I am behind 
/*      schedule in this course, though.  I would love to 
/*      come back and make this work and put it in my resume.
/*
/*  By Evan Genest
/*  https://github.com/atom-box/ 
/*  Twitter@MisterGenest 
/*  started December 9, 2017 
/*  finished December 15 (with 2 days off)
/*
/*  Total time it took me:  
/*  TWENTY SEVEN HOURS!!   (I keep a timesheet.)
/*  
/*  DESCRIPTION:  server.js is part of Unit 3:The Scoop 
/*  The scoop has like nine files, written 
in javascript and node.js.   
/*  The school, Codecademy wrote the longer files, 
including the HTML and the functionality for 
/*  much of the website. 
/*
/*  My job was to figure out the existing data logic 
and extend their program to allow users to comment on news stories.  
This program was completed for the Codecademy course "Build Your Own API's"
Written by Evan Genest! December 9, 2017 */



let database = {
/* I was too nervous to use CONST.   Used LET.  Too scared of contributing to subtle bugs.  Still don't trust CONST to let me MUTATE things. [NOTE: Just finished project.  All tests pass.  FOUR TESTS FAIL if I change this to CONST.   Too tired to investigate further.] */ 

  users: {},
  articles: {},
  comments: {},   
  // I MADE THIS
  nextArticleId: 1,
  nextCommentId: 1
};

const routes = {
  '/users': {
    'POST': getOrCreateUser
  },
  '/users/:username': {
    'GET': getUser
  },
  '/articles': {
    'GET': getArticles,
    'POST': createArticle
  },
  //  /  /  /  /  /  /  /  /  /  /  /  /

  '/comments': {
    'POST': createComment   //createComment
  },

  '/comments/:id': {
    'PUT': updateComment,
    'DELETE': deleteComment
  },
  //  /  /  /  /  /  /  /  /  /  /  /  /
  '/articles/:id': {
    'GET': getArticle,
    'PUT': updateArticle,
    'DELETE': deleteArticle
  },
  '/articles/:id/upvote': {
    'PUT': upvoteArticle
  },
  '/articles/:id/downvote': {
    'PUT': downvoteArticle
  }
  ,
  '/comments/:id/upvote': {
    'PUT': upvoteComment
  },
  '/comments/:id/downvote': {
    'PUT': downvoteComment
  }
};

function SNAFU(){
  console.log('Open your mouth and say "SNFU" ');
};

function getUser(url, request) {
  const username = url.split('/').filter(segment => segment)[1];
  //  MULL     OVER   the ABOVE  ooooooooooooooooooooooooooooooooooooooo
  const user = database.users[username];
  // 'user' unpacks to d/u/u/
  const response = {};

  if (user) {
    const userArticles = user.articleIds.map(
        articleId => database.articles[articleId]);
    const userComments = user.commentIds.map(
        commentId => database.comments[commentId]);
    response.body = {
      user: user,
      userArticles: userArticles,
      userComments: userComments
    };
    response.status = 200;
  } else if (username) {
  //  MULL.   NOT sure what username holds. ever.  oooooooooooooooooooooooooooooo

    response.status = 404;
  } else {
    response.status = 400;
  }

  return response;
}

function getOrCreateUser(url, request) {
  const username = request.body && request.body.username;
  const response = {};

  if (database.users[username]) {
    response.body = {user: database.users[username]};
    response.status = 200;
  } else if (username) {
    const user = {
      username: username,
      articleIds: [],
      commentIds: []
    };
    database.users[username] = user;

    response.body = {user: user};
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

function getArticles(url, request) {
  const response = {};
  response.status = 200;
  response.body = {
    articles: Object.keys(database.articles)
        .map(articleId => database.articles[articleId])
        .filter(article => article)
        .sort((article1, article2) => article2.id - article1.id)
  };

  return response;
}

function getArticle(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const article = database.articles[id];
  const response = {};

  if (article) {
    article.comments = article.commentIds.map(
      commentId => database.comments[commentId]);

    response.body = {article: article};
    response.status = 200;
  } else if (id) {
    response.status = 404;
  } else {
    response.status = 400;
  }

  return response;
}

function createArticle(url, request) {
  const requestArticle = request.body && request.body.article;
  const response = {};

  if (requestArticle && requestArticle.title && requestArticle.url && requestArticle.username && database.users[requestArticle.username]) {
    const article = {
    // the above evaluates true as long as all are initialized, EVEN IF undefined.    
    // BOOKMARK THIS STRUCTURE.  
      id: database.nextArticleId++,
      title: requestArticle.title,
      url: requestArticle.url,
      username: requestArticle.username,
      commentIds: [],
      upvotedBy: [],
      downvotedBy: []
    };
    database.articles[article.id] = article;
    database.users[article.username].articleIds.push(article.id);

    response.body = {article: article};
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

/////////////////////////////////
// MY SECTION: from here, down.//  
/////////////////////////////////

function createComment(url, request){
  /* I found out about the incoming request object by 
  a lot of trial and error.  The request-object was a black box to me so
  I just succesively used console.log(Object.keys(requst) to
  succesively peel away the layers of this object.     ) */
  if (!request.body){
    const response = {status: 400};
    return response;
  };
  const response = {};
  if  (
    request &&
    request.body &&
    request.body.comment &&
    request.body.comment.body && 
    request.body.comment.username && 
    request.body.comment.articleId && 
    database.users[request.body.comment.username] &&
    database.articles[request.body.comment.articleId] ){ 
    /* more than FOUR SANITY CHECKS ABOVE (request-obj has 
    ALL 3 fields AND username is for a real user ) */

      let tempComment = {
       id: database.nextCommentId, 
       body: request.body.comment.body,
       username: request.body.comment.username,
       upvotedBy: [],
       downvotedBy: [],
       articleId: request.body.comment.articleId
      };
      /* id increments.  id's from deleted comments don't recycle to here */
      /* body, username, and article id are set from properties in the request object */
      /**/

    database.comments[database.nextCommentId] = tempComment;  
    database.nextCommentId++;
    // works in the Node repl 2:45 Tuesday afternoon
    response.body = {comment: tempComment};
    console.log(` response.body.comment k e y s  at 198 ==${Object.keys(response.body.comment)}==`);
    response.status = 201;
    database.users[tempComment.username].commentIds.push(tempComment.id);
    database.articles[tempComment.articleId].commentIds.push(tempComment.id);

  } else {
    response.status = 400;
  };
  return response;
};

function updateComment(url, request){
  let response = {};
  if (0 == (Object.keys(request)) ||
      0 == (Object.keys(request.body)) ||
      0 == (Object.keys(request.body.comment))  ){
    /* To do: sanity checks should be refactored if more time.   */
    response = {status: 400};
    return response;
  };
  let urlEnd =  (url.split('/'))[2];
  let whichComment = Number(urlEnd);
  if (
    request.body.comment.body && 
    database.comments[whichComment]
    // Sanity check for edge cases: HASbody && comment-#-EXISTS
    )

    {
    let newBody = request.body.comment.body;
    database.comments[whichComment].body = newBody;
    response.status = 200;
    response.comment = newBody;

  } else if (request.body.comment.body && whichComment ) { // HASID && HASCOMMENT
    response.body = {body: request.body.comment.body};
    response.status = 404; 

  } else {
    // the only cases getting here will have either: 
    // 1)just id or 2)just comment or 3)nothing at all
    response.status = 200;
    response.body = {body: request.body.comment.body};

  };
  return response;
};

function deleteComment(url){
  let response = {};
  let urlEnd =  (url.split('/'))[2];
  let whichComment = Number(urlEnd); 
  /* Split the request string "/comments/1" into three fields.  Keep the last field. */
  /* WHICH-COMMENT is the comment # to delete */
  /* Must be cast from string to number for method LAST-INDEX-OF below*/

  if (!database.comments[whichComment]){
    console.log(`No comment [${whichComment}] in [${Object.keys(database.comments)}] `);
    response.status = 404;
    return response;
  };
  let whichArticle = database.comments[whichComment].articleId;
  /* Get the # of the article. */

  let articleCommentsArray = database.articles[whichArticle].commentIds;
  /* Get an array-of-numbers: All of that-article's comment numbers */
  /* Find where in the array your target is.*/
  /* Eliminate that target using the index you found in previous line.*/

  let target = NaN;
  target = articleCommentsArray.lastIndexOf(whichComment); // WORKED IN REPL WEDN.530PM
  articleCommentsArray.splice(target, 1); //[target];
  /* The unwanted element is at TARGET.  Remove it!  */

  let whichUser = database.comments[whichComment].username;
  /* Get the name of the user. */

  let userCommentsArray = database.users[whichUser].commentIds;
  /* Get an array-of-numbers:  All of that user's comment numbers.  */

  target = userCommentsArray.lastIndexOf(whichComment);
  userCommentsArray.splice(target, 1);
  // delete!

  database.comments[whichComment] = null;
  // a different way to delete.  seems funtionally the same as using 'delete'

  response.status = 204;
  return response;
};

function updateArticle(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const savedArticle = database.articles[id];
  const requestArticle = request.body && request.body.article;
  const response = {};

  if (!id || !requestArticle) {
    response.status = 400;
  } else if (!savedArticle) {
    response.status = 404;
  } else {
    savedArticle.title = requestArticle.title || savedArticle.title;
    savedArticle.url = requestArticle.url || savedArticle.url;
    response.body = {article: savedArticle};
    response.status = 200;
  }
  return response;
}

function deleteArticle(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const savedArticle = database.articles[id];
  const response = {};

  if (savedArticle) {
    database.articles[id] = null;
    savedArticle.commentIds.forEach(commentId => {
      const comment = database.comments[commentId];
      database.comments[commentId] = null;
      const userCommentIds = database.users[comment.username].commentIds;
      userCommentIds.splice(userCommentIds.indexOf(id), 1);
    });
    const userArticleIds = database.users[savedArticle.username].articleIds;
    userArticleIds.splice(userArticleIds.indexOf(id), 1);
    response.status = 204;
  } else {
    response.status = 400;
  }
  return response;
}

function upvoteArticle(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  let savedArticle = database.articles[id];
  const response = {};
  if (savedArticle && database.users[username]) {
    savedArticle = upvote(savedArticle, username);
    response.body = {article: savedArticle};
    response.status = 200;

  } else {
    response.status = 400;
  }

  return response;
}

function downvoteArticle(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  let savedArticle = database.articles[id];
  const response = {};

  if (savedArticle && database.users[username]) {
    savedArticle = downvote(savedArticle, username);
    response.body = {article: savedArticle};
    response.status = 200;
  } else {
    response.status = 400;
  }
  return response;
}

function upvoteComment(url, request){
  /* I used the built in up/down vote fns from Codec.          */
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  /* I assume this is edge-case checking.  I was too tired to look at it 
  for more than 10 minutes.   Seems to work so trust it.  
  That's either 'argument from authority' or 'abstraction'.           */
  let savedComment = database.comments[id];
  const response = {};

  if (savedComment && database.users[username]) {
    savedComment = upvote(savedComment, username);
    response.body = {comment: savedComment};
    response.status = 200;
  } else {
    response.status = 400;
  }
  return response;
}


function downvoteComment(url, request){
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const username = request.body && request.body.username;
  let savedComment = database.comments[id];
  const response = {};
  if (savedComment && database.users[username]) {
    savedComment = downvote(savedComment, username);
    response.body = {comment: savedComment};
    response.status = 200;
  } else {
    response.status = 400;
  }
  return response;
}


function upvote(item, username) {
  /* This is a built-by-Codecademy function.  Thank you!!                                    */
  /* First if-statement checks for and then removes any contrary voting by that person    */
  /* Second if-statement checks for and then adds upvote to the Array via push            */
  /* The coolpart is that the new, altered arrays are returned in the response body where */
  /* the hidden backend stuff will overwrite the now-obsolete arrays.                     */
  /* The concision and clarity of this Codecademy-written function are to be aspired to!     */

  if (item.downvotedBy.includes(username)) {
    item.downvotedBy.splice(item.downvotedBy.indexOf(username), 1);
  }
  if (!item.upvotedBy.includes(username)) {
    item.upvotedBy.push(username);
  }
  return item;
}

function downvote(item, username) {
  if (item.upvotedBy.includes(username)) {
    item.upvotedBy.splice(item.upvotedBy.indexOf(username), 1);
  }
  if (!item.downvotedBy.includes(username)) {
    item.downvotedBy.push(username);
  }
  return item;
}



/********************************************/
//       Write all code above this line.    //
/********************************************/


const http = require('http');
const url = require('url');

const port = process.env.PORT || 4000;
const isTestMode = process.env.IS_TEST_MODE;

const requestHandler = (request, response) => {
  const url = request.url;
  const method = request.method;
  const route = getRequestRoute(url);

  if (method === 'OPTIONS') {
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    response.writeHead(200, headers);
    return response.end();
  }

  response.setHeader('Access-Control-Allow-Origin', null);
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader(
      'Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (!routes[route] || !routes[route][method]) {
    response.statusCode = 400;
    return response.end();
  }

  if (method === 'GET' || method === 'DELETE') {
    const methodResponse = routes[route][method].call(null, url);
    !isTestMode && (typeof saveDatabase === 'function') && saveDatabase();

    response.statusCode = methodResponse.status;
    response.end(JSON.stringify(methodResponse.body) || '');
  } else {
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString());
      const jsonRequest = {body: body};
      const methodResponse = routes[route][method].call(null, url, jsonRequest);
      !isTestMode && (typeof saveDatabase === 'function') && saveDatabase();

      response.statusCode = methodResponse.status;
      response.end(JSON.stringify(methodResponse.body) || '');
    });
  }
};

const getRequestRoute = (url) => {
  const pathSegments = url.split('/').filter(segment => segment);

  if (pathSegments.length === 1) {
    return `/${pathSegments[0]}`;
  } else if (pathSegments[2] === 'upvote' || pathSegments[2] === 'downvote') {
    return `/${pathSegments[0]}/:id/${pathSegments[2]}`;
  } else if (pathSegments[0] === 'users') {
    return `/${pathSegments[0]}/:username`;
  } else {
    return `/${pathSegments[0]}/:id`;
  }
}

if (typeof loadDatabase === 'function' && !isTestMode) {
  const savedDatabase = loadDatabase();
  if (savedDatabase) {
    for (key in database) {
      database[key] = savedDatabase[key] || database[key];
    }
  }
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('Server did not start succesfully: ', err);
  }

  console.log(`Server is listening on ${port}`);
});