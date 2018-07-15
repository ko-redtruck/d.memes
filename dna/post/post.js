// Functions: Validation ---------------------------
function genesis() {
  return true
}

function validateCommit() {
  return true
}

function validatePut() {
  return true
}

// validates before updating a post(hash)
function validateMod() {
  return true;
}

// validation before deletion
function validateDel() {
  return true;
}

// Are there types of tags that you need special permission to add links?
// Examples:
//   - Only Bob should be able to make Bob a "follower" of Alice
//   - Only Bob should be able to list Alice in his people he is "following"


function validateLink() {
  return true;
}

// Functions ---------------------------

function appInfo(string) {
  // string is useless
  return JSON.stringify({"HC version": HC.Version, "Dna hash": App.DNA.Hash, "Agent Hash": App.Agent.Hash});
};

function readPost(postHash) {
  // get the post with its hash
  var post = get(postHash, { GetMask: HC.GetMask.Entry + HC.GetMask.EntryType })
  if (post["EntryType"]==="post"){
    return JSON.stringify(post["Entry"]);
  }
  else {
    return "hash is not of type post";
  }
}

function setUsername(username) {
  //creates a username or changes it if it already exists

  // check if Agent Hash has already a username linked to it
  var usernames = getLinks(App.Agent.Hash,"username", {Load: true});
  if(usernames.length === 1){
    // check if the new username is the same as the old one
    if(usernames[0].Entry.anchorText==username){
      // stop the function
      debug("new username is equal to old username");
      return false;
    }
    // remove the existing user name and set a new one
    console.log("removing existing user name")
    remove(usernames[0].Hash,"removing old username anchor");
  }

  // check if someone else has this username
  if(usernameExists(username)=="true"){
      debug("someone else has already set this username!")
      return false;
  }
  // create an anchor for the username
  var anchorHash = anchor("username",username);
  // link the AgentHash to the anchor and the anchor to the AgentHash
  commit("username_links",{Links: [{Base: anchorHash, Link: App.Agent.Hash, Tag: "agentHash"},{Base: App.Agent.Hash, Link: anchorHash, Tag: "username"}]});
  // return message that the operation was successful
  debug("username successfully set")
  return true;
}

function checkForUsername() {
  var links = getLinks(App.Agent.Hash,"username");
  //debug(links)
  if (links.length>0){
    return true;
  }
  else{
    return false;
  }
}

function usernameExists(username) {
  return anchorExists("username",username)
}


// create a post
function createPost(params) {
  // is true when the post is not a comment
  if (params.dataTyp==null){
    params.dataTyp= "post"
  }

  // Commit post entry to my source chain
  // body + title required to post
  var postHash = commit(params.dataTyp,params.post);

  // On the DHT, put a link from my hash to the hash of the new post
  var me = App.Agent.Hash;
  var postLink = commit("post_links",{
    Links: [
      {Base: me,Link: postHash, Tag: "post"}
    ]
  });

  // create Hashtags
  if (params.post.tags == ""){
    var hashtags = ["all"];
  }
  else{
    var hashtags = params.post.tags.split(",");
    // under #all all posts are listed
    hashtags.push("all");
  }

  var linkType = params.dataTyp;

  hashtags.forEach(function(tag){
    // find the hash of the anchor (tag) or create it if it did not exist
    var anchorHash = anchor("tags",tag);
    // link the post to the anchors (tags)
    var anchorLink = commit("post_hashtag_link",{
      Links: [
        {Base: anchorHash , Link: postHash, Tag: linkType}
      ]
    });
  })

  // show all tags that exist
  debug(anchors("tags"))
  // show all posts for the tag funny
  debug(getLinks(anchor("tags","funny"),""))
  return postHash;
}

function createComment(comment) {
  var hash = createPost({"post":comment,"dataTyp":"comment"});
  var link = commit("comment_link",{
    Links: [
      {Base: comment.parentHash, Link: hash, Tag: "post"}
    ]
  });
  return hash;
}

// remove a post
function removePost(oldHash) {
  var hash = remove(oldHash,"post removed")
  return hash
}

//update a post --> params: oldHash + (updated) post
function updatePost(params) {
  var hash = update("post", params.post, params.oldHash);
  return hash;
}

//upvote a post
// creates a link from me to the updvoted post and from the post to me
function upvotePost(postHash) {
  // TODO: upvotePost() should not only commit two links but instead commit a upvote (json) like STEEM
  var me = App.Agent.Hash;
  var link1 = commit("upvote_links", {Links:[{Base:me, Link: postHash, Tag: "upvote"}]})
  var link2 = commit('upvote_links', {
      Links: [{ Base: postHash, Link: me, Tag: 'upvote' }]
    });
  if(getUpvotes(postHash)[0]>0){
    // NOTE: changed from true to posthash to fix error in view.js
    return postHash;
  }
  else{
    return false;
  }
}

function getUpvotes(postHash) {
  var upvotes = getLinks(postHash,"upvote")
  var array = new Array(2);
  array[0] = upvotes.length;
  array[1] = postHash;
  return array;
}

// only looks through your local source chain
// limit: how many posts you want to query for
function queryPosts(limit) {
  var result = query({
  Return: {
    Entries: true,
    Hashes: true
  },
  Constrain: {
    EntryTypes: ["post"],
    Count: limit
  }
})
  return JSON.stringify(result);
}

function getPosts(params) {
  //get all posts linked to the hashtag "#all"
  var linkEntries = getLinks(anchor("tags","all"),"post");
  var posts = new Array();
  linkEntries.forEach(function (linkEntry) {
    posts.push({"Hash":linkEntry.Hash,"Entry":get(linkEntry.Hash)});
  });
  // do some sorting
  return posts;
}

function getComments(parentHash) {
  var comment_links = getLinks(parentHash,"post", {Load: true});
  if (comment_links == 0){
    return 0;
  }
  else{
    return JSON.stringify(comment_links);
  }

}

function anchor(anchorType, anchorText) {
  return call('anchors', 'anchor', {
    anchorType: anchorType,
    anchorText: anchorText
  }).replace(/"/g, '');
}

function anchors(anchorType) {
  return JSON.parse(call('anchors', 'anchors', anchorType));
}

function anchorExists(anchorType, anchorText) {
  return call('anchors', 'exists', {
    anchorType: anchorType,
    anchorText: anchorText
  });
}
