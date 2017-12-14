// database is let instead of const to allow us to modify it in test.js
let database = {
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
  console.log("46 oooo  oooo  oooo  oooo  "); /*********/

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
  console.log("102 OoOOOoOoOOOOOooooOOooo - - - " + database.articles + "OoOOOoOoOOOOOooooOOooo - - 102" ); /*********/
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
  console.log("115 OoOOOoOoOOOOOooooOOooo - - -  oOOOoOoOOOOOooooOOooo - - 115" ); /*********/

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
  console.log(" line 137 ---- created   article     oOOOoOoOOOOOoOoOOOOOooooOOooo 137" ); /*********/

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
////////////////////////////////// 12:11 SATURDAY
    database.articles[article.id] = article;
    database.users[article.username].articleIds.push(article.id);

    response.body = {article: article};
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

/////////////
// MY SECTION.   

function createComment(url, request){
  console.log(Object.keys(request.body));
  console.log(`Next id at 178 is: ${database.nextCommentId}`)
  const response = {};
  console.log(` c o m m e n t s  at 179 ==${Object.keys(database.comments)}==`);
  if  (request.body.comment.body && 
    request.body.comment.username && 
    request.body.comment.articleId && 
    database.users[request.body.comment.username] &&
    database.articles[request.body.comment.articleId] ){ 
    /* FOUR SANITY CHECKS ABOVE (request-obj has ALL 3 fields AND username is for a real user ) */

      let tempComment = {
       id: database.nextCommentId, 
       body: request.body.comment.body,
       username: request.body.comment.username,
       upvotedBy: [],
       downvotedBy: [],
       articleId: request.body.comment.articleId
    };

    database.comments[database.nextCommentId] = tempComment;  // Next action: 1) adjust these words 2) write #197
    database.nextCommentId++;
    console.log(`Next id at 203 is: ${database.nextCommentId}`)

    // works in the repl 2:45 Tuesday afternoon
    response.body = {comment: tempComment};
    console.log(` response.body.comment k e y s  at 198 ==${Object.keys(response.body.comment)}==`);
    response.status = 201;
    console.log(` response.body.comment keys  at 213 ==${Object.keys(response.body.comment)}==`);
    console.log(` article id at 214 is ==${response.body.comment.articleId}==`);
    console.log(`Gonna try to push ARTICLES here: ${Object.keys(database.articles[tempComment.articleId])}`);
    database.users[tempComment.username].commentIds.push(tempComment.id);
    database.articles[tempComment.articleId].commentIds.push(tempComment.id);

  } else {
    console.log(" o  --  o      Line 198           I BAILED !   !   !")
    response.status = 400;
  };
  return response;
};

function updateComment(url, request){
  let urlEnd =  (url.split('/'))[2];
  let whichComment = Number(urlEnd);
  console.log(`Seems like we want to look for comment <${urlEnd}>`);
  console.log(`In number terms that is comment <${whichComment}>`);
  let newBody = request.comment;
  console.log(`Gonna print this ${newBody}`);
};

function deleteComment(url){
  let urlEnd =  (url.split('/'))[2];
  console.log(`Seems like we want to look for comment <${urlEnd}>`)
  let whichComment = Number(urlEnd);
  console.log(`In number terms that is comment <${whichComment}>`)

  /* Split the request string "/comments/1" into three fields.  Keep the last field. */
  /* WHICH-COMMENT is the comment # to delete */
  /* Must be cast from string to number for method LAST-INDEX-OF below*/

  let whichArticle = database.comments[whichComment].articleId;
  /* Get the # of the article. */
  console.log("$$$$$$$     $$$$$$$     $$$$$$$     ");

  let articleCommentsArray = database.articles[whichArticle].commentIds;
  /* Get an array-of-numbers: All of that-article's comment numbers */
  /* Find where in the array your target is.*/
  /* Eliminate that target using the index you found in previous line.*/

  let target = NaN;
  target = articleCommentsArray.lastIndexOf(whichComment); // WORKED IN REPL WEDN.530PM
  console.log(`Remove this item [${whichComment}] from this article [${whichArticle}] at this position [${target}]`);
  console.log(`Article comments before: ${articleCommentsArray} and length is: ${articleCommentsArray.length}`);
  articleCommentsArray.splice(target, 1); //[target];
  /* The unwanted element is at TARGET.  Remove it!  */
  console.log(`Article comments after: ${articleCommentsArray} and length is: ${articleCommentsArray.length}`);

  let whichUser = database.comments[whichComment].username;
  /* Get the name of the user. */

  let userCommentsArray = database.users[whichUser].commentIds;
  /* Get an array-of-numbers:  All of that user's comment numbers.  */

  console.log(`User comments before: ${userCommentsArray} and length is: ${userCommentsArray.length}`);
  target = userCommentsArray.lastIndexOf(whichComment);
  console.log(`Remove this item [${whichComment}] from this user [${whichUser}] at this position [${target}]`);

  //delete userCommentsArray[target];
  //delete database.comments[whichComment];
  userCommentsArray.splice(target, 1); //[target];
  console.log(`User comments after: ${userCommentsArray} and length is: ${userCommentsArray.length}`);
  console.log(`database.comments[${target}] = ${database.comments[whichComment]} BEFORE`);
  database.comments[whichComment] = null;
  console.log(`database.comments[${target}] = ${database.comments[whichComment]} AFTER`);
  console.log("_________2_____4______9__________________");

  // wtf is this?    database.users[tempComment.username].commentIds.push(tempComment.id);
  // wtf is this?    database.articles[tempComment.articleId].commentIds.push(tempComment.id);
  let response = {};
  response.status = 204;
  return response;
};
/////////////

 /////////////

function updateArticle(url, request) {

  console.log("213 oooo  oooo  oooo  oooo  "); /*********/

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
  console.log("236 oooo  oooo  oooo  oooo  "); /*********/
 
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
  console.log("Ring the alarm");

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
  console.log("Ring the alarm");

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
  // hubba hubba
}

function downvoteComment(url, request){
  // hubba hubba
}




function upvote(item, username) {
  console.log("Ring the upvote");

  if (item.downvotedBy.includes(username)) {
    item.downvotedBy.splice(item.downvotedBy.indexOf(username), 1);
  }
  if (!item.upvotedBy.includes(username)) {
    item.upvotedBy.push(username);
  }
  return item;
}

function downvote(item, username) {
  console.log("Ring the downvote");

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