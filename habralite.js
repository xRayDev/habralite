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

function hideNode(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.style.display = 'none';
    }
}
/* Hide nodeLists provided as array */

function hideNodes(nodes) {
    if (Object.prototype.toString.call(nodes) === '[object Array]') {
        for (var i = 0; i < nodes.length; i++) {
            hideNode(nodes[i]);
        }
    } else {
        hideNode(nodes);
    }
}
/* Toggle visibility of provided elements */

function toggleElements(elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.style.display = (element.style.display != 'none' ? 'none' : 'block');
    }
}
/* Create a button ( span > a ) */

function createBtn(className, value, btnClass, containerClass, onclick) {
    className = className || '';
    value = value || '';
    onclick = onclick || function (event) {};

    var newContainer = document.createElement('span');
    newContainer.className = containerClass;
    var newBtn = document.createElement('a');
    newBtn.className = className + btnClass;
    newBtn.appendChild(document.createTextNode(value));
    newBtn.href = "#";
    newBtn.onclick = onclick;
    newContainer.appendChild(newBtn);
    return newContainer;
}
/* Replies button event handler */

function commentsBtnClick(event) {
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
/* Get user info from XML */

function karmaCounter() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('text/xml');
    var userBlock = document.querySelectorAll('.top > .username')[0].innerText;
    var userpanelTop = document.querySelectorAll('.userpanel > .top')[0];
    var karmaCharge = document.createElement('a');
    karmaCharge.href = 'http://habrahabr.ru/users/' + userBlock;
    karmaCharge.className = 'count karma';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var counter = xmlhttp.responseXML.querySelectorAll('karma')[0].firstChild;
            var rating = xmlhttp.responseXML.querySelectorAll('rating')[0].firstChild;
            karmaCharge.innerText = 'карма ';
            karmaCharge.appendChild(counter);
            karmaCharge.innerText += ', рейтинг ';
            karmaCharge.appendChild(rating);
            userpanelTop.insertBefore(karmaCharge, userpanelTop.firstChild.nextSibling.nextSibling);
        }
    }
    xmlhttp.open("GET", '/api/profile/' + userBlock, true);
    xmlhttp.send();
}
/* Show tracker updates */

function trackerUpdates() {
    var userpanelTop = document.querySelectorAll('.userpanel')[0];
    var trackerLink = document.querySelectorAll('.userpanel > .top > a.count')[0];
    trackerLink.href = '#tracker_updates';
    var updates = document.createElement('ul');
    updates.className = 'updates';
    updates.style.display = 'none';
    userpanelTop.appendChild(updates);
    trackerLink.onclick = function (event) {
        event.preventDefault();
        updates.style.display = (updates.style.display != 'none' ? 'none' : 'block');
    };

    function getUpdates(url, getUrl) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = 'document';
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var tracks = xmlhttp.responseXML.querySelectorAll(url);
                for (i = 0; i < tracks.length; i++) {
                    var post = tracks[i];
                    post.removeChild(post.firstElementChild);
                    updates.appendChild(post);
                    post.outerHTML = post.outerHTML.replace(/td/g, "li");
                }
            }
        }
        xmlhttp.open("GET", getUrl, true);
        xmlhttp.send();
    }

    getUpdates('tr.new > td.event_type', '/tracker/subscribers/');
    getUpdates('tr.new > td.mention_type', '/tracker/mentions/');

    (function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = 'document';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var tracks = xmlhttp.responseXML.querySelectorAll('tr.new > td.post_title');
                var commentCounts = xmlhttp.responseXML.querySelectorAll('tr.new > td.comment_count');
                for (i = 0; i < tracks.length; i++) {
                    var track = tracks[i];
                    var commentCount = commentCounts[i].firstChild.nextSibling;
                    commentCount.className = 'count';
                    track.appendChild(commentCount);
                    updates.appendChild(track);
                    track.outerHTML = track.outerHTML.replace(/td/g, "li");

                }
            }
        };
        xmlhttp.open("GET", '/tracker/', true);
        xmlhttp.send();
    })();

}

/* Main */
(function () {
    /* Set of {NodeList} elements to operate with */
    var allReplies = document.querySelectorAll('.reply_comments');
    var sidebarImgs = document.querySelectorAll('.sidebar_right > .banner_300x500, .sidebar_right > #htmlblock_placeholder');
    var contentImgs = document.querySelectorAll('.content img, .message img');
    var userBanned = document.querySelectorAll('.author_banned');
    var infobars = document.querySelectorAll('.to_chidren');

    /* Hide all images and nested replies by default */
    hideNodes([allReplies, sidebarImgs, contentImgs, userBanned]);

    /* Add button to toggle images visibility */
    var newImgBtn = createBtn('habraimage', '◄ Показать изображения', ' button', 'buttons', function (event) {
        event.preventDefault();
        toggleElements(contentImgs);
    });
    document.querySelectorAll('.main_menu')[0].appendChild(newImgBtn);

    /* Add buttons to toggle comments visibility */
    var comments = document.querySelectorAll('.comments_list > .comment_item'),
        comment, combody;
    for (var i = 0; i < comments.length; i++) {
        comment = comments[i];
        var replies = comment.querySelectorAll('.reply_comments .comment_body');
        if (replies.length > 0) {
            combody = getChildrenByClassName(comment, 'comment_body')[0];
            replylink = getChildrenByClassName(combody, 'reply')[0] || getChildrenByClassName(combody, 'author_banned')[0];
            if (combody) {
                var newBtn = createBtn('hidereplies', replies.length + declOfNum(replies.length, [' ответ', ' ответа', ' ответов']), ' button', 'buttons', commentsBtnClick);
                replylink.appendChild(newBtn);
            }
        }
    }

    /* Add private message link */
    for (i = 0; i < infobars.length; i++) {
        var pmLink = createBtn('pmlink', '', ' reply_link', 'container', clickPm);
        infobars[i].appendChild(pmLink);
    }

    /* Define userpanel */
    var userpanel = document.querySelectorAll('.userpanel')[0];
    var userpanelTop = document.querySelectorAll('.userpanel > .top')[0];
    var userpanelBottom = document.querySelectorAll('.userpanel > .bottom')[0];
    var karmaDescription = document.querySelectorAll('.charge')[0];
    var companyHeader = document.querySelectorAll('#header_mouse_activity')[0];

    if (companyHeader == null) {
        if (userpanelBottom != null) {
            userpanelTop.innerHTML += userpanelBottom.innerHTML;
            userpanel.removeChild(userpanelBottom);
            userpanel.removeChild(karmaDescription);
            karmaCounter();
            trackerUpdates();
        };
        if (userpanelTop == null) {
            var top = document.createElement('div');
            top.className = 'top';
            top.innerHTML = userpanel.innerHTML;
            userpanel.innerHTML = null;
            userpanel.appendChild(top);
        };
    }

    /* Make button fixed */
    addCSSRule('.habraimage', 'position:fixed; right: 6%; z-index: 2;');

    /* Style for send private message link */
    addCSSRule('.pmlink', 'float: left; margin-top: 0.65em; height: 1em; width: 2em; background: url(/images/user_message.gif) no-repeat; background-size: 2em;');

    /* Margin-bottom for buttons block */
    addCSSRule('.reply', 'margin-bottom: 1em;');

    /* User panel styling */
    addCSSRule('.logo', 'display: none !important;');
    addCSSRule('.main_menu', 'margin-top: 1em;');
    addCSSRule('.userpanel .top', 'width: 98em; position: fixed;  z-index: 1; background-image: -webkit-linear-gradient(top, #d3e2f0, #9bb9d3); background-image: -moz-linear-gradient(top, #d3e2f0, #9bb9d3); background-image: linear-gradient(top, #d3e2f0, #9bb9d3); top: 0; padding: 1em; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; opacity: 0.8;');
    addCSSRule('.userpanel a', 'font-size: 14px; text-decoration: none; text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8);');
    addCSSRule('a.count', ' background: rgba(255,255,255, 0.5); padding: 3px; border-radius: 4px;');
    addCSSRule('#header .userpanel a.username', 'margin-right: 1em !important;');
    addCSSRule('.search', 'margin-top: -2em;');
    addCSSRule('.search form', 'position: fixed; z-index: 2;');
    addCSSRule('.daily_best_posts', 'margin-top: 2em;');
    addCSSRule('ul.updates', 'position: fixed; width: 34em; min-height: 4em; max-height: 40em; height: auto !important; overflow-y: scroll;  margin-top: 3.5em; padding: 1em 1em 0px; background: #d3e2f0; border: 1px solid rgba(155, 185, 211, 0.5); border-radius: 6px; z-index: 3;');
    addCSSRule('span.new', 'color: #2289E2;');
    addCSSRule('li.post_title, li.event_type, li.mention_type', 'margin-bottom: 1em;');

    /* White list to always show images */
    addCSSRule('.spoiler_text img', 'display: block !important;');

    /* Black list to always hide images */
    addCSSRule('.post_inner_banner', 'display: none !important;');
    addCSSRule('.banner_special', 'display: none !important;');

})();