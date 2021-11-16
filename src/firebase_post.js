firebase.auth().onAuthStateChanged(function (database) {
    if (database) {
        materiaConfig.elements.postBody.innerHTML = "<div class='auth_post_container'><div class='elcreative_tab'><div class='tab_button_container'></div></div></div><div id='dialog_edit_profile' class='elcreative_dialog' aria-hidden='true' role='listbox'><div class='dialog_container'><div class='dialog_header'><span></span><button class='button_close_dialog elcreative_ripple elcreative_button_icon small' type='button' aria-label='Close Dialog' data-toggle-trigger-off><svg width='24' height='24' viewBox='0 0 24 24'><path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/></svg></button></div><div class='dialog_content'></div><div class='dialog_footer'></div></div></div>";

        var profilePostContainer = document.querySelector(".auth_post_container");

        var userPostData = firebase.database().ref("Posts");
        userPostData.once("value", function (userDataItem) {
            var userPostContent = "";
            userDataItem.forEach(function (postItem) {
                postItem.forEach(function (snapshot) {
                    var val = snapshot.val();
                    var postTitle = val.postTitle;
                    var postAuthor = val.postAuthor;
                    var postUpdated = val.postUpdated;
                    var postStatus = val.postStatus;
                    var postKey = snapshot.getKey();

                    userPostContent = "<div class='post_item_container'><div class='post_item_start'><a href='" + authUserPostPage + "?viewpost=" + postKey + "' class='post_title' title='" + postTitle + "'>" + postTitle + "</a><div class='post_meta'><span>" + postAuthor + "</span>&nbsp;-&nbsp;<span>" + datetimeFormat(postUpdated) + "</span>&nbsp;|&nbsp;<a href='" + authUserPostPage + "?editpost=" + postKey + "'>Update/Edit</a></div></div><div class='post_item_end'><div class='post_status'>" + postStatus + "</div></div></div>" + userPostContent

                });
            });
            profilePostContainer.querySelector(".tab_button_container").innerHTML += "<button id='tab_button_user_posts' class='tab_button elcreative_ripple tab_button_user_posts' aria-label='Posts' type='button' data-toggle-target='#tab_panel_user_posts' aria-controls='tab_panel_user_posts' role='tab' data-toggle-radio-group='tab_posts' data-toggle-arrows='' data-toggle-class='' aria-selected='true' data-toggle-is-active=''>Posts</button>";
            profilePostContainer.querySelector(".elcreative_tab").innerHTML += "<div id='tab_panel_user_posts' class='tab_panel_user_posts tab_panel_content' role='tabpanel' aria-labelledby='tab_button_user_posts' aria-hidden='true'>" + userPostContent + "</div>";

            easyToggleState()
        });
    } else {
        window.location.href = authLoginPage;
    }
})