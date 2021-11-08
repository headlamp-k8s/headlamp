// ==========================================
// Based on: https://gist.github.com/cmod/5410eae147e4318164258742dd053993
//

var fuse; // holds our search engine
var indexes = {};
var lunars = {};
var searchVisible = false;
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResultsList'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var searchResults = document.getElementById("searchResults");
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener('keydown', function(event) {
  // Typing / focuses search
  if (event.key === '/') {
      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed


      // Toggle visibility of search box
      if (!searchVisible) {
        maininput.focus(); // put focus in input box so you can just start typing
        searchVisible = true; // search visible
        event.preventDefault();
        maininput.value = '';
      }
      // else {
      //   searchResults.style.visibility = "hidden"; // hide search box
      //   document.activeElement.blur(); // remove focus from search box
      //   searchVisible = false; // search not visible
      // }
  }

  // Close search box
  if (event.key === 'Escape') {
    if (searchVisible) {
      maininput.value = '';
      searchResults.style.visibility = "hidden";
      document.activeElement.blur();
      searchVisible = false;
    }
  }

  // Next result
  if (event.key === 'ArrowDown') {
    if (resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
      else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
    }
  }

  // Previous result
  if (event.key === 'ArrowUp') {
    if (resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
    }
  }
});


// ==========================================
// execute search as each character is typed
//
let searchThrottleId = -1;
maininput.onkeyup = function(e) {
  if (e.code.startsWith('Key')) {
    if (!fuse && firstRun) {
      loadSearch(); // loads our json data and builds fuse.js search index
      firstRun = false; // let's never do this again
      return;
    }

    if (searchThrottleId >= 0) {
      clearTimeout(searchThrottleId);
    }
    searchThrottleId = setTimeout(() => {
      searchThrottleId = -1;
      searchVisible = true;
      executeSearch(this.value);
    },
    150);
  }
}


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
  let searchTerms = maininput.value;
  if (!!searchTerms && !resultsAvailable) {
    list.innerHTML = '<li class="no-results">Searching…</li>';
  }
  fetchJSONFile((window.location.baseurl || '') + '/index.json', function(data) {
    index = data;

    function makeIndex(version, data) {
      return lunr(function() {
        this.ref('permalink');
        this.field('title');
        this.field('permalink');
        this.field('categories');
        this.field('contentList');
        this.field('tags');
        data[version].forEach(p => {
          let index = indexes[version] || {};
          index[p.permalink] = p
          indexes[version] = index

          this.add(p);
        });
      });
    }

    Object.keys(data).forEach(version => {
      lunars[version] = makeIndex(version, data);
    });

    // Let's a seach here because we may have taken a while to fetch all the info.
    let searchTerms = maininput.value;
    if (!!searchTerms && !resultsAvailable) {
      executeSearch(searchTerms);
    }
  });
}


// ==========================================
// using the index we loaded on CMD-/, run
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  if (Object.keys(lunars).length === 0) {
    return;
  }

  searchResults.style.visibility = "visible";

  let version = maininput.dataset.searchVersion;

  if (!resultsAvailable) {
    list.innerHTML = '<li class="no-results">Searching…</li>';
  }

  let results = lunars[version].search(term + '*');
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '<li class="no-results">No results. Try different search terms.</li>';
  } else { // build our html
    for (let result of results.slice(0,100)) {
      let item = indexes[version][result.ref];
      if (item.title === 0) {
        continue;
      }

      let contents = `<span class="contents">${item.contentList.slice(0, 100).join(' ')}<span>`
      searchitems += `<li><a href="${item.permalink}" tabindex="0"><span class="title">${item.title}</span><br />${contents}</a></li>`;
    }
    resultsAvailable = true;
  }

  list.innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}

