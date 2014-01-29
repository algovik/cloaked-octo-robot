function loadView(){
	document.getElementById("welcomeView").innerHTML = document.getElementById("welcomeBody").innerHTML;
}

function validateLogin(formVar){
	var bool=true;
	var x = formVar["username"].value;
	if (x==null||x=="")
	{
		changeBorderColor(document.getElementById("username"), 2);
		bool=false;
	}

	x = formVar["password"].value;
	if (x==null||x=="")
	{
		changeBorderColor(document.getElementById("password"), 2);
		bool=false;
	}
	
	return bool;
}

function validateSignup(formVar){
	var bool=true;
	var x = formVar["firstName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("firstName"), 2);
		bool=false;
	}

	x = formVar["familyName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("familyName"), 2);
		bool=false;
	}

	x = formVar["city"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("city"), 2);
		bool=false;
	}

	x = formVar["country"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("country"), 2);
		bool=false;
	}

	x = formVar["email"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("email"), 2);
		bool=false;
	}

	x = formVar["newPassword"].value;
	if(x==null||x=="")
	{
		changeBorderColor(document.getElementById("newPassword"), 2);
		bool=false;
	}

	y = formVar["confirmPassword"].value;
	if(y==null||y=="")
	{
		changeBorderColor(document.getElementById("confirmPassword"), 2);
		bool=false;
	}

	if (x!=y)
		{
			changeBorderColor(document.getElementById("newPassword"), 2);
			changeBorderColor(document.getElementById("confirmPassword"), 2);
			formVar["newPassword"].value="";
			formVar["confirmPassword"].value="";
			bool=false;
		};
if (bool==true)
{
	console.log("Successful signup!");
}
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