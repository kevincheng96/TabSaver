//Global variable to keep track of current index in the array of URL's to display on the view
var current_index = 0;

//On view load
document.addEventListener('DOMContentLoaded', function() {
	generateTabView();
}, false);

//Go to the previous page
document.addEventListener('DOMContentLoaded', function() {
	var prevButton = document.getElementById("prev");
	prevButton.addEventListener('click', function() {
		var page_num = Math.floor((current_index - 1) / 9); //get current page number
		if(page_num != 0) 
		{
			current_index = page_num - 1; //go back one page
			current_index *= 9; //multiplied by 9 to get first index of current page (page 1 first index is 9)
			generateTabView();
		}
	}, false);
}, false);

//Go to the next page ***BUG*** (allows page to go to next page when there are only exactly 9 tabs on current window)
document.addEventListener('DOMContentLoaded', function() {
	var nextButton = document.getElementById("next");
	nextButton.addEventListener('click', function() {
		if ((current_index + 1) % 9 != 0) 
		{
			var page_num = Math.floor((current_index + 1) / 9); //get current page number
			current_index = page_num //go forward by one page
			current_index *= 9; //multiplied by 9 to get first index of current page
			generateTabView();
		}
	}, false);
}, false);

//Delete all stored tabs
document.addEventListener('DOMContentLoaded', function() {
	var deleteButton = document.getElementById("delete");
	deleteButton.addEventListener('click', function(){
		chrome.storage.local.clear(function(){
			deleteButton.innerHTML = "Successfully deleted!";
			generateTabView();
		});
	}, false);
}, false);

//Go back to previous view
document.addEventListener('DOMContentLoaded', function() {
	var goBackButton = document.getElementById("goback");
	goBackButton.addEventListener('click', function() {
		window.location.href = "popup.html";
	}, false);
}, false);

//Generates the tabs in the 9 boxes
function generateTabView() { //creates the list of saved tabs on the popup (tabsview.html)
	chrome.storage.local.get('urls', function(result) {
		console.log(result);
		var url_array = result['urls']; //array of url dictionaries
		var box_num = 1; //# for the id of the current box
		for(box_num; box_num < 10; box_num++)
		{
			var box_id = "box" + box_num.toString();
			var box_element = document.getElementById(box_id); //div element
			while(box_element.firstChild) //removes every currently existing element in the current box_element
			{
				box_element.removeChild(box_element.firstChild);
				console.log("deleted" + box_num);
			}
			if(url_array == undefined)
			{
				continue;//jumps over current iteration
			}
			else if(current_index >= url_array.length) //if current index is greater than the total length of urls
			{
				continue;//jumps over current iteration
			}
			var text = document.createElement('p'); //url text
	        var image = document.createElement('img'); //url image
	        var anchor = document.createElement('a'); //url link (anchor)
	        anchor.href = url_array[current_index]['url']; //sets the link for the element in the list
	        var anchor_text = url_array[current_index]['url_short'].substring(0,12) + '...'; //shortens the text that is displayed in the list
	        anchor.innerText = anchor_text;
	        text.appendChild(anchor); 
	        var image_src = url_array[current_index]['icon']; //src url of icon img
	        console.log(image_src);
	        image.src = image_src;

			//add image to box
	        box_element.appendChild(image);
	       	//add text to box
	       	box_element.appendChild(text);
	        current_index++;

			//Listen for clicks to links within current box. 
			//If the link in the box is clicked, remove all its elements from the view and from storage
			box_element.addEventListener('click', function(e) { //e is box_element
				var p = e.target.lastChild; //p within box_element
				var clicked_url = p.firstChild.href; //the link of the anchor element inside p
				chrome.tabs.create({url: clicked_url}); //creates a new tab with that url when clicked
				//Removes clicked element from the list
				while(e.target.firstChild) //removes every currently existing element in the current box_element
				{
					e.target.removeChild(e.target.firstChild);
				}
				//Removes clicked element from storage
				for(var i = 0; i < url_array.length; i++) {
					if(url_array[i]['url'] == String(clicked_url)) { //if the clicked url == the url in url_array
						url_array.splice(i, 1); //removes the ith element from the url_array
						break;
					}
				}
				chrome.storage.local.clear(function(){
					chrome.storage.local.set({'urls': url_array})
				});
			}, false);
		} 
		box_num = 1; //resets box_num (might not be necessary, but for safety purposes)
	});
}