var config = {
	apiKey: 'AIzaSyCmWRraw2UZWfp_C6p3a4QYhci5LmhtSfY',
	authDomain: 'elc-academy.firebaseapp.com',
	databaseURL: 'https://elc-academy-default-rtdb.firebaseio.com/',
	storageBucket: 'elc-academy.appspot.com',
};
firebase.initializeApp(config);

function login() {
	// Check login status
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// if already logged in
			window.location.href = 'my-profile.html';
		}
	});

	//init Login UI
	// FirebaseUI config.
	var uiConfig = {
		signInSuccessUrl: false,
		signInOptions: [
			// comment unused sign-in method
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			// firebase.auth.TwitterAuthProvider.PROVIDER_ID,
			// firebase.auth.GithubAuthProvider.PROVIDER_ID,
			// firebase.auth.EmailAuthProvider.PROVIDER_ID,
		],
		// Terms of service url.
		tosUrl: false,
	};

	// Initialize the FirebaseUI Widget using Firebase.
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded.
	ui.start('#firebaseui-auth-container', uiConfig);
}

function index() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			var Blog = firebase.database().ref(user.displayName),
				postRef = Blog.child('Posts').orderByChild('updatedAt');
			postRef.on('value', function (r) {
				var html = '';
				r.forEach(function (item) {
					entry = item.val();

					html =
						'<div class="__article">' +
						'<a href="my-posts.html?id=' +
						item.getKey() +
						'">' +
						'<div class="panel-heading">' +
						excerpt(entry.title, 140) +
						'</div>' +
						'<div class="panel-body">' +
						'<small>' +
						datetimeFormat(entry.updatedAt) +
						'</small>' +
						'</div>' +
						'</a><small class="' +
						entry.status +
						'">' +
						entry.status +
						'</small></div>' +
						html; // prepend the entry because we need to display it in reverse order
				});
				$('#__entries.__post').removeClass('__loading').find('.__loader').remove();
				$('#__entries.__post .__panel_content').append(html);
			});
		} else {
			// if not logged in
			alert('Please login first');
			window.location.href = 'sign-in.html';
		}
	});
}

function profile() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// document.getElementById('profile').innerHTML = JSON.stringify(user, null, 2);
			document.getElementById('logout').onclick = function () {
				firebase.auth().signOut();
			};

			var html = '',
				Blog = firebase.database().ref(user.displayName),
				postRef = Blog.child('Posts'),
				fileRef = Blog.child('Files');

			html =
				'<div class="__avatar"><img src="' +
				user.photoURL +
				'"/></div><div class="__info"><div class="__name"><span>' +
				user.displayName +
				'</span></div><span></span><span class="__email">' +
				user.email +
				'</span></div></div>' +
				html; // prepend the entry because we need to display it in reverse order
			$('.__profile_container').removeClass('__loading').prepend(html).find('.__loader').remove();

			postRef.limitToLast(5).once('value', function (r) {
				var html = '';
				r.forEach(function (item) {
					entry = item.val();

					html =
						'<div class="__article">' +
						'<a href="my-posts.html?id=' +
						item.getKey() +
						'" title="' +
						entry.title +
						'">' +
						'<div class="panel-heading">' +
						excerpt(entry.title, 140) +
						'</div>' +
						'<div class="panel-body">' +
						'<small>' +
						datetimeFormat(entry.updatedAt) +
						'</small>' +
						'</div>' +
						'</a><small class="' +
						entry.status +
						'">' +
						entry.status +
						'</small></div>' +
						html; // prepend the entry because we need to display it in reverse order
				});

				$('#__entries.__post').removeClass('__loading');
				$('#__entries.__post .__panel_content').prepend(html).find('.__loading').remove();
			});

			fileRef.once('value', function (r) {
				var html = '';
				r.forEach(function (item) {
					html =
						'<div class="__article">' +
						'<div class="panel-heading">' +
						item.key +
						'</div>' +
						'<a href="' +
						item.val() +
						'" title="' +
						item.key +
						'" target="_blank" rel="nofollow noopener noreferer"><small>Download</small></a></div>' +
						html; // prepend the entry because we need to display it in reverse order
				});

				$('#__entries.__files').removeClass('__loading');
				$('#__entries.__files .__panel_content').prepend(html).find('.__loading').remove();
			});
		} else {
			// if not logged in yet
			window.location.href = 'sign-in.html';
		}
	});
}

function entry() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// Fetch and display the entry
			var entry_id = $_GET('id');

			if (entry_id) {
				var added_views = false;
				var Entry = firebase.database().ref(user.displayName),
					postRef = Entry.child('Posts').child(entry_id),
					pointRef = Entry.child('Points');

				postRef.on('value', function (r) {
					var entry = r.val();

					if (entry) {
						entry['updatedAt-formatted'] = datetimeFormat(entry.updatedAt);

						$('[data-bind]').each(function () {
							$(this).html(entry[$(this).data('bind')]);
						});

						// increase views count. once.
						if (!added_views) {
							added_views = true;
							postRef.child('views').transaction(function (views) {
								return (views || 0) + 1;
							});
						}

						// update title
						$('.__blog_post_header .__post_title').text(entry.title);

						$('.bq em').text(entry.description);
					} else {
						// content not found
						window.location.href = 'index.html';
					}
				});

				// update button
				$('#update').attr('href', 'update.html?id=' + entry_id);

				// delete button
				$('#delete').click(function () {
					postRef.remove(); // this will trigger Entry.on('value') immediatly
				});
			} else {
				alert('This entry id does not exist');
				window.location.href = 'index.html';
			}
		} else {
			// if not logged in
			alert('Please login first');
			window.location.href = 'sign-in.html';
		}
	});

	function $_GET(key) {
		var queries = window.location.href.split('?').pop().split('&');
		var params = {};
		queries.map(function (query) {
			var set = query.split('=');
			params[set[0]] = set[1];
		});

		if (key) {
			return params[key] || null;
		} else {
			return params;
		}
	}
}

function update() {
	// check login status *
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// Fetch the entry from Firebase
			var entry_id = $_GET('id');

			if (entry_id) {
				var Entry = firebase.database().ref(user.displayName),
					postRef = Entry.child('Posts').child(entry_id);

				postRef.once('value', function (r) {
					// once = just this once, no need to actively watch the changes
					var entry = r.val();

					$('#update_entry [name="title"]').val(entry.title);
					$('#update_entry [name="description"]').val(entry.description);
					$('#update_entry [name="labels"]').val(entry.labels);
					$('#update_entry [name="content"]').val(entry.content);

					tinymce.init({
						selector: 'textarea',
						height: 500,
						branding: false,
						menubar: 'file edit view insert format tools table',
						plugins:
							'link image preview toc codesample table wordcount code lists insertdatetime emoticons visualblocks',
						toolbar:
							'formatselect | bold italic underline strikethrough superscript subscript blockquote | link image |  alignleft aligncenter alignright alignjustify bullist numlist | table toc | codesample preview insertdatetime emoticons visualblocks code',
						toc_class: 'elcTOC',
						toc_depth: 6,
						content_style: 'body { font-family: "Segoe UI"}',
						codesample_languages: [
							{
								text: 'Command Line',
								value: 'command hljs hl hljs',
							},
							{
								text: 'CSS',
								value: 'css hljs hl css',
							},
							{
								text: 'C',
								value: 'c hljs hl c',
							},
							{
								text: 'C++',
								value: 'cpp hljs hl cpp',
							},
							{
								text: 'HTML/XML',
								value: 'html hljs hl html xml',
							},
							{
								text: 'Java',
								value: 'java hljs hl java',
							},
							{
								text: 'JavaScript',
								value: 'javascript hljs hl javascript',
							},
							{
								text: 'JSON',
								value: 'json hljs hl json',
							},
							{
								text: 'Markdown',
								value: 'markdown hljs hl markdown',
							},
							{
								text: 'PHP',
								value: 'php hljs hl php',
							},
							{
								text: 'Python',
								value: 'python hljs hl python',
							},
							{
								text: 'TypeScript',
								value: 'typescript hljs hl typescript',
							},
						],
						insertdatetime_formats: ['Updated: %A, %d %B %Y'],
						rel_list: [
							{
								title: 'Internal Link',
								value: '',
							},
							{
								title: 'External Link',
								value: 'noopener noreferer nofollow',
							},
						],
						extended_valid_elements:
							'img[src|loading=lazy|alt|title|width|height|align|onmouseover|onmouseout|name]',
						init_instance_callback: function (editor) {
							$('.__loader').remove();
						},
					});
				});

				// Save the form data
				$('#update_entry').submit(function (e) {
					e.preventDefault();

					var txtConntent = tinymce.get('content').getContent();

					var mapObj = {
						'"': "'",
						mcetoc: 'elcreative_toc',
					};
					var txtRplc = txtConntent.replace(/"|mcetoc/g, function (matched) {
						return mapObj[matched];
					});

					var str_esc = unescape(txtRplc);

					postRef
						.transaction(function (entry) {
							entry = entry || {};
							entry.title = $('#update_entry [name="title"]').val();
							entry.description = $('#update_entry [name="description"]').val();
							entry.labels = $('#update_entry [name="labels"]').val();
							entry.content = str_esc;
							entry.updatedAt = new Date().getTime();
							entry.author = user.email;

							return entry;
						})
						.then(function () {
							window.location.href = 'my-posts.html?id=' + entry_id;
						})
						.catch(function (error) {
							alert(error);
						});

					return false;
				});
			} else {
				window.location.href = 'create-posts.html';
			}
		} else {
			// if not logged in
			alert('Please log-in');
			window.location.href = 'sign-in.html';
		}
	});

	// Utilities
	function $_GET(key) {
		var queries = window.location.href.split('?').pop().split('&');
		var params = {};
		queries.map(function (query) {
			var set = query.split('=');
			params[set[0]] = set[1];
		});

		if (key) {
			return params[key] || null;
		} else {
			return params;
		}
	}
}

function create() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			tinymce.init({
				selector: 'textarea',
				height: 500,
				branding: false,
				menubar: 'file edit view insert format tools table',
				plugins:
					'link image preview toc codesample table wordcount code lists insertdatetime emoticons visualblocks',
				toolbar:
					'formatselect | bold italic underline strikethrough superscript subscript blockquote | link image |  alignleft aligncenter alignright alignjustify bullist numlist | table toc | codesample preview insertdatetime emoticons visualblocks code',
				toc_class: 'elcTOC',
				toc_depth: 6,
				content_style: 'body { font-family: "Segoe UI"}',
				codesample_languages: [
					{
						text: 'Command Line',
						value: 'command hljs hl hljs',
					},
					{
						text: 'CSS',
						value: 'css hljs hl css',
					},
					{
						text: 'C',
						value: 'c hljs hl c',
					},
					{
						text: 'C++',
						value: 'cpp hljs hl cpp',
					},
					{
						text: 'HTML/XML',
						value: 'html hljs hl html xml',
					},
					{
						text: 'Java',
						value: 'java hljs hl java',
					},
					{
						text: 'JavaScript',
						value: 'javascript hljs hl javascript',
					},
					{
						text: 'JSON',
						value: 'json hljs hl json',
					},
					{
						text: 'Markdown',
						value: 'markdown hljs hl markdown',
					},
					{
						text: 'PHP',
						value: 'php hljs hl php',
					},
					{
						text: 'Python',
						value: 'python hljs hl python',
					},
					{
						text: 'TypeScript',
						value: 'typescript hljs hl typescript',
					},
				],
				insertdatetime_formats: ['Updated: %A, %d %B %Y'],
				rel_list: [
					{
						title: 'Internal Link',
						value: '',
					},
					{
						title: 'External Link',
						value: 'noopener noreferer nofollow',
					},
				],
				extended_valid_elements:
					'img[src|loading=lazy|alt|title|width|height|align|onmouseover|onmouseout|name]',
				init_instance_callback: function (editor) {
					$('.__loader').remove();
				},
			});

			// Process form data and save to Firebase database
			$('#new_entry').submit(function (e) {
				e.preventDefault();

				var entry = {};
				entry.title = $(this).find('[name="title"]').val();
				entry.description = $(this).find('[name="description"]').val();
				entry.labels = $(this).find('[name="labels"]').val();
				entry.content = tinymce.get('content').getContent();
				entry.createdAt = new Date().getTime();
				entry.updatedAt = entry.createdAt;
				entry.views = 0;
				entry.status = 'Pending';

				var Entry = firebase.database().ref(user.displayName),
					postRef = Entry.child('Posts');

				Entry.child('Points').transaction(function (views) {
					return (views || 0) + 10;
				});

				postRef
					.push(entry)
					.then(function (data) {
						window.location.href = 'my-posts.html?id=' + data.getKey();
					})
					.catch(function (error) {
						alert(error);
						console.error(error);
					});

				return false;
			});
		} else {
			// if not logged in
			alert('Please login first');
			window.location.href = 'sign-in.html';
		}
	});
}

// Utilities
function strip(html) {
	var tmp = document.createElement('DIV');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || '';
}

function excerpt(text, length) {
	text = strip(text);
	text = $.trim(text); //trim whitespace
	if (text.length > length) {
		text = text.substring(0, length - 3) + '...';
	}
	return text;
}

function pad2Digit(num) {
	return ('0' + num.toString()).slice(-4);
}

function datetimeFormat(timestamp) {
	var dateObj = new Date(timestamp);
	var en_month = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember',
	];
	return dateObj.getDate() + ' ' + en_month[dateObj.getMonth()] + ' ' + pad2Digit(dateObj.getFullYear());
}
