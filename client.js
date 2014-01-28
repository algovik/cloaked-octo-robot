function loadView(){
	document.getElementById("welcomeView").innerHTML = document.getElementById("welcomeBody").innerHTML;
}

function validateLogin(){
	var x = document.forms["login"]["username"].value;
	if (x==null||x=="")
	{
		document.getElementById("username").style.border="1px dotted red";
		// document.login.username.focus();
		return false;
	}

	x = document.forms["login"]["password"].value;
	if (x==null||x=="")
	{
		document.getElementById("password").style.border="1px dotted red";
		// document.login.password.focus();
		return false;
	}

	return true;
}


// displayView = function(){
//    // the code required to display a view.
// };
// document.onload = function(){
//     //code that is executed as the page is loaded.
// };