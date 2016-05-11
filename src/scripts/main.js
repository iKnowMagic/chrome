var webInspiration = function ($) {

  var options = {
    compiledTemplate: false,
    templateLocation: 'mainTemplate.html',
    mainContainer: '#main'
  };

  // The helper function to convert XML to JSON
  function parseRSS(url, callback) {
    $.ajax({
      url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num=-1&callback=?&q=' + encodeURIComponent(url),
      dataType: 'json',
      success: function success(data) {
        console.log(data);
        callback(data.responseData.feed);
      }
    });
  }

  function showArticles(json) {
    var container = $('#main').html(''),
        dynamicItems = '';
		dynamicItems += '<div class="container">';

    $.each(json.entries, function (i, val) {
      if (i % 1 === 0) {
        if (i > 0) {
          dynamicItems += '</div><div class="row">';
        }
        else {
          dynamicItems += '<div class="row">';
        }
      }
      dynamicItems += '<div class="col-sm-12"><div class="thumbnail"><a href="' + val.link + '" target="_blank">' +
       val.content.replace('img src', 'img class="img-responsive" src').replace('<div', '<div').replace(/\<\/div\>.*/, '</div>') +
       '<div class="caption">'+ val.contentSnippet +'</div>' +
      '</a></div></div>';
      //return i < 4;
    });

    dynamicItems += '</div>';
    container.append(dynamicItems);
  }

  function parseTemplate(data) {
    console.log(data);
    if (options.compiledTemplate) {
      var rendered = Handlebars.templates[options.handlebarsTemplateInternalName](data);
      $(options.mainContainer).html(rendered);
    } else {
      $.get(options.templateLocation, function (template) {
        var compiled = Handlebars.compile(template);
        var rendered = compiled(data);
        $(options.mainContainer).html(rendered);
      });
    }
  }

  function parseInlineTemplate(data) {
		console.log(data);
    var source = $('#main-template').html();
    var template = Handlebars.compile(source);
    var rendered = template(data);
    $(options.mainContainer).html(rendered);
  }

  function main() {
    parseRSS('http://feeds.feedburner.com/awwwards-sites-of-the-day', showArticles);
  }

  return {
    main: main
  };
}(jQuery);

jQuery(document).ready(function () {
  webInspiration.main();
});
