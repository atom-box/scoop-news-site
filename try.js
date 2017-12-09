/* 
PROJECT V1.0  THE SCOOP (a Reddit clone)
THIS FILE: tryCommenting
started December 9, 2017 By Evan Genest
https://github.com/atom-box/funkyDrummer    
Twitter@MisterGenest 

DESCRIPTION:  The Scoop has nine files, written in javascript and node.js.   
The school, Codecademy wrote the longer files, including the HTML and the functionality for 
much of the website. 
** 
My job was to figure out the existing data logic and extend their program to 
allow users to comment
on news stories. 
**  
This program was completed for the Codecademy course "Build Your Own API's"
Written by Evan Genest! December 9, 2017 */


/* initialize SAMPLE DATA */

let temp1 = 33;

/*
function Quip(body, username, articleId) {
	this._body = body,
	this._username = username, 
	this._articleId = articleId,
	this.body = function(){return this._body;},
	this.username = function(){return this._username},
	this.articleId = function(){return this._articleId},
	this.upVotedBy = [],
	this.downVotedBy = []
}
*/
let nextCommentId = [310021];

class Quip {
	constructor(body, username, articleId) {
		this._id = this.getId();
		this._upVotedBy = [];
		this._downVotedBy = [] ;

		this._body = body;
		this._username = username;
		this._articleId = articleId;
	}


	getId(){
	/* Return new ID, 
	pop old from stack, 
	restock if empty */
 		const tempId = nextCommentId.shift();
 		if (nextCommentId[0]){
 		/* Stack is not empty */ 
 			return tempId;
 		} else {
 			nextCommentId.unshift(tempId + 1);
 			return tempId;
 		}
	}

	get body() {
		return this._body;
	}

	set body(s) {
		this._body = s;
	}
 
};

console.log(`(1) Next Id available is: ${nextCommentId} ` )
let tempComment = new Quip("Minnesota, not Wisconsin.", "Jesse Ventura", nextCommentId);
console.log(`(2) Next Id available is: ${nextCommentId} ` )
