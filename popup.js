document.addEventListener('DOMContentLoaded', function() {
	var saveTabButton = document.getElementById("savetab");
	saveTabButton.addEventListener('click', function() {
		saveTab();
	}, false);
	var checkSaveWindowButton = document.getElementById("savewindow");
	checkSaveWindowButton.addEventListener('click', function() {
		saveWindow();
	}, false);
	var checkSaveSessionButton = document.getElementById("savesession");
	checkSaveSessionButton.addEventListener('click', function() {
		saveSession();
	}, false);
}, false);

//Each saved url is saved as an individual object. So result returns an array of objects.
//Each object is a dictionary with the keys 'url' and 'url_short'
function saveTab() {
	//retrieve the old url_dict_list from local storage
	chrome.storage.local.get('urls', function(result) {
		console.log(result)
		var url_dict_list = []; //used to keep track of the dictionary for each url/url_short/jpg we hvae
		var url_list = []; //actual url from the dictionary
		if (!($.isEmptyObject(result))) //if returned object is not empty, append it to url_dict_list
		{
			var length = result['urls'].length;
			for (var i = 0; i < length; i++)
			{
				url_dict_list.push(result['urls'][i]);
				url_list.push(result['urls'][i]['url']);
				console.log(result['urls'][i]);
			}
		}
		//get the URL of the current tab and save it in the url_dict_list
		chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
			var tab_url = tab[0].url;
			var url_short = tab[0].title;
			var url_icon = tab[0].favIconUrl
			var url_dict = {'url': tab_url, 'url_short': url_short, 'icon': url_icon}
			if ($.inArray(tab_url, url_list) == -1) //if current URL is not already saved
			{
				url_dict_list.push(url_dict);
				console.log(url_short);
				console.log('not already saved')
			}
			//first delete the old urls from storage, then add the new urls into storage
			chrome.storage.local.remove('urls', function() {
				//locally save url_dict_list (containing the new url)
				chrome.storage.local.set({'urls': url_dict_list}, function() {
					//callback function (maybe show that tab was successfully added)
					document.getElementById('savetab').innerHTML = "tab saved.";
				});
			});
		});	
	});
};
 //Saves all tabs within the current window
function saveWindow() {
	//retrieve the old url_dict_list from local storage
	chrome.storage.local.get('urls', function(result) {
		console.log(result)
		var url_dict_list = []; //used to keep track of the dictionary for each url/url_short/jpg we hvae
		var url_list = []; //actual url from the dictionary
		if (!($.isEmptyObject(result))) //if returned object is not empty, append it to url_dict_list
		{
			var length = result['urls'].length;
			for (var i = 0; i < length; i++)
			{
				url_dict_list.push(result['urls'][i]);
				url_list.push(result['urls'][i]['url']);
				console.log(result['urls'][i]);
			}
		}
		//get the URL of the current tab and save it in the url_dict_list
		chrome.windows.getCurrent({populate: true}, function(w) {
			w['tabs'].forEach(function(tab) {
				var tab_url = tab.url;
				var url_short = tab.title;
				var url_dict = {'url': tab_url, 'url_short': url_short}
				if ($.inArray(tab_url, url_list) == -1) //if current URL is not already saved
				{
					url_dict_list.push(url_dict);
					console.log(url_short);
					console.log('not already saved');
				}
			});
			//first delete the old urls from storage, then add the new urls into storage
			chrome.storage.local.remove('urls', function() {
				//locally save url_dict_list (containing the new url)
				chrome.storage.local.set({'urls': url_dict_list}, function() {
					//callback function (maybe show that tab was successfully added)
					document.getElementById('savewindow').innerHTML = "window saved.";
					console.log('saved')
				});
			});
		});	
	});
};

 //Saves all tabs in the current session
function saveSession() {
	//retrieve the old url_dict_list from local storage
	chrome.storage.local.get('urls', function(result) {
		console.log(result)
		var url_dict_list = []; //used to keep track of the dictionary for each url/url_short/jpg we hvae
		var url_list = []; //actual url from the dictionary
		if (!($.isEmptyObject(result))) //if returned object is not empty, append it to url_dict_list
		{
			var length = result['urls'].length;
			for (var i = 0; i < length; i++)
			{
				url_dict_list.push(result['urls'][i]);
				url_list.push(result['urls'][i]['url']);
				console.log(result['urls'][i]);
			}
		}
		//get the URL of the current tab and save it in the url_dict_list
		chrome.windows.getAll({populate: true}, function(windows) {
			windows.forEach(function(w) {
				w['tabs'].forEach(function(tab) {
					var tab_url = tab.url;
					var url_short = tab.title;
					var url_dict = {'url': tab_url, 'url_short': url_short}
					if ($.inArray(tab_url, url_list) == -1) //if current URL is not already saved
					{
						url_dict_list.push(url_dict);
						console.log(url_short);
						console.log('not already saved');
					}
				});
			});
			//first delete the old urls from storage, then add the new urls into storage
			chrome.storage.local.remove('urls', function() {
				//locally save url_dict_list (containing the new url)
				chrome.storage.local.set({'urls': url_dict_list}, function() {
					//callback function (maybe show that tab was successfully added)
					document.getElementById('savesession').innerHTML = "session saved.";
				});
			});
		});	
	});
};

document.addEventListener('DOMContentLoaded', function() {
	var viewTabsButton = document.getElementById("viewtabs");
	viewTabsButton.addEventListener('click', function() {
		window.location.href = "tabsview.html";
	}, false);
}, false);

