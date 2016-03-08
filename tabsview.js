document.addEventListener('DOMContentLoaded', function() {
	generateTabList();
}, false);

function generateTabList() { //creates the list of saved tabs on the popup (tabsview.html)
	chrome.storage.local.get('urls', function(result) {
		console.log(result);
		var ul = makeUL(result['urls']);
		var savedTabsList= document.getElementById('savedtabs');
		while (savedTabsList.firstChild) { //removes every currently existing element in savedTabsList
		    savedTabsList.removeChild(savedTabsList.firstChild);
		}
		savedTabsList.appendChild(ul); //dynamically adds the saved tabs to the savedTabsList
		savedTabsList.addEventListener('click', function(e) { //listens for a click on the link
			var clicked_url = e.target.href;
			chrome.tabs.create({url: clicked_url}); //creates a new tab with that url when clicked
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
        anchor.href = array[i]['url'];
        anchor.innerText = array[i]['url_short'];
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
		chrome.storage.local.clear(function(){
			checkDeleteButton.innerHTML = "Successfully deleted!"
			generateTabList();
		});
	}, false);
}, false);