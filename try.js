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
class Quip {
	constructor(body, username, articleId) {
		this._body = body;
		this._username = username;
		this._articleId = articleId;
	}

	get body() {
		return this._body;
	}

	set body(s) {
		this._body = s;
	}
};


let nextCommentId = temp1;
let tempComment = new Quip("Minnesota, not Wisconsin.", "Jesse Ventura", nextCommentId);
