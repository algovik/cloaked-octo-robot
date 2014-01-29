function loadView(){
	document.getElementById("welcomeView").innerHTML = document.getElementById("welcomeBody").innerHTML;
}

function validateLogin(formVar){
	var bool=true;
	var username = formVar["username"].value;
	if (username==null||username=="")
	{
		changeBorderColor(formVar["username"], 2);
		bool=false;
	}

	var password = formVar["password"].value;
	if (password==null||password=="")
	{
		changeBorderColor(formVar["password"], 2);
		bool=false;
	}
	
	if(bool==true)
	{
		var result = serverstub.signIn(username, password);
		alert(result["message"]);
	}

	return bool;
}

function validateSignup(formVar){
	var bool=true;
	var x = formVar["firstName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["firstName"], 2);
		bool=false;
	}

	x = formVar["familyName"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["familyName"], 2);
		bool=false;
	}

	x = formVar["city"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["city"], 2);
		bool=false;
	}

	x = formVar["country"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["country"], 2);
		bool=false;
	}

	x = formVar["email"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["email"], 2);
		bool=false;
	}

	x = formVar["newPassword"].value;
	if(x==null||x=="")
	{
		changeBorderColor(formVar["newPassword"], 2);
		bool=false;
	}

	y = formVar["confirmPassword"].value;
	if(y==null||y=="")
	{
		changeBorderColor(formVar["confirmPassword"], 2);
		bool=false;
	}

	if (x!=y)
		{
			changeBorderColor(formVar["newPassword"], 2);
			changeBorderColor(formVar["confirmPassword"], 2);
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