function parseRSS(url, callback) {
	$.ajax({
		url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=2.0&callback=?&q=' + encodeURIComponent(url),
		dataType: 'json',
		success: function (data) {
			callback(data.responseData.feed);
		}
	});
}

// Get the latest 5 articles from a WordPress site
function showArticles(json) {
	var container = $('#blog-articles').html(''),
		dynamicItems = '';
	$.each(json.entries, function (i, val) {
		dynamicItems += '<li><a href="' + val.link + '">' + val.title + '</a></li>';
		return i < 4;
	});
	container.append(dynamicItems);
}

// Call our function
parseRSS('http://feeds.feedburner.com/awwwards-sites-of-the-day', showArticles);
