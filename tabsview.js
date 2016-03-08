document.addEventListener('DOMContentLoaded', function() {
	generateTabList();
}, false);

function generateTabList() { //creates the list of saved tabs on the popup (tabsview.html)
	chrome.storage.local.get('urls', function(result) {
		console.log(result);
		var url_array = result['urls']; //array of url dictionaries
		var savedTabsList= document.getElementById('savedtabs');
		while (savedTabsList.firstChild) { //removes every currently existing element in savedTabsList
		    savedTabsList.removeChild(savedTabsList.firstChild);
		}
		var ul = makeUL(url_array); //makes an unordered list of stored urls using makeURL()
		savedTabsList.appendChild(ul); //dynamically adds the ul of saved tabs to the savedTabsList

		//Listen for clicks to element of the list. If an element is clicked, remove it from the list and from storage
		savedTabsList.addEventListener('click', function(e) { //listens for a click on the link
			var clicked_url = e.target.href;
			chrome.tabs.create({url: clicked_url}); //creates a new tab with that url when clicked
			//Removes clicked element from the list
			e.target.parentElement.parentElement.removeChild(e.target.parentElement); 
			//Removes clicked element from storage
			for(var i = 0; i < url_array.length; i++) {
				if(url_array[i]['url'] == String(e.target.href)) { //if the clicked url == the url in url_array
					url_array.splice(i, 1); //removes the ith element from the url_array
					break;
				}
			}
			chrome.storage.local.clear(function(){
				chrome.storage.local.set({'urls': url_array})
			});
		});
	});
}

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
        //create the list item
        var list_item = document.createElement('li');
        //create link (using anchor)
        var anchor = document.createElement("a");
        anchor.href = array[i]['url']; //sets the link for the element in the list
        var anchor_text = array[i]['url_short'].substring(0,21) + '...'; //shortens the text that is displayed in the list
        anchor.innerText = anchor_text;
        //add this anchor link to the list item
        list_item.appendChild(anchor);
        //add this list item to the list
        list.appendChild(list_item);
    };
    // Finally, return the constructed list:
    return list;
};

document.addEventListener('DOMContentLoaded', function() {
	var checkDeleteButton = document.getElementById("deletetabs");
	checkDeleteButton.addEventListener('click', function(){
		//NEED TO ADD A CONFIRMATION TO DELETE. ALERTS DONT WORK
		chrome.storage.local.clear(function(){
			checkDeleteButton.innerHTML = "Successfully deleted!"
			generateTabList();
		});
	}, false);
}, false);