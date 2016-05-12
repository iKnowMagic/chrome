var webInspiration = function($) {

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
        callback(data.responseData.feed);
      }
    });
  }

  function getNumRows() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('numRows', function(result) {
        if (typeof result.numRows === 'undefined') {
          chrome.storage.local.set({
            'numRows': 1
          });
          resolve(1);
        }
        else {
          resolve(result.numRows);
        }
      });
    });
  }

  function isNewImage(currImage) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('images', function(result) {
        if (typeof result.images === 'undefined') {
          chrome.storage.local.set({
            'images': [currImage]
          });
          resolve(true);
        }
        else {
          if (result.images.indexOf(currImage)) {
            console.log(2);
            resolve(false);
          }
          else {
            console.log(3);
            result.images.push(currImage);
            chrome.storage.local.set({
              'images': result.images
            });
            resolve(true);
          }
        }
      });
    });
  }


  function showArticles(json) {
    chrome.storage.local.clear();
    getNumRows().then(function(res) {
      if (res === 1) {
        showOneArticle(json);
      }
      else {

      }
    });
  }

  function setBackground(image) {
    $('body').css({ 'backgroundImage': "url('" + image + "')" });
  }

  function showOneArticle(json) {
    $.each(json.entries, function(i, val) {
      var image = val.content.match(/img src\=\"(.*\.jpeg)|(.*\.png)|(.*\.jpg)\"/);
      if (image[1] !== 'undefined') {
        isNewImage(image[1]).then(function(res) {
          if (res === true) {
            setBackground(image[1]);
          }
        });
      }
    });
  }

  /*
  function showOneArticle(json) {
    var container = $('#main').html(''),
      dynamicItems = '';
    dynamicItems += '<div class="container">';

    $.each(json.entries, function(i, val) {
      if (i % 1 === 0) {
        if (i > 0) {
          dynamicItems += '</div><div class="row">';
        } else {
          dynamicItems += '<div class="row">';
        }
      }
      dynamicItems += '<div class="col-sm-12"><div class="thumbnail"><a href="' + val.link + '" target="_blank">' +

        '<div class="caption">' + val.contentSnippet + '</div>' +
        '</a></div></div>';
      //return i < 4;
    });

    dynamicItems += '</div>';
    container.append(dynamicItems);
  }
  */

  function parseTemplate(data) {
    if (options.compiledTemplate) {
      var rendered = Handlebars.templates[options.handlebarsTemplateInternalName](data);
      $(options.mainContainer).html(rendered);
    } else {
      $.get(options.templateLocation, function(template) {
        var compiled = Handlebars.compile(template);
        var rendered = compiled(data);
        $(options.mainContainer).html(rendered);
      });
    }
  }

  function parseInlineTemplate(data) {
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

jQuery(document).ready(function() {
  webInspiration.main();
});
