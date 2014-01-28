function loadView(){
	document.getElementById("welcomeView").innerHTML = document.getElementById("welcomeBody").innerHTML;
}

function validateLogin(){
	var bool=true;
	var x = document.forms["login"]["username"].value;
	if (x==null||x=="")
	{
		changeBorderColor(document.getElementById("username"), 2);
		bool=false;
	}
	else{
	}

	x = document.forms["login"]["password"].value;
	if (x==null||x=="")
	{
		changeBorderColor(document.getElementById("password"), 2);
		bool=false;
	}
	else{
	}
	return bool;
}

function validateSignup(){
	var bool=true;
	var x = document.forms["signup"]["firstName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("firstName"), 2);
		bool=false;
	}

	x = document.forms["signup"]["familyName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("familyName"), 2);
		bool=false;
	}

	x = document.forms["signup"]["city"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("city"), 2);
		bool=false;
	}

	x = document.forms["signup"]["country"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("country"), 2);
		bool=false;
	}

	x = document.forms["signup"]["email"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("email"), 2);
		bool=false;
	}

	x = document.forms["signup"]["newPassword"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("newPassword"), 2);
		bool=false;
	}

	y = document.forms["signup"]["confirmPassword"].value;
	if(y==null||y=="")
	{
		changeBorderColor(document.getElementById("confirmPassword"), 2);
		bool=false;
	}

	if (x!=y)
		{
			changeBorderColor(document.getElementById("newPassword"), 2);
			changeBorderColor(document.getElementById("confirmPassword"), 2);
			document.forms["signup"]["newPassword"].value="";
			document.forms["signup"]["confirmPassword"].value="";
			bool=false;
		};

return bool;

}


function changeBorderColor(inputfield, color){
	if (color==1)  //1 gives the standard black border color
	{
		inputfield.className="dotBorder";
	}
	else 		//anything else and we change to red border color
	{
		inputfield.className="invalidEntry";
	}
}


// displayView = function(){
//    // the code required to display a view.
// };
// document.onload = function(){
//     //code that is executed as the page is loaded.
// };