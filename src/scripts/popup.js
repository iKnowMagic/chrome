var popup = function ($) {
  var options = {
    numRows: 2
  };

  function getNumRows() {
    chrome.storage.local.remove('numRows'); //debug
    chrome.storage.local.get('numRows', function(result) {
      
    });
  }

  function main() {
    getNumRows();
  }

  return {
    main: main
  };
}(jQuery);

jQuery(document).ready(function () {
  popup.main();
});
