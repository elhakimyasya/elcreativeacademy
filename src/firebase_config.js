var config = {
	apiKey: 'AIzaSyCmWRraw2UZWfp_C6p3a4QYhci5LmhtSfY',
	authDomain: 'elc-academy.firebaseapp.com',
	databaseURL: 'https://elc-academy-default-rtdb.firebaseio.com/',
	storageBucket: 'elc-academy.appspot.com',
};
firebase.initializeApp(config);

// Check login status
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// document.getElementById('profile').innerHTML = JSON.stringify(user, null, 2);
		document.getElementById('logout').onclick = function () {
			firebase.auth().signOut();
		};

		var html = '',
			Blog = firebase.database().ref(user.displayName),
			postRef = Blog.child('Posts');
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
					'<a href="entry.html?id=' +
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
			$('#__entries.__post .__panel_content').prepend(html);
		});

		fileRef.on('value', function (r) {
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
		window.location.href = 'login.html';
	}
});

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
