var firebaseConfig = {
    apiKey: "AIzaSyCmWRraw2UZWfp_C6p3a4QYhci5LmhtSfY",
    authDomain: "elc-academy.firebaseapp.com",
    databaseURL: "https://elc-academy-default-rtdb.firebaseio.com/",
    storageBucket: "elc-academy.appspot.com",

    scripts: {
        firebaseApp: "https://www.gstatic.com/firebasejs/3.3.0/firebase.js",
        firebaseAuth: "https://www.gstatic.com/firebasejs/ui/live/0.4/firebase-ui-auth.js",
        tinyMce: "https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.0/tinymce.min.js",
    }
};

function functionLoadScript(url) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement("script");
        script.src = url;
        script.async = false;
        script.onload = function () {
            resolve(url);
        };
        script.onerror = function () {
            reject(url);
        };
        document.body.appendChild(script);
    });
};
function datetimeFormat(e) {
    return (e = new Date(e)).getDate() + " " + "January February March April May June July August September October November December".split(" ")[e.getMonth()] + " " + pad2Digit(e.getFullYear())
};
function pad2Digit(e) {
    return ("0" + e.toString()).slice(-4)
};

function elcreativeAuthLogin() {
    firebase.auth().onAuthStateChanged(function (database) {
        if (database) {
            localStorage.setItem("auth_image", database.photoURL);
            window.location.href = authProfilePage;
        } else {
            localStorage.removeItem("auth_image");
        }
    });

    var authConfig = {
        signInSuccessUrl: false,
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        tosUrl: false,
    };

    new firebaseui.auth.AuthUI(firebase.auth()).start(
        "#firebaseui-auth-container", authConfig
    );
};

function elcreativeAuthProfile() {
    firebase.auth().onAuthStateChanged(function (database) {
        var userId;
        var userURLParam;
        var userBoolean;

        if (database) {
            document.querySelector(".elcreative_section .post_container_end .post_body").innerHTML = "<div class='auth_profile_container'><div class='auth_profile_image'></div><div class='auth_profile_info'><div class='profile_name'></div><div class='profile_meta'><div class='profile_meta_top'></div></div></div></div><div class='auth_post_container'></div><div id='dialog_edit_profile' class='elcreative_dialog' aria-hidden='true' role='listbox'><div class='dialog_container'><div class='dialog_header'><span></span><button class='button_close_dialog elcreative_ripple elcreative_button_icon small' type='button' aria-label='Close Dialog' data-toggle-trigger-off><svg width='24' height='24' viewBox='0 0 24 24'><path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/></svg></button></div><div class='dialog_content'></div><div class='dialog_footer'></div></div></div>";

            var profileContainer = document.querySelector(".auth_profile_container");
            var profilePostContainer = document.querySelector(".auth_post_container");

            var authDialog = document.getElementById("dialog_edit_profile");

            var authDialogTitle = authDialog.querySelector(".dialog_header span");
            var authDialogContent = authDialog.querySelector(".dialog_content");
            var authDialogFooter = authDialog.querySelector(".dialog_footer");

            if ((userId = ((userId = "users"), (userURLParam = {}), window.location.href.split("?").pop().split("&").map(function (url) {
                url = url.split("=");

                userURLParam[url[0]] = url[1];
            }), userId ? userURLParam[userId] || null : userURLParam))) {
                userBoolean = false;
                document.body.classList.add("auth_profile_views");

                var userData = (database = firebase.database().ref("Users/" + userId));
                userData.on("value", function (userDataItem) {
                    if (userDataItem.val()) {
                        var userDb = userDataItem.val();

                        if (userDb) {
                            if (userDb.userPhotoURL !== undefined) {
                                profileContainer.querySelector(".auth_profile_image").innerHTML = "<span class='shimmer lazyload' data-image='" + userDb.userPhotoURL + "'></span>";
                            } else {
                                profileContainer.querySelector(".auth_profile_image").innerHTML = "<span class='shimmer lazyload' data-image='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAwBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/CABEIABwAHAMBIgACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAGCAAFAgcJ/9oACAEBAAAAAOsFRa5RRGCOApZDhmNJKiQP5//EABYBAQEBAAAAAAAAAAAAAAAAAAcFBv/aAAgBAhAAAABqnJee/8QAFwEAAwEAAAAAAAAAAAAAAAAABAUGB//aAAgBAxAAAADOzI9p/8QALhAAAQIFAgMGBwEAAAAAAAAAAQIDAAQFBhEHMQgSIRAUQWF1sxMVFyIzcYGR/9oACAEBAAE/ABFyX9RLQeZbqlWp9Pcf/Gl95KFL8wD4ecMzCJplLjakutuAKSpJylQOxBjOOzis03uR7WGenu4Ts/J1Dk7o6y0p1ISEgcnQHBBz088xw4WzVLQ0epMjVwtE42Fq+Es5UyhSiUoP6B28NoKQY161d+jNj/MkyonJl54S7DalcqOcgnKjvgAHbeKvxdX1U5suN1ZuUTnIbl5dASP9BJ/pjRHjDrlSu2n0i4G5eeZn3ky6ZltsNutKUcAkD7VDO/QGMZ8THHWc6W031FPtr7NJump9ueose4ITsI//xAAkEQABAwIFBQEAAAAAAAAAAAABAgMEACEFBhESMRNBUWFx8P/aAAgBAgEBPwDAsMZnSOk65sGhP30Nf1qkMpaeU2lW4JJAI7+6ybhEN2GXnmwpRJub8fazpAYiSUGOkJ3C4HHPiv/EAB8RAAEEAgIDAAAAAAAAAAAAAAECAwQRAAUSEwYxUf/aAAgBAwEBPwDZS1xmubaeRusYX2ISpYokA18zfzn25HWlZAoes8ckuSG1Bw3Rz//Z'></span>";
                            }
                            if (userDb.userName !== undefined && userDb.userName !== "") {
                                profileContainer.querySelector(".profile_name").innerHTML = userDb.userName
                            } else {
                                profileContainer.querySelector(".profile_name").innerHTML = "Username Not Set"
                            }
                            if (userDb.userWebURL !== undefined && userDb.userWebURL !== "") {
                                profileContainer.querySelector(".profile_meta").querySelector(".profile_meta_top").innerHTML += "<span><a href='" + userDb.userWebURL + "'>View Website</a></span>"
                            }
                            if (userDb.userBio !== undefined && userDb.userBio !== "") {
                                profileContainer.querySelector(".profile_meta").innerHTML += "<div class='profile_bio'>" + userDb.userBio + "</div>"
                            }
                        }
                    } else {
                        profileContainer.querySelector(".auth_profile_image").innerHTML = "<span class='shimmer lazyload' data-image='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAwBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/CABEIABwAHAMBIgACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAGCAAFAgcJ/9oACAEBAAAAAOsFRa5RRGCOApZDhmNJKiQP5//EABYBAQEBAAAAAAAAAAAAAAAAAAcFBv/aAAgBAhAAAABqnJee/8QAFwEAAwEAAAAAAAAAAAAAAAAABAUGB//aAAgBAxAAAADOzI9p/8QALhAAAQIFAgMGBwEAAAAAAAAAAQIDAAQFBhEHMQgSIRAUQWF1sxMVFyIzcYGR/9oACAEBAAE/ABFyX9RLQeZbqlWp9Pcf/Gl95KFL8wD4ecMzCJplLjakutuAKSpJylQOxBjOOzis03uR7WGenu4Ts/J1Dk7o6y0p1ISEgcnQHBBz088xw4WzVLQ0epMjVwtE42Fq+Es5UyhSiUoP6B28NoKQY161d+jNj/MkyonJl54S7DalcqOcgnKjvgAHbeKvxdX1U5suN1ZuUTnIbl5dASP9BJ/pjRHjDrlSu2n0i4G5eeZn3ky6ZltsNutKUcAkD7VDO/QGMZ8THHWc6W031FPtr7NJump9ueose4ITsI//xAAkEQABAwIFBQEAAAAAAAAAAAABAgMEACEFBhESMRNBUWFx8P/aAAgBAgEBPwDAsMZnSOk65sGhP30Nf1qkMpaeU2lW4JJAI7+6ybhEN2GXnmwpRJub8fazpAYiSUGOkJ3C4HHPiv/EAB8RAAEEAgIDAAAAAAAAAAAAAAECAwQRAAUSEwYxUf/aAAgBAwEBPwDZS1xmubaeRusYX2ISpYokA18zfzn25HWlZAoes8ckuSG1Bw3Rz//Z'></span>";
                        profileContainer.querySelector(".profile_name").innerHTML = "User Not Found!";
                        profileContainer.querySelector(".profile_meta").querySelector(".profile_meta_top").innerHTML += "<span>This user is not found or has not set profile settings.</span>";
                        profileContainer.querySelector(".auth_profile_info").innerHTML += "<div class='profile_action'><a href='" + authProfilePage + "' class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Back'>Back</a></div>"
                    }
                });
            } else {
                var profileImageURL = database.photoURL;

                profileContainer.querySelector(".auth_profile_image").innerHTML = "<span class='shimmer lazyload' data-image='" + profileImageURL + "'></span>";
                profileContainer.querySelector(".profile_name").innerHTML = database.displayName;

                profileContainer.querySelector(".profile_meta").querySelector(".profile_meta_top").innerHTML += "<span><a href='?users=" + database.uid + "'>View Public Profile</a></span><span class='profile_website'>View Website</span>";
                profileContainer.querySelector(".auth_profile_info").innerHTML += "<div class='profile_action'><button id='button_edit_profile' class='elcreative_button elcreative_ripple button_small raised button_edit_profile' type='button' aria-controls='dialog_edit_profile' aria-expanded='false' aria-haspopup='listbox' aria-label='Edit Profile' data-toggle-class-on-target='active' data-toggle-escape='' data-toggle-outside='' data-toggle-target='#dialog_edit_profile'>Edit Profile</button><a id='button_create_post' class='elcreative_button elcreative_ripple button_small raised button_create_post' role='button' aria-label='Create Posts' href='" + authUserPostPage + "'>Create Posts</a><button id='button_logout' class='elcreative_button elcreative_ripple button_small raised button_logout' type='button' aria-label='Profile Settings'>Logout</button></div>";
                profilePostContainer.innerHTML += "<div class='elcreative_tab'><div class='tab_button_container'></div></div>";

                authDialogTitle.innerText = "Edit Profile";
                authDialogContent.innerHTML = "<div class='elcreative_tab'><div class='tab_button_container'><button id='tab_button_public_info' class='tab_button elcreative_ripple tab_button_public_info' aria-label='Public Information' type='button' data-toggle-target='#tab_panel_public_info' aria-controls='tab_panel_public_info' role='tab' data-toggle-radio-group='profile_settings' data-toggle-arrows='' data-toggle-class='' data-toggle-is-active='' aria-selected='true'>Public Info</button><button id='tab_button_private_info' class='tab_button elcreative_ripple tab_button_private_info' aria-label='Private Information' type='button' data-toggle-target='#tab_panel_private_info' aria-controls='tab_panel_private_info' role='tab' data-toggle-radio-group='profile_settings' data-toggle-arrows='' data-toggle-class='' aria-selected='false'>Private Info</button></div><div id='tab_panel_public_info' class='tab_panel_public_info tab_panel_content' role='tabpanel' aria-labelledby='tab_button_public_info' aria-hidden='true'><div class='elcreative_input'><input id='input_username' class='input_username' name='username' placeholder='' type='text'/><label for='input_username'>Public Username</label></div><div class='elcreative_input'><input id='input_website' class='input_website' name='website' placeholder='' type='url'/><label for='input_website'>Public Website URL</label></div><div class='elcreative_input'><textarea id='input_bio' class='input_bio' name='bio' placeholder='' maxlength='180'></textarea><label for='input_bio'>Public Bio</label></div></div><div id='tab_panel_private_info' class='tab_panel_private_info tab_panel_content' role='tabpanel' aria-labelledby='tab_button_private_info' aria-hidden='true'><div class='elcreative_input'><input id='input_phone' class='input_phone' name='phone' placeholder='' type='number'/><label for='input_phone'>Phone Number</label></div></div></div>";
                authDialogFooter.innerHTML = "<button id='button_save_settings' class='elcreative_button elcreative_ripple button_small raised button_save_settings' type='button' aria-label='Save Settings'>Save Settings</button>";

                var refUserData = firebase.database().ref("Users/" + database.uid);
                refUserData.once("value", function (userItem) {
                    if (userItem.val() !== undefined) {
                        userData = userItem.val();

                        if (userData) {
                            if (userData.userName !== undefined) {
                                document.getElementById("input_username").value = userData.userName;
                            }
                            if (userData.userWebURL !== undefined) {
                                document.getElementById("input_website").value = userData.userWebURL;
                                profileContainer.querySelector(".profile_meta").querySelector(".profile_meta_top .profile_website").innerHTML = "<span><a href='" + userData.userWebURL + "'>View Website</a></span>";
                            }
                            if (userData.userBio !== undefined) {
                                document.getElementById("input_bio").value = userData.userBio;
                                profileContainer.querySelector(".profile_meta").innerHTML += "<div class='profile_bio'>" + userData.userBio + "</div>";
                            }
                            if (userData.userPhone !== undefined) {
                                document.getElementById("input_phone").value = userData.userPhone;
                            }
                        }
                    };

                    document.getElementById("button_save_settings").addEventListener("click", function (userProfileData) {
                        userProfileData.preventDefault();

                        (userProfileData = {}).userName = document.getElementById("input_username").value;
                        userProfileData.userWebURL = document.getElementById("input_website").value;
                        userProfileData.userBio = document.getElementById("input_bio").value;
                        userProfileData.userPhotoURL = profileImageURL;
                        userProfileData.userPhone = document.getElementById("input_phone").value;

                        functionSnackbar("Saving Profile…", 6000);

                        refUserData.update(userProfileData).then(function () {
                            location.reload();
                        }).catch(function (error) {
                            functionSnackbar(error, 6000);
                        }), false;
                    })
                });

                var userPost = database = firebase.database().ref().child("Posts/" + database.uid);
                userPost.once("value", function (userPostItem) {
                    var userPostContent = "";
                    userPostItem.forEach(function (postId) {
                        postDb = postId.val();

                        userPostContent = "<div class='post_item_container'><div class='post_item_start'><a href='" + authUserPostPage + "?viewpost=" + postId.getKey() + "' class='post_title' title='" + postDb.postTitle + "'>" + postDb.postTitle + "</a><div class='post_meta'><span>" + postDb.postAuthor + "</span>&nbsp;-&nbsp;<span>" + datetimeFormat(postDb.postUpdated) + "</span>&nbsp;|&nbsp;<a href='" + authUserPostPage + "?editpost=" + postId.getKey() + "'>Update/Edit</a></div></div><div class='post_item_end'><div class='post_status'>" + postDb.postStatus + "</div></div></div>" + userPostContent
                    });
                    if (userPostContent !== "") {
                        profilePostContainer.querySelector(".tab_button_container").innerHTML += "<button id='tab_button_user_posts' class='tab_button elcreative_ripple tab_button_user_posts' aria-label='Posts' type='button' data-toggle-target='#tab_panel_user_posts' aria-controls='tab_panel_user_posts' role='tab' data-toggle-radio-group='tab_posts' data-toggle-arrows='' data-toggle-class='' aria-selected='true' data-toggle-is-active=''>Posts</button>";
                        profilePostContainer.querySelector(".elcreative_tab").innerHTML += "<div id='tab_panel_user_posts' class='tab_panel_user_posts tab_panel_content' role='tabpanel' aria-labelledby='tab_button_user_posts' aria-hidden='true'>" + userPostContent + "</div>";
                    };



                    easyToggleState();
                })

                easyToggleState();

                document.getElementById("button_logout").onclick = function () {
                    firebase.auth().signOut();
                    localStorage.removeItem("auth_image")
                };
            }
        } else {
            window.location.href = authLoginPage;
        }
    });
};

function elcreativeAuthPost() {
    firebase.auth().onAuthStateChanged(function (database) {
        var userId;
        var userURLParam;
        var userBoolean;


        if (database) {
            if ((userId = ((userId = "viewpost"), (userURLParam = {}), window.location.href.split("?").pop().split("&").map(function (url) {
                url = url.split("=");
                userURLParam[url[0]] = url[1];
            }), userId ? userURLParam[userId] || null : userURLParam))) {
                userBoolean = false;

                refPost = firebase.database().ref("Posts/" + database.uid).child(userId);
                refPost.on("value", function (postItem) {
                    var postData = postItem.val();
                    if (postData) {
                        document.querySelector(".item_page .elcreative_section .post_container_start .post_header_start").innerHTML = "<nav class='post_breadcrumb'>" + postData.postLabel + "</nav><h2 class='post_title'>" + postData.postTitle + "</h2><div class='post_snippet'><em>" + postData.postDescription + "</em></div>";
                        document.querySelector(".elcreative_section .post_container_end .post_body").innerHTML = "<div class='elcreative_alert alert_outline'><a class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Edit Post' href='" + authUserPostPage + "?editpost=" + postItem.getKey() + "'>Edit Post</a><a href='" + authProfilePage + "' class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Back'>Back</a></div>" + postData.postContent + "<div class='elcreative_alert alert_outline'><a class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Edit Post' href='" + authUserPostPage + "?editpost=" + postItem.getKey() + "'>Edit Post</a><a href='" + authProfilePage + "' class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Back'>Back</a></div>";

                        document.querySelectorAll('pre code').forEach((el) => { hljs.highlightElement(el) });
                    } else {
                        window.location.href = authProfilePage;
                    }
                });
            } else if ((userId = ((userId = "editpost"), (userURLParam = {}), window.location.href.split("?").pop().split("&").map(function (url) {
                url = url.split("=");
                userURLParam[url[0]] = url[1];
            }), userId ? userURLParam[userId] || null : userURLParam))) {
                userBoolean = false;
                document.body.classList.add("auth_user_profile");

                document.querySelector(".elcreative_section .post_container_end .post_body").innerHTML = "<form id='auth_post_wrapper'><div class='elcreative_input'><input id='input_post_title' required class='input_post_title' name='postTitle' placeholder='' type='text'/><label for='input_post_title'>Post Title</label></div><div class='elcreative_input'><input id='input_post_label' required class='input_post_label' name='postLabel' placeholder='' type='text'/><label for='input_post_label'>Post Labels</label><small>Post labels separated by commas.</small></div><div class='elcreative_input'><textarea id='input_post_description' class='input_post_description' name='postDescription' placeholder='' maxlength='150'></textarea><label for='input_post_description'>Post Description</label><small>Post descriptions must not exceed 150 characters.</small></div><div class='elcreative_input'><textarea id='input_post_content' class='visibility_hidden input_post_content' name='postContent' placeholder=''></textarea></div></form>      <div class='elcreative_alert alert_outline'><button id='button_save_post' class='elcreative_button elcreative_ripple button_small raised button_save_post' type='button' aria-label='Save Post'>Save Post Changes</button><button id='button_delete_post' class='elcreative_button elcreative_ripple button_small raised button_delete_post' type='button' aria-label='Delete Post'>Delete Post</button><a href='" + authProfilePage + "' class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Back'>Cancel</a></div>";

                var authPostWrapper = document.getElementById("auth_post_wrapper");

                var refPost = firebase.database().ref("Posts/" + database.uid).child(userId);
                refPost.on("value", function (postItem) {
                    var postData = postItem.val();
                    if (postData) {
                        document.getElementById("input_post_title").value = postData.postTitle;
                        document.getElementById("input_post_description").value = postData.postDescription;
                        document.getElementById("input_post_label").value = postData.postLabel;
                        document.getElementById("input_post_content").value = postData.postContent;

                        tinymce.init({
                            selector: "#input_post_content",
                            height: 600,
                            branding: false,
                            menubar: "file edit view insert format tools table",
                            plugins: "link image preview toc codesample table wordcount code lists insertdatetime emoticons visualblocks",
                            toolbar: "formatselect | bold italic underline strikethrough superscript subscript blockquote | link image |  alignleft aligncenter alignright alignjustify bullist numlist | table toc | codesample preview insertdatetime emoticons visualblocks code",
                            toc_class: "elcTOC",
                            toc_depth: 6,
                            content_style: 'body { font-family: "Segoe UI"}',
                            codesample_languages: [{
                                text: "Command Line",
                                value: "command hljs hl hljs"
                            }, {
                                text: "CSS",
                                value: "css hljs hl css"
                            }, {
                                text: "C",
                                value: "c hljs hl c"
                            }, {
                                text: "C++",
                                value: "cpp hljs hl cpp"
                            }, {
                                text: "HTML/XML",
                                value: "html hljs hl html xml"
                            }, {
                                text: "Java",
                                value: "java hljs hl java"
                            }, {
                                text: "JavaScript",
                                value: "javascript hljs hl javascript"
                            }, {
                                text: "JSON",
                                value: "json hljs hl json"
                            }, {
                                text: "Markdown",
                                value: "markdown hljs hl markdown"
                            }, {
                                text: "PHP",
                                value: "php hljs hl php"
                            }, {
                                text: "Python",
                                value: "python hljs hl python"
                            }, {
                                text: "TypeScript",
                                value: "typescript hljs hl typescript"
                            }],
                            insertdatetime_formats: ["Updated: %A, %d %B %Y"],
                            rel_list: [{
                                title: "Internal Link",
                                value: ""
                            }, {
                                title: "External Link",
                                value: "noopener noreferer nofollow"
                            }],
                            extended_valid_elements: "img[src|loading=lazy|alt|title|width|height|align|onmouseover|onmouseout|name]",
                            init_instance_callback: function (ed) {

                            }
                        });

                        document.querySelector(".button_save_post").addEventListener("click", function (postContent) {
                            postContent.preventDefault();

                            document.getElementById("button_save_post").remove();
                            functionSnackbar("Updating…", 5000);

                            var postResult = {
                                '"': '"',
                                mcetoc: "elcreative_toc"
                            };
                            postContent = tinymce.get("input_post_content").getContent().replace(/"|mcetoc/g, function (x) {
                                return postResult[x];
                            });
                            var postContentUnescaped = unescape(postContent);

                            return refPost.transaction(function (data) {
                                return (data = data || {}).postTitle = document.getElementById("input_post_title").value,
                                    data.postDescription = document.getElementById("input_post_description").value,
                                    data.postLabel = document.getElementById("input_post_label").value,
                                    data.postContent = postContentUnescaped,
                                    data.postUpdated = (new Date).getTime(),
                                    data;
                            }).then(function () {
                                window.location.href = "?viewpost=" + postItem.getKey();
                            }).catch(function (error) {
                                console.log(error);
                            }), false;


                        });

                        document.getElementById("button_delete_post").addEventListener("click", function () {
                            if (confirm('Are you sure to delete this post?')) {
                                refPost.remove();
                                window.location.href = authProfilePage;
                            }
                        })
                    } else {
                        window.location.href = authProfilePage;
                    }
                });
            } else {
                document.body.classList.add("auth_user_profile");
                document.querySelector(".elcreative_section .post_container_end .post_body").innerHTML = "<form id='auth_post_wrapper'><div class='elcreative_input'><input id='input_post_title' required class='input_post_title' name='postTitle' placeholder='' type='text'/><label for='input_post_title'>Post Title</label></div><div class='elcreative_input'><input id='input_post_label' required class='input_post_label' name='postLabel' placeholder='' type='text'/><label for='input_post_label'>Post Labels</label><small>Post labels separated by commas.</small></div><div class='elcreative_input'><textarea id='input_post_description' class='input_post_description' name='postDescription' placeholder='' maxlength='150'></textarea><label for='input_post_description'>Post Description</label><small>Post descriptions must not exceed 150 characters.</small></div><div class='elcreative_input'><textarea id='input_post_content' class='visibility_hidden input_post_content' name='postContent' placeholder=''></textarea></div></form>      <div class='elcreative_alert alert_outline'><button id='button_save_post' class='elcreative_button elcreative_ripple button_small raised button_save_post' type='button' aria-label='Save Post'>Save Post</button><a href='" + authProfilePage + "' class='elcreative_button elcreative_ripple button_small raised' type='button' aria-label='Back'>Cancel</a></div>";

                tinymce.init({
                    selector: "#input_post_content",
                    height: 600,
                    branding: false,
                    menubar: "file edit view insert format tools table",
                    plugins: "link image preview toc codesample table wordcount code lists insertdatetime emoticons visualblocks",
                    toolbar: "formatselect | bold italic underline strikethrough superscript subscript blockquote | link image |  alignleft aligncenter alignright alignjustify bullist numlist | table toc | codesample preview insertdatetime emoticons visualblocks code",
                    toc_class: "elcTOC",
                    toc_depth: 6,
                    content_style: 'body { font-family: "Segoe UI"}',
                    codesample_languages: [{
                        text: "Command Line",
                        value: "command hljs hl hljs"
                    }, {
                        text: "CSS",
                        value: "css hljs hl css"
                    }, {
                        text: "C",
                        value: "c hljs hl c"
                    }, {
                        text: "C++",
                        value: "cpp hljs hl cpp"
                    }, {
                        text: "HTML/XML",
                        value: "html hljs hl html xml"
                    }, {
                        text: "Java",
                        value: "java hljs hl java"
                    }, {
                        text: "JavaScript",
                        value: "javascript hljs hl javascript"
                    }, {
                        text: "JSON",
                        value: "json hljs hl json"
                    }, {
                        text: "Markdown",
                        value: "markdown hljs hl markdown"
                    }, {
                        text: "PHP",
                        value: "php hljs hl php"
                    }, {
                        text: "Python",
                        value: "python hljs hl python"
                    }, {
                        text: "TypeScript",
                        value: "typescript hljs hl typescript"
                    }],
                    insertdatetime_formats: ["Updated: %A, %d %B %Y"],
                    rel_list: [{
                        title: "Internal Link",
                        value: ""
                    }, {
                        title: "External Link",
                        value: "noopener noreferer nofollow"
                    }],
                    extended_valid_elements: "img[src|loading=lazy|alt|title|width|height|align|onmouseover|onmouseout|name]",
                    init_instance_callback: function (ed) {

                    }
                });

                var authPostWrapper = document.getElementById("auth_post_wrapper");

                document.querySelector(".button_save_post").addEventListener("click", function (postContent) {
                    postContent.preventDefault();

                    var requiredInput = true;
                    authPostWrapper.querySelectorAll("[required]").forEach(function (i) {
                        if (!requiredInput) return;
                        if (!i.value) {
                            requiredInput = false;
                            functionSnackbar("Please fill in the required fields.", 5000);
                        }
                    });

                    if (requiredInput) {
                        functionSnackbar("Uploading…", 5000);
                        document.getElementById("button_save_post").remove();

                        var postResult = {
                            '"': '"',
                            mcetoc: "elcreative_toc"
                        };
                        postContent = tinymce.get("input_post_content").getContent().replace(/"|mcetoc/g, function (x) {
                            return postResult[x];
                        });
                        var postContentUnescaped = unescape(postContent);

                        (postContent = {}).postTitle = document.getElementById("input_post_title").value;
                        postContent.postDescription = document.getElementById("input_post_description").value;
                        postContent.postLabel = document.getElementById("input_post_label").value;
                        postContent.postAuthor = database.displayName;
                        postContent.postCreated = (new Date).getTime();
                        postContent.postUpdated = postContent.postCreated;
                        postContent.postContent = postContentUnescaped;
                        postContent.postStatus = "Pending";

                        var userPost = firebase.database().ref().child("Posts/" + database.uid);
                        userPost.push(postContent).then(function (postId) {
                            window.location.href = "?viewpost=" + postId.getKey();
                        }).catch(function (error) {
                            console.log(error);
                        }), false;
                    }
                })
            }
        } else {
            window.location.href = authLoginPage;
        }
    });
};

if (typeof authLoginPage !== "undefined") {
    var authImage = document.getElementById('button_auth_profile');
    var authProfile = localStorage.getItem("auth_image");
    if (authProfile !== null) {
        authImage.setAttribute('href', '/p/' + authProfilePage);
        document.querySelector(".auth_profile_image").setAttribute('style', 'background-image:url(' + localStorage.getItem("auth_image") + ')')
    } else {
        authImage.setAttribute('href', '/p/' + authLoginPage);
        document.querySelector(".auth_profile_image").setAttribute('style', 'background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAwBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/CABEIABwAHAMBIgACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAGCAAFAgcJ/9oACAEBAAAAAOsFRa5RRGCOApZDhmNJKiQP5//EABYBAQEBAAAAAAAAAAAAAAAAAAcFBv/aAAgBAhAAAABqnJee/8QAFwEAAwEAAAAAAAAAAAAAAAAABAUGB//aAAgBAxAAAADOzI9p/8QALhAAAQIFAgMGBwEAAAAAAAAAAQIDAAQFBhEHMQgSIRAUQWF1sxMVFyIzcYGR/9oACAEBAAE/ABFyX9RLQeZbqlWp9Pcf/Gl95KFL8wD4ecMzCJplLjakutuAKSpJylQOxBjOOzis03uR7WGenu4Ts/J1Dk7o6y0p1ISEgcnQHBBz088xw4WzVLQ0epMjVwtE42Fq+Es5UyhSiUoP6B28NoKQY161d+jNj/MkyonJl54S7DalcqOcgnKjvgAHbeKvxdX1U5suN1ZuUTnIbl5dASP9BJ/pjRHjDrlSu2n0i4G5eeZn3ky6ZltsNutKUcAkD7VDO/QGMZ8THHWc6W031FPtr7NJump9ueose4ITsI//xAAkEQABAwIFBQEAAAAAAAAAAAABAgMEACEFBhESMRNBUWFx8P/aAAgBAgEBPwDAsMZnSOk65sGhP30Nf1qkMpaeU2lW4JJAI7+6ybhEN2GXnmwpRJub8fazpAYiSUGOkJ3C4HHPiv/EAB8RAAEEAgIDAAAAAAAAAAAAAAECAwQRAAUSEwYxUf/aAAgBAwEBPwDZS1xmubaeRusYX2ISpYokA18zfzn25HWlZAoes8ckuSG1Bw3Rz//Z)')
    };




    if (location.href.indexOf(authLoginPage) !== -1) {
        functionSnackbar("Please Wait…", 6000);
        document.body.classList.add("auth_page_login");
        document.querySelector(".elcreative_section .post_container_end .post_body").innerHTML = "<div id='firebaseui-auth-container'></div>";

        let authScriptBundle = [
            firebaseConfig.scripts.firebaseApp,
            firebaseConfig.scripts.firebaseAuth,
        ];
        authScriptBundle.forEach(function (url) {
            let elementCreateScript = document.createElement("script");
            elementCreateScript.src = url;
            elementCreateScript.async = false;
            document.getElementsByTagName("head")[0].appendChild(elementCreateScript);
        });

        let elementScriptPromisess = [];
        authScriptBundle.forEach(function (url) {
            elementScriptPromisess.push(functionLoadScript(url));
        });

        Promise.all(elementScriptPromisess).then(function () {
            firebase.initializeApp(firebaseConfig);
            elcreativeAuthLogin();
        }).catch(function (error) {
            functionSnackbar(error + " failed to load!", 6000);
        });
    };



    if (location.href.indexOf(authProfilePage) !== -1) {
        functionSnackbar("Please Wait…", 6000);

        let authScriptBundle = [firebaseConfig.scripts.firebaseApp];
        authScriptBundle.forEach(function (url) {
            let elementCreateScript = document.createElement("script");
            elementCreateScript.src = url;
            elementCreateScript.async = false;
            document.getElementsByTagName("head")[0].appendChild(elementCreateScript);
        });

        let elementScriptPromisess = [];
        authScriptBundle.forEach(function (url) {
            elementScriptPromisess.push(functionLoadScript(url));
        });

        Promise.all(elementScriptPromisess).then(function () {
            firebase.initializeApp(firebaseConfig);
            document.body.classList.add("auth_user_profile");
            elcreativeAuthProfile();
        }).catch(function (error) {
            functionSnackbar(error + " failed to load!", 6000);
        });
    };




    if (location.href.indexOf(authUserPostPage) !== -1) {
        functionSnackbar("Please Wait…", 6000);

        let authScriptBundle = [firebaseConfig.scripts.firebaseApp, firebaseConfig.scripts.tinyMce];
        authScriptBundle.forEach(function (url) {
            let elementCreateScript = document.createElement("script");
            elementCreateScript.src = url;
            elementCreateScript.async = false;
            document.getElementsByTagName("head")[0].appendChild(elementCreateScript);
        });

        let elementScriptPromisess = [];
        authScriptBundle.forEach(function (url) {
            elementScriptPromisess.push(functionLoadScript(url));
        });

        Promise.all(elementScriptPromisess).then(function () {
            firebase.initializeApp(firebaseConfig);
            elcreativeAuthPost();
        }).catch(function (error) {
            functionSnackbar(error + " failed to load!", 6000);
        });
    };

};
