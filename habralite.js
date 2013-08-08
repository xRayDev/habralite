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
/* Create a button ( span.buttons > a.button ) */
function createBtn (className, value, onclick) {
    className = className || 'button';
    value = value || 'Button';
    onclick = onclick || function (event) {};

    var newContainer = document.createElement('span');
        newContainer.className = 'buttons';
    var newBtn = document.createElement('a');
        newBtn.className = className + ' button';
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
    var comments = btn.parentNode.parentNode.parentNode.parentNode.querySelectorAll('.reply_comments');
    toggleElements(comments);
}

/* C-style Main() =) */
(function(){
    /* Sets of {NodeList} elements to operate with */
    var allReplies = document.querySelectorAll('.reply_comments');
    var sidebarImgs = document.querySelectorAll('.sidebar_right > .banner_300x500, .sidebar_right > #htmlblock_placeholder');
    var contentImgs = document.querySelectorAll('.content img, .message img');

    /* Hide all images and nested replies by default */
    hideNodes([allReplies, sidebarImgs, contentImgs]);

    /* Add button to toggle images visibility */
    var newImgBtn = createBtn('habraimage', '◄ Показать изображения', function (event) {event.preventDefault(); toggleElements(contentImgs);});
    document.querySelectorAll('.main_menu')[0].appendChild(newImgBtn);
    /* Make buton fixed */
    addCSSRule('.habraimage', 'position:fixed; right: 6%; z-index: 1;');

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
                var newBtn = createBtn('hidereplies', replies.length + declOfNum(replies.length, [' ответ', ' ответа', ' ответов']), commentsBtnClick);
                replylink.appendChild(newBtn);
            }
        }
    }
})();
