chrome.storage.local.get('numRows', function(result) {
  if (typeof result.numRows === 'undefined') {
    chrome.storage.local.set({
      'numRows': 1
    });
  } 
});
