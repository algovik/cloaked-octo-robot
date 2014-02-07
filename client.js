function loadView(){
	if(localStorage.token){
		document.getElementById("displayView").innerHTML = document.getElementById("profileView").innerHTML; //Shows profileView when user already has a token.
		loadPersonalData(localStorage.token);
	} else {
		document.getElementById("displayView").innerHTML = document.getElementById("welcomeView").innerHTML; //Else it shows the welcomeView.
	}
}

function confirmLogout(){
	var r=confirm("Are you sure you want to log out?");
	if (r==true){
		logout();
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
	document.getElementById("msgChangePassword").innerHTML = result["message"];
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
			document.getElementById("msgLogin").innerHTML = serverResponse["message"];
		}
	}
	return bool;
}

function loadPersonalData(token){
	var personalData = serverstub.getUserDataByToken(token)["data"];
	document.getElementById("pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
	var gender=personalData["gender"];
	document.getElementById("pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
	document.getElementById("pdemail").innerHTML=personalData["email"];

	//load messages
	alert("loading messages");
	listAllMessages(token)
	alert("messages loaded");
}

function removeLoginMsg(){
	document.getElementById("msgLogin").innerHTML = "";
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
Will use the serverstub to store a message in the specified users wall storage with the attributes fromUser and message.
*/
function sendToWall(formVar, toUserToken){
	var userEmail = serverstub.tokenToEmail(toUserToken);
	serverResponse = serverstub.postMessage(localStorage.token, formVar["wallInputField"].value, userEmail);
	alert(serverResponse["message"]);
	return serverResponse["success"];

}

/*
Retrieves the users messages from the 'server'
*/
function retrieveMessages(userToken){
	serverResponse = serverstub.getUserMessagesByToken(userToken);
	// messages = serverResponse["data"];

	return serverResponse;
}

/*
Called when the client wants to view all messages on their wall.
*/

function listAllMessages(userToken){
	response = retrieveMessages(userToken);
	alert("messages retrieved");
	messages = response["data"];
	alert("content of first message "+ messages[0]["content"]);
	if(response["success"]==true){
		alert("MEDDELANDEN FINNS");	// FÅR UT DETTA!
	}

	if(response["success"]==true){
		for (var i=0; i < messages.length; i++){
			alert("skall nu lägga till meddelandet: " + messages[i]["content"]);
			addMessageToWall(messages[i]);
		}
		return true;
	}
	else{
		return false;
	}

}

/*
Adds/appends a single message to the wall where "var message = {"writer": fromEmail, "content": content};" is
the definition of a message defined on the server-side.
*/
function addMessageToWall(messageVar){
	var messageElement = document.createElement("label");
	alert("skapar en label");
    messageElement.innerHTML=messageVar["content"];
    alert("lägger till message content som innerHTML");
    /*signupMess.setAttribute("class", "messageClass")
    alert("sätter class till messageClass");*/  //HÄR VAR PROBLEMET
    document.getElementById("wallMessages").appendChild(messageElement);
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