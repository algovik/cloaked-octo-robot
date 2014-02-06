function loadView(){
	if(localStorage.token){
		document.getElementById("displayView").innerHTML = document.getElementById("profileView").innerHTML; //Shows profileView when user already has a token.
	} else {
		document.getElementById("displayView").innerHTML = document.getElementById("welcomeView").innerHTML; //Else it shows the welcomeView.
	}
}

function logout(){
	result = serverstub.signOut(localStorage.token);
	localStorage.removeItem("token");
	location.reload();
}

function changePasswordClient(formVar){
	var oldPassword = formVar["oldPassword"].value;
	var newPassword = formVar["newPasswordChange"].value;
	result = serverstub.changePassword(localStorage.token,oldPassword,newPassword);
	document.getElementById("lblChangePassword").innerHTML = result["message"];
	formVar["oldPassword"].value = "";
	formVar["newPasswordChange"].value = "";
	return false;
}

function tab(tab){
	//Reset all the tabs
	document.getElementById("home").style.display="none";
	document.getElementById("browse").style.display="none";
	document.getElementById("account").style.display="none";
	document.getElementById("li_home").setAttribute("class","");
	document.getElementById("li_browse").setAttribute("class","");
	document.getElementById("li_account").setAttribute("class","");
	//Load appropriate tab
	document.getElementById(tab).style.display="block";
	document.getElementById("li_"+tab).setAttribute("class","active");
}

function validateLogin(formVar){
	var bool=true;
	var username = formVar["username"].value;
	if(username==null||username==""){
		changeBorderColor(formVar["username"], 2);
		bool=false;
	}

	var password = formVar["password"].value;
	if(password==null||password==""){
		changeBorderColor(formVar["password"], 2);
		bool=false;
	}
	
	if(bool==true){
		var serverResponse = serverstub.signIn(username, password);
		bool=serverResponse["success"]
		if(bool){
			localStorage.token = serverResponse["data"]; //If login is successful, a session token is stored locally
		} else {
			changeBorderColor(formVar["username"], 2);
			changeBorderColor(formVar["password"], 2);
			document.getElementById("loginMsg").innerHTML = serverResponse["message"];
		}
	}
	return bool;
}

function removeLoginMsg(){
	document.getElementById("loginMsg").innerHTML = "";
}

function validateSignup(formVar){
	removeAllSignupMessages();
	var bool=true;
	var formData=new Array(); //This object will contain the form data that will be passed on to the server.
	formData["gender"]=formVar["gender"].value;

	var x = formVar["firstName"].value;
	formData["firstname"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["firstName"], 2);
		bool=false;
	}

	x = formVar["familyName"].value;
	formData["familyname"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["familyName"], 2);
		bool=false;
	}

	x = formVar["city"].value;
	formData["city"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["city"], 2);
		bool=false;
	}

	x = formVar["country"].value;
	formData["country"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["country"], 2);
		bool=false;
	}

	x = formVar["email"].value;
	formData["email"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["email"], 2);
		bool=false;
	}

	x = formVar["newPassword"].value;
	formData["password"]=x;
	if(x==null||x==""){
		changeBorderColor(formVar["newPassword"], 2);
		bool=false;
	}

	y = formVar["confirmPassword"].value;
	if(y==null||y==""){
		changeBorderColor(formVar["confirmPassword"], 2);
		bool=false;
	}

	if(x!=y){
		changeBorderColor(formVar["newPassword"], 2);
		changeBorderColor(formVar["confirmPassword"], 2);
		formVar["newPassword"].value="";
		formVar["confirmPassword"].value="";
		bool=false;
	}

	if(bool==true){
		var serverResponse = serverstub.signUp(formData);
		var successBool=serverResponse["success"];

		if(!successBool){ //if user already exists
			changeBorderColor(formVar["email"], 2);  //change the border color to red
			createSignupMessage(serverResponse["message"], "errormessage");
		}
		else{	//new user, clear the form fields
			for(i =0; i < formVar.length; i++) {
				if(formVar[i]!=formVar["submit"]){
					formVar[i].value="";
				}
			}
			formVar["gender"].value="male";
			createSignupMessage(serverResponse["message"], "successmessage");
		}
	}
	return false;
}

/*
Creates error messages and success messages with id's that allows us to later on 
identify wheter they are success or error messages (Without knowledge of what content an error message or a 
success message contains. This can be changed on the serverside without any problem on the client)

(Can be generalized to create messages for signup OR sign in.)
*/
function createSignupMessage(message, id) {
    var signupMess = document.createElement(signupMess);
    signupMess.innerHTML=message;
    signupMess.setAttribute("id", id)
    document.getElementById("signupMsg").appendChild(signupMess);
}

function removeSignupMessage(elementId) {
    if(document.getElementById("signupMsg").hasChildNodes()){
    	var message=document.getElementById("signupMsg").childNodes[0];
    	if(message.id==elementId){
    		document.getElementById("signupMsg").removeChild(document.getElementById("signupMsg").childNodes[0]);
    	}
    }
}

function removeErrorMessageAndBorder(fieldName){
	changeBorderColor(fieldName, 1);
	removeSignupMessage("errormessage");
}

function removeSuccessMessageAndBorder(fieldName){
	changeBorderColor(fieldName, 1);
	removeSignupMessage("successmessage");
}

function removeAllSignupMessages(){
	    while (document.getElementById("signupMsg").hasChildNodes()){
    	document.getElementById("signupMsg").removeChild(document.getElementById("signupMsg").childNodes[0]);
    }
}

/*

if(bool==true){
		var serverResponse = serverstub.signIn(username, password);
		bool=serverResponse["success"]
		if(bool){
			localStorage.token = serverResponse["data"]; //If login is successful, a session token is stored locally
		} else {
			changeBorderColor(formVar["username"], 2);
			changeBorderColor(formVar["password"], 2);
			document.getElementById("loginMsg").innerHTML = serverResponse["message"];
		}
	}
	return bool;
}

*/

function changeBorderColor(inputfield, color){
	if(color==1){  //1 gives the standard black border color
		inputfield.className="dotBorder";
	} else { 	//anything else and we change to red border color
		inputfield.className="invalidEntry";
	}
}


// displayView = function(){
//    // the code required to display a view.
// };
// document.onload = function(){
//     //code that is executed as the page is loaded.
// };