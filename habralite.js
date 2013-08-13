/* Adds css rules to specified selector */
function addCSSRule(selector, rules, sheet) {
    sheet = sheet || document.styleSheets[0];
    if (sheet.insertRule) {
        sheet.insertRule(selector + '{' + rules + '}');
    } else {
        sheet.addRule(selector, rules);
    }
}
/* Returns human-friendly declension of provided numbers */
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
/* Return chidren nodes of an element with a specified class name */
function getChildrenByClassName(element, className) {
    var children = [];
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == className) {
            children.push(element.childNodes[i]);
        }
    }
    return children;
}
/* Hide single nodeList */
function hideNode (nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.style.display = 'none';
    }
}
/* Hide single link with a matching word in url */
function hideLinks(links, rule) {
for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.href.indexOf(rule) != -1) {link.style.display = 'none'};
    }
}
/* Hide nodeLists provided as array */
function hideNodes (nodes) {
    if( Object.prototype.toString.call( nodes ) === '[object Array]' ) {
        for (var i = 0; i < nodes.length; i++) {
            hideNode(nodes[i]);
        }
    }
    else {
        hideNode(nodes);
    }
}
/* Toggle visibility of provided elements */
function toggleElements (elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.style.display = (element.style.display != 'none' ? 'none' : 'block');
    }
}
/* Create a button ( span > a ) */
function createBtn (className, value, btnClass, containerClass, onclick) {
    className = className || '';
    value = value || '';
    onclick = onclick || function (event) {};

    var newContainer = document.createElement('span');
        newContainer.className = containerClass;
    var newBtn = document.createElement('a');
        newBtn.className = className + btnClass;
        newBtn.appendChild(document.createTextNode(value));
        newBtn.href="#";
        newBtn.onclick = onclick;
        newContainer.appendChild(newBtn);
    return newContainer;
}
/* Replies button event handler */
function commentsBtnClick (event) {
    event.preventDefault();
    var btn = event.currentTarget;
    var comments = btn.parentElement.parentElement.parentElement.parentElement.querySelectorAll('.reply_comments');
    toggleElements(comments);
}
/* Private message link event handler */
function clickPm(event) { 
        event.preventDefault();
        var username = event.target.parentElement.parentElement.parentElement.querySelector('a.username').innerText;
        window.location.pathname = '/conversations/' + username;
}

/* C-style Main() =) */
(function(){
    /* Set of {NodeList} elements to operate with */
    var allReplies = document.querySelectorAll('.reply_comments');
    var sidebarImgs = document.querySelectorAll('.sidebar_right > .banner_300x500, .sidebar_right > #htmlblock_placeholder');
    var contentImgs = document.querySelectorAll('.content img, .message img');
    var userBanned = document.querySelectorAll('.author_banned');
    var infobars = document.querySelectorAll('.to_chidren');
    
    /* Set of {hideLinks} elements to operate with */
    var banners = document.querySelectorAll('body > a');
    
    /* Hide all links matching specified rule (adriver banners etc.) */
    hideLinks(banners, 'adriver');

    /* Hide all images and nested replies by default */
    hideNodes([allReplies, sidebarImgs, contentImgs, userBanned]);
    
    /* Add button to toggle images visibility */
    var newImgBtn = createBtn('habraimage', '◄ Показать изображения', ' button', 'buttons', function (event) {event.preventDefault(); toggleElements(contentImgs);});
    document.querySelectorAll('.main_menu')[0].appendChild(newImgBtn);
    
    /* Add private message link */
    for (i = 0; i < infobars.length; i++) {
    var pmLink = createBtn('pmlink', '', ' reply_link', 'container', clickPm);
    infobars[i].appendChild(pmLink);
    }
    
    /* Make buton fixed */
    addCSSRule('.habraimage', 'position:fixed; right: 6%; z-index: 1;');
    
    /* Style for send private message link */
    addCSSRule('.pmlink', 'float: left; margin-top: 0.65em; height: 1em; width: 2em; background: url(/images/user_message.gif) no-repeat; background-size: 2em;');

    /* Margin-bottom for buttons block */
    addCSSRule('.reply', 'margin-bottom: 1em;');
    
    /* White list to always show images */
    addCSSRule('.spoiler_text img', 'display: block !important;');

    /* Add buttons to toggle comments visibility */
    var comments = document.querySelectorAll('.comments_list > .comment_item'),
        comment, combody;
    for (var i = 0; i < comments.length; i++) {
        comment = comments[i];
        var replies = comment.querySelectorAll('.reply_comments .comment_body');
        if (replies.length > 0) {
            combody = getChildrenByClassName(comment, 'comment_body')[0];
            replylink = getChildrenByClassName(combody, 'reply')[0];
            if (combody) {
                var newBtn = createBtn('hidereplies', replies.length + declOfNum(replies.length, [' ответ', ' ответа', ' ответов']), ' button', 'buttons', commentsBtnClick);
                replylink.appendChild(newBtn);
            }
        }
    }
})();
