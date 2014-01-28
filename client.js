function loadView(){
	document.getElementById("welcomeView").innerHTML = document.getElementById("welcomeBody").innerHTML;
}

function validateLogin(){
	var bool=true;
	var x = document.forms["login"]["username"].value;
	if (x==null||x=="")
	{
		document.getElementById("username").className ="invalidEntry";
		bool=false;
	}
	else{
		document.getElementById("username").className="standardBorder";
	}

	x = document.forms["login"]["password"].value;
	if (x==null||x=="")
	{
		document.getElementById("password").className ="invalidEntry";
		bool=false;
	}
	else{
		document.getElementById("password").className="standardBorder";
	}
	return bool;
}

function validateSignup(){
	var x = document.forms["signup"]["firstName"].value;
	if(x==null||x=="")
	{
		document.getElementById("firstName").style.border="1px dotted red";
		return false;
	}

	x = document.forms["signup"]["familyName"].value;
	if(x==null||x=="")
	{
		document.getElementById("familyName").style.border="1px dotted red";
		return false;
	}

	x = document.forms["signup"]["city"].value;
	if(x==null||x=="")
	{
		document.getElementById("city").style.border="1px dotted red";
		return false;
	}

	x = document.forms["signup"]["country"].value;
	if(x==null||x=="")
	{
		document.getElementById("country").style.border="1px dotted red";
		return false;
	}




}


// displayView = function(){
//    // the code required to display a view.
// };
// document.onload = function(){
//     //code that is executed as the page is loaded.
// };