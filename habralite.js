(function () {

    initialHide();

    function initialHide() {

        function hideReply() {
            var replies = document.querySelectorAll('.reply_comments');
            for (var r = 0; r < replies.length; r++) {
                var reply = replies[r];
                reply.style.display = 'none';
            }
        }
        hideReply();

        function hideImages() {
            var images = document.querySelectorAll(".content img, .message img, .sidebar_right > .banner_300x500, .sidebar_right > #htmlblock_placeholder");
            for (var m = 0; m < images.length; m++) {
                var image = images[m];
                image.style.display = "none";
            }
        }
        hideImages();

    }

    imgPosts();

    function imgPosts() {

        var imgs = document.querySelectorAll(".content img, .message img");
        var button = document.createElement("input");
        button.type = "button";
        button.className = "habraimage";
        button.value = "◄ Показать изображения";

        document.querySelectorAll(".main_menu")[0].appendChild(button);



        button.onclick = function () {

            for (var x = 0; x < imgs.length; x++) {
                var img = imgs[x];
                img.style.display = (img.style.display != 'none' ? 'none' : 'block');
            }

        };

        function addCSSRule(sheet, selector, rules) {
            if (sheet.insertRule) {
                sheet.insertRule(selector + "{" + rules + "}");
            } else {
                sheet.addRule(selector, rules);
            }

        }


        addCSSRule(document.styleSheets[0], ".habraimage", "position:fixed; right: 6%; z-index: 1; height: 2.45em; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; background-image: -webkit-linear-gradient(top, #eeeeee, #e1e1e1); background-image: linear-gradient(top, #eeeeee, #e1e1e1); background-image: -moz-linear-gradient(top, #eeeeee, #e1e1e1); background-repeat: repeat-x; border: 1px solid #d9d8d8; border-color: #d9d8d8 #cccbcb #aeaeae; text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1), 0px 1px 7px rgba(177, 180, 199, 1); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1), 0px 1px 7px rgba(177, 180, 199, 1); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1), 0px 1px 7px rgba(177, 180, 199, 1);");

        addCSSRule(document.styleSheets[0], ".habraimage:hover", "background-color: #fcfcfc !important; background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fcfcfc), to(#e8e8e8));background-image: -webkit-linear-gradient(top, #fcfcfc, #e8e8e8); background-image: linear-gradient(top, #fcfcfc, #e8e8e8); background-image: -moz-linear-gradient(top, #fcfcfc, #e8e8e8);background-repeat: repeat-x; text-decoration: none;");
    }


    hideReplies();

    function hideReplies() {

        function getChildrenByClassName(el, className) {
            var children = [];
            for (var i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].className == className) {
                    children.push(el.childNodes[i]);
                }
            }
            return children;
        }

        function addBtn() {
            var comments = document.querySelectorAll(".comments_list > .comment_item"),
                comment, combody;

            function declOfNum(number, titles) {
                cases = [2, 0, 1, 1, 1, 2];
                return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
            }

            for (var i = 0; i < comments.length; i++) {
                comment = comments[i];
                var replies = comment.querySelectorAll('.reply_comments .comment_body');
                if (replies.length > 0) {
                    combody = getChildrenByClassName(comment, 'comment_body')[0];
                    replylink = getChildrenByClassName(combody, 'reply')[0];
                    if (combody) {
                        var btn = document.createElement("input");
                        btn.type = "button";
                        btn.className = "hidereplies";
                        btn.value = replies.length + declOfNum(replies.length, [' ответ', ' ответа', ' ответов']);
                        replylink.appendChild(btn);
                    }
                }
            }

            function addCSSRule(sheet, selector, rules) {
                if (sheet.insertRule) {
                    sheet.insertRule(selector + "{" + rules + "}");
                } else {
                    sheet.addRule(selector, rules);
                }

            }

            addCSSRule(document.styleSheets[0], ".hidereplies", "height: 2em; border-radius: 6px; background-image: -webkit-linear-gradient(top, #eeeeee, #e1e1e1); background-image: -o-linear-gradient(top, #eeeeee, #e1e1e1); background-image: linear-gradient(top, #eeeeee, #e1e1e1); background-image: -moz-linear-gradient(top, #eeeeee, #e1e1e1); background-repeat: repeat-x; border: 1px solid #d9d8d8; border-color: #d9d8d8 #cccbcb #aeaeae; text-shadow: 0 1px 0px rgba(255, 255, 255, 0.8); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1);");

            addCSSRule(document.styleSheets[0], ".hidereplies:hover", "background-color: #fcfcfc; background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fcfcfc), to(#e8e8e8));background-image: -webkit-linear-gradient(top, #fcfcfc, #e8e8e8); background-image: linear-gradient(top, #fcfcfc, #e8e8e8); background-image: -moz-linear-gradient(top, #fcfcfc, #e8e8e8);background-repeat: repeat-x; text-decoration: none;");

            addCSSRule(document.styleSheets[0], ".hidereplies:active", "-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2); background: #e1e1e1 !important; border: 1px solid #a4a7ac; border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25); border-color: #a4a7ac #d2d3d4 #e1e1e1; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);");
            
            addCSSRule(document.styleSheets[0], ".reply", "margin-bottom: 1em;");

        }
        addBtn();


        function hideR() {
            var buttons = document.querySelectorAll(".hidereplies");

            for (a = 0; a < buttons.length; a++) {
                var btn = buttons[a];
                btn.onclick = function (event) {
                    var btn = event.currentTarget;
                    var comments = btn.parentNode.parentNode.parentNode.querySelectorAll(".reply_comments");
                    for (var y = 0; y < comments.length; y++) {
                        var reply = comments[y];
                        reply.style.display = (reply.style.display != 'none' ? 'none' : 'block');
                    }
                };
            }
        }
        hideR();


    }

})();