/********************************************/
/* This is a sandbox.                                                            */
/* So that I may see the light, I am building more than                          */
/* the assignment required.                                                      */
/* I am doing a small build here to play around without messing up the main code
The main project is a Reddit clone called The Scoop, for Codecademy 'Build Your Own APIs'
by Evan Genest twitter@mistergenest December 12, 2017*/
/*********************************************/

console.log("This is MY   createComment. \n");

// I N I T I A L I Z E 
let database = {};
database.nextCommentId = 11;
database.comments = {};
database.articles = {};
// comments
let w = {1: {body: "Why not?", username: "Trayvon", articleId: 301, id: 1, upvotedBy: [], downvotedBy: [] } };
let x = {2: {body: "LOLz.", username: "Lil Pumpkin", articleId = 301, id: 2, upvotedBy: [], downvotedBy: [] } };
let y = {3: {body: ":-)  :-) :-)", username: "Trayvon", articleId = 301, id: 3, upvotedBy: [], downvotedBy: [] } };
let z = {4: {body: "Like (NOT).", username: "FlowrChild", articleId = 303, id: 4, upvotedBy: [], downvotedBy: [] } };
// articles
let a = {1: {id: title:  url:  username:  commentIds:  upvotedBy: downvotedBy: } };
function createComment(url, request){
  // test edge cases with lots of &&.   then ELSE IFS ten lines below
  console.log(`I don't know what to do with this URL: <${url}>`);
  const comment = {
    id: database.nextCommentId++, // TODO go create this
    body: request.comment.body, // worked in IIFE in REPL
    userName: request.comment.userName,
    upvotedBy: [],
    downvotedBy: [],
    articleId: request.comment.articleId
  };
  console.log(`The object built is this: ${comment}`);
  database.comments[comment.id] = comment;  // Next action: 1) adjust these words 2) write #197
  // Notice!  
  //  database > comments > 4 > comment > body
  database.users[comment.username].commentIds.push(comment.id);
 };


const comment = {
  1: {
    body: "Be celery for Halloween!",
    username: "Jake the boy",
    articleId: 322
  }
};
createComment('/comments', comment );

// o   o   o   o   o   o   o   o   o   o

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
// o   o   o   o   o   o   o   o   o   o
