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
let w = {body: "Why not?", username: "Trayvon", articleId: 301 , id: 1, upvotedBy: [], downvotedBy: [] } ;
let x = {body: "LOLz.", username: "Lil Pumpkin", articleId: 301, id: 2, upvotedBy: [], downvotedBy: []  };
let y = {body: ":-)  :-) :-)", username: "Trayvon", articleId: 301, id: 3, upvotedBy: [], downvotedBy: [] };
let z = {body: "Like (NOT).", username: "FlowrChild", articleId: 303, id: 4, upvotedBy: [], downvotedBy: [] };
// articles
let a = {id: 1, title: "Horse Gossip", url: "https://medium.com/the-mission/11-tweaks-to-your-morning-routine-will-make-your-entire-day-more-productive-938f7c1d066a" , username: "Trayvon", commentIds: [], upvotedBy: [], downvotedBy: [] };
let b = {id: 2, title: "Farmer Wisdom" , url: "http://www.governorbluejeans.com/about_mike_mccabe_for_governor" , username: "NickAtNite", commentIds: [] , upvotedBy: [], downvotedBy: []};
let c = {id: 3, title: "Big Ten Roundup" , url: "http://www.magnetmagazine.com/2011/05/17/sloans-chris-murphy-believes-in-the-descendents/" , username: "pajamaGame82", commentIds: [] , upvotedBy: [], downvotedBy: []};


// put data in the database
database.comments[1] = w;
database.comments[2] = x;
database.comments[3] = y;
database.comments[4] = z;
database.articles[1] = a;
database.articles[2] = b;
database.articles[3] = c;
database.users = {"Trayvon": {articleIds: [], commentIds: [] } , "Lil Pumpkin": {articleIds: [], commentIds: [] }, "NickAtNite": {articleIds: [], commentIds: [] }, "Rosebowl64": {articleIds: [], commentIds: [] }, "pajamaGame82": {articleIds: [], commentIds: [] }, "Dan H.": {articleIds: [], commentIds: [] } };

let anjisArticleObj = { title: "Lil Wayne?", url: "http://www.magnetmagazine.com/2008/12/26/have-you-ever-actually-listened-to-lil-wayne/" , username: "Dan H." };
let carlsCommentObj = {comment: {body: "Worst movie ever.  Said everyone.", userName: "Rosebowl64", articleId: 301}};

function createComment(url, request){
  // test edge cases with lots of &&.   then ELSE IFS ten lines below
  console.log(`I don't know what to do with this URL: <${url}>`);
  const response = {};
  if  (
        Object.keys(database.users).includes(request.comment.userName)  && 
        Object.keys(database.articles).includes(request.comment.articleId) &&
        request.comment.body 
      ){
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
    database.users[comment.userName].commentIds.push(comment.id);
    // works in the repl 2:45 Tuesday afternoon
    // todo - - return a object called RESPONSE with properties: BODY & STATUS
    response.body = {comment: comment};
    response.status = 808;
  } else {
    response.status = 404;
  };
  return response;
};
 

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

createComment('/comments', carlsCommentObj );
createArticle('/articles', anjisArticleObj);

