var userpanel = document.querySelector('.userpanel');
var userpanelTop = document.querySelector('.userpanel > .top');

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
    var userBlock = document.querySelector('.top > .username').innerText;
    var karmaCharge = document.createElement('a');
    karmaCharge.href = 'http://habrahabr.ru/users/' + userBlock;
    karmaCharge.className = 'count karma';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var counter = xmlhttp.responseXML.querySelector('karma').firstChild;
            var rating = xmlhttp.responseXML.querySelector('rating').firstChild;
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

/* Get user's info from XML on click */
function usersKarma(varInfo) {
    var info = varInfo;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('text/xml');
    var username = info.querySelector('.username').innerText;
    var userKarma = document.createElement('a');
    userKarma.className = 'users_karma';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var counter = xmlhttp.responseXML.querySelector('karma').firstChild;
            var rating = xmlhttp.responseXML.querySelector('rating').firstChild;
            userKarma.innerText = 'карма ';
            userKarma.appendChild(counter);
            userKarma.innerText += ', рейтинг ';
            userKarma.appendChild(rating);
            info.insertBefore(userKarma, info.lastElementChild);
        }
    }
    xmlhttp.open("GET", '/api/profile/' + username, true);
    xmlhttp.send();
}

/* Show tracker updates */
function trackerUpdates() {
    var trackerLink = document.querySelector('.userpanel > .top > a.count');
    if (trackerLink) {
        trackerLink.href = '#tracker_updates';
        var updates = document.createElement('ul');
        updates.className = 'updates';
        updates.style.display = 'none';
        userpanel.appendChild(updates);
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
}

/* Control local storage values */
var setLocStor = function (name, hh) {
    if (!localStorage) return;
    localStorage['HabraLite_' + name] = JSON.stringify({
        h: hh
    });
},
    getLocStor = function (name) {
        return (JSON.parse(localStorage && localStorage['HabraLite_' + name] || '{}')).h;
    },
    removeLocStor = function (name) {
        localStorage.removeItem('HabraLite_' + name);
    };

/* Settings */
function scriptSettings() {
    function createInput(typeName, name, valueName, textLabel) {
        var listElement = document.createElement('li');
        var inputElement = document.createElement('input');
        inputElement.type = typeName;
        inputElement.className = 'settings';
        inputElement.name = name;
        inputElement.value = valueName;
        listElement.appendChild(inputElement);
        listElement.innerHTML += textLabel;
        return listElement;
    }

    var settingsBlock = document.createElement('ul');
    settingsBlock.className = 'hl-settings updates';
    settingsBlock.style.display = 'none';
    var settingsImages = createInput('checkbox', 'images', 'disabled', ' отключить скрытие изображений');
    var settingsComments = createInput('checkbox', 'comments', 'disabled', ' отключить группировку ответов');
    var settingsKarma = createInput('checkbox', 'karma', 'disabled', ' отключить карму юзера по клику');
    settingsBlock.appendChild(settingsImages);
    settingsBlock.appendChild(settingsComments);
    settingsBlock.appendChild(settingsKarma);
    userpanel.appendChild(settingsBlock);

    var settingsBtn = document.createElement('a');
    settingsBtn.className = 'btn-settings';
    settingsBtn.href = '#habralite-settings';
    userpanelTop.appendChild(settingsBtn);
    settingsBtn.onclick = function (event) {
        event.preventDefault();
        settingsBlock.style.display = (settingsBlock.style.display != 'none' ? 'none' : 'block');
    }

    var checkboxes = document.querySelectorAll('input.settings');
    for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];
        var locStorValue = getLocStor(checkbox.name);
        if (locStorValue === 'enabled') {
            checkbox.checked = true;
        }
        if (locStorValue === 'disabled') {
            checkbox.checked === false;
        }
        checkbox.onclick = function (event) {
            if (this.checked) {
                this.value = 'enabled';
            } else {
                this.value = 'disabled';
            }
            setLocStor(this.name, this.value);
        };
    }

}

/* Main */
(function () {

    /* Set of elements to operate with */
    var allReplies = document.querySelectorAll('.reply_comments');
    var contentImgs = document.querySelectorAll('.content img, .message img');
    var userBanned = document.querySelectorAll('.author_banned');
    var infobars = document.querySelectorAll('.to_chidren');
    var imagesOption = getLocStor('images');
    var commentsOption = getLocStor('comments');
    var karmaOption = getLocStor('karma');
    var infoPanels = document.querySelectorAll('.info');

    if (imagesOption !== 'enabled') {

        /* Hide all images by default */
        hideNodes(contentImgs);

        /* Add button to toggle images visibility */
        var newImgBtn = createBtn('habraimage', '◄ Показать изображения', ' button', 'buttons', function (event) {
            event.preventDefault();
            toggleElements(contentImgs);
        });
        document.querySelector('.main_menu').appendChild(newImgBtn);

    }

    if (commentsOption !== 'enabled') {

        /* Hide all nested replies by default */
        hideNodes([allReplies, userBanned]);

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
    }

    if (karmaOption !== 'enabled') {

        /* Show user's karma on his info panel click  */
        for (var i = 0; i < infoPanels.length; i++) {
            var infoPanel = infoPanels[i];
            infoPanel.onclick = function (event) {
                event.preventDefault();
                usersKarma(this);
            }
        }
    }

    /* Add private message link */
    for (var i = 0; i < infobars.length; i++) {
        var pmLink = createBtn('pmlink', '', ' reply_link', 'container', clickPm);
        infobars[i].appendChild(pmLink);
    }

    /* Define userpanel */
    var userpanelBottom = document.querySelector('.userpanel > .bottom');
    var karmaDescription = document.querySelector('.charge');
    var companyHeader = document.querySelector('#header_mouse_activity');

    if (companyHeader == null) {
        if (userpanelBottom != null) {
            userpanelTop.innerHTML += userpanelBottom.innerHTML;
            userpanel.removeChild(userpanelBottom);
            userpanel.removeChild(karmaDescription);
            karmaCounter();
            trackerUpdates();
            scriptSettings();
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
    addCSSRule('.userpanel .top', 'width: 98em; position: fixed;  z-index: 1; background-image: -webkit-linear-gradient(top, #d3e2f0, #9bb9d3);' + '\r\n' +
        'background-image: -moz-linear-gradient(top, #d3e2f0, #9bb9d3); background-image: linear-gradient(top, #d3e2f0, #9bb9d3); top: 0; padding: 1em;' + '\r\n' +
        'border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; opacity: 0.8;');
    addCSSRule('.userpanel a', 'font-size: 14px; text-decoration: none; text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8);');
    addCSSRule('a.count', 'background: rgba(255,255,255, 0.5); padding: 3px; border-radius: 4px;');
    addCSSRule('#header .userpanel a.username', 'margin-right: 1em !important;');
    addCSSRule('.search', 'margin-top: -2em;');
    addCSSRule('.search form', 'position: fixed; z-index: 2;');
    addCSSRule('.daily_best_posts', 'margin-top: 2em;');
    addCSSRule('ul.updates', 'position: fixed; width: 34em; min-height: 4em; max-height: 40em; height: auto !important; overflow-y: scroll; margin-top: 3.5em;' + '\r\n' +
        'padding: 1em 1em 0px; background: #d3e2f0; border: 1px solid rgba(155, 185, 211, 0.5); border-radius: 6px; z-index: 3;');
    addCSSRule('ul.updates li', 'margin-bottom: 1em;');
    addCSSRule('ul.hl-settings', 'font-size: 14px; color: #999; text-decoration: none; text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8); width: 18em !important;' + '\r\n' +
        'margin-top: 3em !important; margin-left: 41.5em;');
    addCSSRule('span.new', 'color: #2289E2;');
    addCSSRule('li.post_title, li.event_type, li.mention_type', 'margin-bottom: 1em;');
    addCSSRule('.btn-settings', 'vertical-align: text-bottom; display:inline-block; width:16px;height:16px;' + '\r\n' +
        'background: url(/images/sidebar/new_companies.btn.png) no-repeat 0px 0px;cursor: pointer;');
    addCSSRule('.users_karma', 'display: inline-block; text-decoration: none; margin-left: 1em; padding: 2px; font-size: 11px;' + '\r\n' +
        'background: rgba(211, 226, 240, 0.5);  border-radius: 4px;text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8);');

    /* White list to always show images */
    addCSSRule('.spoiler_text img', 'display: block !important;');

    /* Black list to always hide images */
    addCSSRule('.post_inner_banner', 'display: none !important;');
    addCSSRule('.banner_special', 'display: none !important;');
    addCSSRule('.sidebar_right > .banner_300x500', 'display: none !important;');
    addCSSRule('.sidebar_right > #htmlblock_placeholder', 'display: none !important;');

})();