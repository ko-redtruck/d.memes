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

function validateLink() {
  return true;
}

// Functions ---------------------------

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


// create a post
function createPost(post, dataTyp) {
  dataTyp = "post" || 0;
  // Commit post entry to my source chain
  // body + title required to post
  var hash = commit(dataTyp,post);
  // On the DHT, put a link from my hash to the hash of the new post
  var me = App.Agent.Hash;
  var link = commit("post_links",{
    Links: [
      {Base: me,Link: hash, Tag: "post"}
    ]
  });
  return hash;
}

function createComment(comment) {
  var hash = createPost(comment,"comment");
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
// TODO: tags

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
  var posts = queryPosts(params.limit);
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
