var fs = require('fs');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf-8');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvParse = function(csvFile){
  var friendList = [];
  var lines = csvFile.split("\n");
  var headerline = lines[0].split(",");
  for (var x = 1; x < lines.length; x++) {
    var newline = lines[x].split(",");
    var friend = {};
    for (var i = 0; i < headerline.length; i++) {
      friend[headerline[i]] = newline[i];
    }
    friendList.push(friend);
  }
  return friendList;
}

var contactList = csvParse(csvFile);

var client = tumblr.createClient({
  consumer_key: 'Kzj7ZM7fkIOBF2YmswCd6wMmr5rAQQpVjPoWgM0eH1xb5UxAsS',
  consumer_secret: 'nY28L2B3iSeKb6ycBJIwIAT89iIoAr3TbLpoSFTaN96UtE6yuQ',
  token: 'wY6hpfxtrEBeriS9xx5vBJY9YAFvO2m7qYzRjRTfaQ9Gyqyyqh',
  token_secret: 'jr9V3eQnatEZaKqTfVgE99retxcHUlDORibZ99DFzqx1Ze4t3G'
});

// check to see if the post is within 7 days of the current date
var isRecent = function(postDate) {
  var oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (((new Date) - postDate) < oneWeek) {
    return true;
  }
  else {
    return false;
  }
}

client.posts('merkathcou.tumblr.com', function(err, blog){
  latestPosts = [];
  for (var i = 0; i < blog['posts'].length; i++) {
    var postDate = new Date(blog['posts'][i].date);
    if (isRecent(postDate)) {
      latestPosts.push(blog['posts'][i]);
    }
  }
  for (var i = 0; i < contactList.length; i++) {
      copyTemplate = emailTemplate;
      newObj = { firstName: contactList[i]['firstName'],  
                   numMonthsSinceContact: contactList[i]['numMonthsSinceContact'],
                   latestPosts: latestPosts
                  };
      var customizedTemplate = ejs.render(copyTemplate, newObj);
      console.log(customizedTemplate);
    }
})