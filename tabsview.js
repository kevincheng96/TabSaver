//Global variable to keep track of current index in the array of URL's to display on the view
var current_index = 0;

document.addEventListener('DOMContentLoaded', function() {
	generateTabView();
}, false);

function generateTabView() { //creates the list of saved tabs on the popup (tabsview.html)
	chrome.storage.local.get('urls', function(result) {
		console.log(result);
		var url_array = result['urls']; //array of url dictionaries
		var box_num = 1; //# for the id of the current box
		for(box_num; box_num < 10; box_num++)
		{
			if(current_index >= url_array.length) //if current index is greater than the total length of urls
				break;
			var box_id = "box" + box_num.toString();
			var box_element = document.getElementById(box_id);
			while(box_element.firstChild) //removes every currently existing element in the current box_element
			{
				box_element.removeChild(box_element.firstChild);
			}
			var text = document.createElement('p'); //url text
	        var image = document.createElement('img'); //url image
	        var anchor = document.createElement('a'); //url link (anchor)
	        anchor.href = url_array[current_index]['url']; //sets the link for the element in the list
	        var anchor_text = url_array[current_index]['url_short'].substring(0,12) + '...'; //shortens the text that is displayed in the list
	        anchor.innerText = anchor_text;
	        text.appendChild(anchor); 
	        var image_src = url_array[current_index]['icon']; //src url of icon img
	        image.src = image_src

	  //       //requesting external image
	  //       var xhr = new XMLHttpRequest();
			// xhr.open("GET", image_src);
			// xhr.responseType = "blob";
			// xhr.onload = function(e){
			//     image.src = window.URL.createObjectURL(xhr.response);
			//      //add image to box
	  //       	box_element.appendChild(image);
	  //       	//add text to box
	  //       	box_element.appendChild(text);
			// };
			// xhr.send();

			//add image to box
	        box_element.appendChild(image);
	       	//add text to box
	       	box_element.appendChild(text);
	        current_index++;
			//add link and icon to box_element, then change to box_element + 1 until all 9 boxes have something
			//make sure to reset box number at the end
			//when am i using the current_index number and when do i reset it?
		}
		
		// var savedTabsList = document.getElementById('savedtabs');
		// while (savedTabsList.firstChild) { //removes every currently existing element in savedTabsList
		//     savedTabsList.removeChild(savedTabsList.firstChild);
		// }
		// var ul = makeUL(url_array); //makes an unordered list of stored urls using makeURL()
		// savedTabsList.appendChild(ul); //dynamically adds the ul of saved tabs to the savedTabsList

		//Listen for clicks to element of the list. If an element is clicked, remove it from the list and from storage
		// savedTabsList.addEventListener('click', function(e) { //listens for a click on the link
		// 	var clicked_url = e.target.href;
		// 	chrome.tabs.create({url: clicked_url}); //creates a new tab with that url when clicked
		// 	//Removes clicked element from the list
		// 	e.target.parentElement.parentElement.removeChild(e.target.parentElement); 
		// 	//Removes clicked element from storage
		// 	for(var i = 0; i < url_array.length; i++) {
		// 		if(url_array[i]['url'] == String(e.target.href)) { //if the clicked url == the url in url_array
		// 			url_array.splice(i, 1); //removes the ith element from the url_array
		// 			break;
		// 		}
		// 	}
		// 	chrome.storage.local.clear(function(){
		// 		chrome.storage.local.set({'urls': url_array})
		// 	});
		// });
	});
}

document.addEventListener('DOMContentLoaded', function() {
	var checkPrevButton = document.getElementById("prev");
	checkPrevButton.addEventListener('click', function() {
		var page_num = Math.floor(current_index / 9); //get current page number
		if(page_num > 0) 
		{
			current_index = page_num * 9; //get first index of current page number
			current_index -= 9; //go back 9 indices to get to previous page
			generateTabView();
		}
	}, false);
}, false);

document.addEventListener('DOMContentLoaded', function() {
	var checkNextButton = document.getElementById("next");
	checkNextButton.addEventListener('click', function() {
		var page_num = Math.floor(current_index / 9); //get current page number
		current_index = page_num * 9; //get first index of current page number
		current_index += 9; //go back 9 indices to get to previous page
		generateTabView();
	}, false);
}, false);

document.addEventListener('DOMContentLoaded', function() {
	var checkDeleteButton = document.getElementById("delete");
	checkDeleteButton.addEventListener('click', function(){
		chrome.storage.local.clear(function(){
			checkDeleteButton.innerHTML = "Successfully deleted!";
			generateTabView();
		});
	}, false);
}, false);

document.addEventListener('DOMContentLoaded', function() {
	var checkGoBackButton = document.getElementById("goback");
	checkGoBackButton.addEventListener('click', function() {
		window.location.href = "popup.html";
	}, false);
}, false);