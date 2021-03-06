function loadView(){
	if(localStorage.token){
		document.getElementById("displayView").innerHTML = document.getElementById("profileView").innerHTML; //Shows profileView when user already has a token.
		
		// var globalUserEmail = null;
		var globalBrowsedEmail = null;

		var con = new XMLHttpRequest();

    	con.onreadystatechange=function(event){
	        if (event.target.readyState==4 && event.target.status==200){
	            serverResponse = JSON.parse(event.target.responseText);
	            localStorage.globalUserEmail = serverResponse["data"];
	            loadPersonalData(localStorage.globalUserEmail, true);
	        }
	    }

	    con.open("GET", "/tokentoemail?token=" + localStorage.token, true);
    	con.send(null);

    	//-----Gamla koden-----
		// var email=serverstub.tokenToEmail(localStorage.token);
		// loadPersonalData(email, true);
		// var globalBrowsedEmail=null; //used to keep track of the email address of the currently browsed users.
	}
	else{
		document.getElementById("displayView").innerHTML = document.getElementById("welcomeView").innerHTML; //Else it shows the welcomeView.
	}
}

function confirmLogout(){
	var r=confirm("Are you sure you want to log out?");
	if (r==true){
		logout();
	}
}

//Working?
function logout(){

	var con = new XMLHttpRequest();

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            serverResponse = JSON.parse(event.target.responseText);

            if(serverResponse["success"]){
            	localStorage.removeItem("token");
				location.reload();
            }
        }
    }

    con.open("GET", "/signout?token=" + localStorage.token, true);
    con.send(null);

    //-----Gamla koden-----
	// result = serverstub.signOut(localStorage.token);
}


//Working?
function changePasswordClient(formVar){
	var oldPassword = formVar["oldPassword"].value;
	var newPassword = formVar["newPasswordChange"].value;

	var con = new XMLHttpRequest();

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            serverResponse = JSON.parse(event.target.responseText);
            document.getElementById("msgChangePassword").innerHTML = serverResponse["message"];
			formVar["oldPassword"].value = "";
			formVar["newPasswordChange"].value = "";
        }
    }
    con.open("POST", "/changepassword?token=" + localStorage.token, true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("old_password=" + oldPassword + "&new_password=" + newPassword);

    return false;

	//-----Gamla koden-----	
	// result = serverstub.changePassword(localStorage.token,oldPassword,newPassword);
	// document.getElementById("msgChangePassword").innerHTML = result["message"];
	// formVar["oldPassword"].value = "";
	// formVar["newPasswordChange"].value = "";
	// return false;
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

// function searchUser(formVar){
// 	var email = formVar["searchEmailField"].value;
// 	var result = serverstub.getUserDataByEmail(localStorage.token,email);
// 	clearBrowse();
// 	document.getElementById("browseResultMessages").innerHTML= "";
// 	document.getElementById("browseResult").style.display="none";
// 	if(result["success"]){
// 		loadPersonalData(email, false);
// 		globalBrowsedEmail=email;
// 		document.getElementById("browseResult").style.display="block";
// 	} else {
// 		document.getElementById("browseResultMessages").innerHTML = result["message"];
// 	}
// 	return false;
// }


function searchUser(formVar){
	var email = formVar["searchEmailField"].value;
	// var result = serverstub.getUserDataByEmail(localStorage.token,email);
	clearBrowse();
	document.getElementById("browseResultMessages").innerHTML= "";
	document.getElementById("browseResult").style.display="none";

	loadSearchUser(email);
	/*if(result["success"]){
		loadPersonalData(email, false);
		globalBrowsedEmail=email;
		document.getElementById("browseResult").style.display="block";
	} else {
		document.getElementById("browseResultMessages").innerHTML = result["message"];
	}*/
	return false;
}
 
function loadSearchUser(email){
	var token = localStorage.token;
	var prefix="browse_";
 
	var con = new XMLHttpRequest();
 
	con.onreadystatechange=function(event){
	    if (event.target.readyState==4 && event.target.status==200){
	        response = JSON.parse(event.target.responseText);
	        var success=response["success"];
	        var personalData = response["data"];
	        var message=response["message"];
	        if(success){
	        	globalBrowsedEmail=email;
	        	document.getElementById(prefix+"pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
				document.getElementById(prefix+"pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
				document.getElementById(prefix+"pdemail").innerHTML=personalData["email"];
				document.getElementById("browseResult").style.display="block";
				listAllMessages(email, false);
	        }
	        else{
	        	document.getElementById("browseResultMessages").innerHTML = message;
	        }
	    }
	}
	con.open("GET", "/getuserdatabyemail?token=" + token+"&email=" + email, true);
	con.send(null);
}

function loadSearchUser(email){
	var token = localStorage.token;
	var prefix="browse_";

	var con = new XMLHttpRequest();

	con.onreadystatechange=function(event){
	    if (event.target.readyState==4 && event.target.status==200){
	        response = JSON.parse(event.target.responseText);
	        var success=response["success"];
	        var personalData = response["data"];
	        var message=response["message"];
	        if(success){
	        	globalBrowsedEmail=email;
	        	document.getElementById(prefix+"pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
				document.getElementById(prefix+"pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
				document.getElementById(prefix+"pdemail").innerHTML=personalData["email"];
				document.getElementById("browseResult").style.display="block";
				listAllMessages(email, false);
	        }
	        else{
	        	document.getElementById("browseResultMessages").innerHTML = message;
	        }
	    }
	}
	con.open("GET", "/getuserdatabyemail?token=" + token+"&email=" + email, true);
	con.send(null);
}


function clearBrowse(){
	clearWall(false);
	clearPersonalData(false);

}

function clearPersonalData(isCurrUser){
	var prefix="";
	if(!isCurrUser){
		prefix="browse_";
	}

	document.getElementById(prefix+"pdname").innerHTML="";
	document.getElementById(prefix+"pdlocation").innerHTML="";
	document.getElementById(prefix+"pdemail").innerHTML="";
}

//Working?
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
		
		var con = new XMLHttpRequest();

	    con.onreadystatechange=function(event){
	        if (event.target.readyState==4 && event.target.status==200){
	            var serverResponse = JSON.parse(event.target.responseText);
	            bool=serverResponse["success"];
				if(bool){
					localStorage.token = serverResponse["data"]; //If login is successful, a session token is stored locally
					
					// var socket = new WebSocket("ws://localhost:5000/autorefresh");

					// socket.onopen = function(event){
					// 	alert("onopen");
					// 	socket.send("Handshake");
					// }

					// socket.onmessage = function(event){
					// 	alert("onmessage");
					// 	console.log(event.data);
					// }

					initiateSocket();
					loadView();
				} else {
					changeBorderColor(formVar["username"], 2);
					changeBorderColor(formVar["password"], 2);
					document.getElementById("msgLogin").innerHTML = serverResponse["message"];
				}

	        }
	    }

	    con.open("POST", "/signin", true);
	    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    con.send("email=" + username + "&password=" + password);
	    
	    //-----Gamla koden-----
		// serverstub.signIn(username, password);

		// bool=serverResponse["success"];
		// if(bool){
		// 	localStorage.token = serverResponse["data"]; //If login is successful, a session token is stored locally
		// } else {
		// 	changeBorderColor(formVar["username"], 2);
		// 	changeBorderColor(formVar["password"], 2);
		// 	document.getElementById("msgLogin").innerHTML = serverResponse["message"];
		// }
	}
	return false;
}

function initiateSocket(){
	
	var socket = new WebSocket("ws://localhost:5000/socketconnect");

	socket.onopen = function(event){
		socket.send(localStorage.token);
	}

	socket.onmessage = function(event){
		serverResponse = event.data;

		if(serverResponse == "notify"){
			refreshWall(true);
		}
	}

	socket.onerror = function(error){
		console.log("Socket Error: " + error);
	}
}


function getNameByEmail(email){
	var userData = serverstub.getUserDataByEmail(localStorage.token,email)["data"];
	return userData["firstname"] + " " + userData["familyname"];
}

function loadPersonalData(email, isCurrUser){
	// var personalData=null;
	var token = localStorage.token;
	var con = new XMLHttpRequest();
	var response;

	con.onreadystatechange=function(event){
	    if (event.target.readyState==4 && event.target.status==200){
	        response = JSON.parse(event.target.responseText);

	        personalData = response["data"];
	        document.getElementById(prefix+"pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
			document.getElementById(prefix+"pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
			document.getElementById(prefix+"pdemail").innerHTML=personalData["email"];
			listAllMessages(email, isCurrUser);

/* CONFLICT
	var prefix="";


	if(isCurrUser){
		// personalData = serverstub.getUserDataByToken(token)["data"];
		prefix = "";

		var con = new XMLHttpRequest();

	    con.onreadystatechange=function(event){
	        if (event.target.readyState==4 && event.target.status==200){
	            response = JSON.parse(event.target.responseText);
	            personalData = response["data"];
	            document.getElementById(prefix+"pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
				document.getElementById(prefix+"pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
				document.getElementById(prefix+"pdemail").innerHTML=personalData["email"];

				listAllMessages(email, isCurrUser);
	        }
*/
	    }
	}

	if(isCurrUser){
		// personalData = serverstub.getUserDataByToken(token)["data"];
		prefix = "";
	    con.open("GET", "/getuserdatabytoken?token=" + token, true);
	    con.send(null);
	}
	else{
		//personalData = serverstub.getUserDataByEmail(token, email)["data"];
		prefix = "browse_";
		con.open("GET", "/getuserdatabyemail?token=" + token+"&email=" + email, true);
	    con.send(null);
	}
	
	//-----Gamla koden-----
	// document.getElementById(prefix+"pdname").innerHTML=personalData["firstname"]+" "+personalData["familyname"];
	// document.getElementById(prefix+"pdlocation").innerHTML=personalData["city"]+", "+personalData["country"];
	// document.getElementById(prefix+"pdemail").innerHTML=personalData["email"];

	// listAllMessages(email, isCurrUser);
}

function removeLoginMsg(){
	document.getElementById("msgLogin").innerHTML = "";
}


//Working
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

		var con = new XMLHttpRequest();

	    con.onreadystatechange=function(event){
	        if (event.target.readyState==4 && event.target.status==200){
	            serverResponse = JSON.parse(event.target.responseText);
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
    	}

	    con.open("POST", "/signup", true);
	    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    con.send("email=" + formData.email +
	            "&password=" + formData.password +
	            "&firstname=" + formData.firstname +
	            "&familyname=" + formData.familyname +
	            "&gender=" + formData.gender +
	            "&city=" + formData.city +
	            "&country=" + formData.country);



	    //-----Gamla koden-----
		// var serverResponse = serverstub.signUp(formData);
		// var successBool=serverResponse["success"];

		// if(!successBool){ //if user already exists
		// 	changeBorderColor(formVar["email"], 2);  //change the border color to red
		// 	createSignupMessage(serverResponse["message"], "errormessage");
		// }
		// else{	//new user, clear the form fields
		// 	for(i =0; i < formVar.length; i++) {
		// 		if(formVar[i]!=formVar["submit"]){
		// 			formVar[i].value="";
		// 		}
		// 	}
		// 	formVar["gender"].value="male";
		// 	createSignupMessage(serverResponse["message"], "successmessage");
		// }
	}
	return false;
}

/*
Will use the serverstub to store a message in the specified users wall storage with the attributes fromUser and message.
*/
function sendToWall(formVar, toUserEmail){

	var con = new XMLHttpRequest();

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
            alert(response["message"]);
			formVar["wallInputField"].value = "";

			if(toUserEmail == localStorage.globalUserEmail){
				refreshWall(true);
			}
			else{
				refreshWall(false);
			}
        }
    }

    con.open("POST", "/postmessage", true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("token=" + localStorage.token + "&message=" + formVar["wallInputField"].value + "&email=" + toUserEmail);


	// serverResponse = serverstub.postMessage(localStorage.token, formVar["wallInputField"].value, toUserEmail);
	// refreshWall(false);
	// formVar["wallInputField"].value = "";
	
	return false; //serverResponse["success"];
}

/*
Retrieves the users messages from the 'server'
*/
function retrieveMessages(email){
	var userToken = localStorage.token;
	serverResponse = serverstub.getUserMessagesByEmail(userToken, email);
	// messages = serverResponse["data"];

	return serverResponse;
}

/*
Called when the client wants to view all messages on their wall.
*/

function listAllMessages(email, isCurrUser){
	// response = retrieveMessages(email);

	var con = new XMLHttpRequest();

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            serverResponse = JSON.parse(event.target.responseText);
            messages = serverResponse["data"];
			if(serverResponse["success"]==true){
				for (var i=messages.length-1; i >= 0; i--){
					addMessageToWall(messages[i], isCurrUser);
				}
			}
		}
	}
    con.open("GET", "/getusermessagesbyemail?token=" + localStorage.token + "&email=" + email, true);
    con.send();

	// messages = response["data"];

	// if(response["success"]==true){
	// 	for (var i=0; i < messages.length; i++){
	// 		addMessageToWall(messages[i], isCurrUser);
	// 	}
	// 	return true;
	// }
	// else{
	// 	return false;
	// }
}

/*
Adds/appends a single message to the wall where "var message = {"writer": fromEmail, "content": content};" is
the definition of a message defined on the server-side.
*/
function addMessageToWall(messageVar, isCurrUser){
	var messageElement = document.createElement("label");
	
	// var userEmail = serverstub.tokenToEmail(localStorage.token);
	var prefix="";

	if(messageVar["writer"]==localStorage.globalUserEmail){
		messageElement.innerHTML="<span class='msgPoster'>Me</span>: "+messageVar["content"];
	}
	else{
		messageElement.innerHTML="<span class='msgPoster'>"+messageVar["sender"]+"</span>: "+messageVar["content"]; // getNameByEmail(messageVar["sender"])
	}

	if(!isCurrUser){
		prefix="browse_";
	}

    document.getElementById(prefix+"wallMessages").appendChild(messageElement);
}

/*
Clears the wall of messages. Used for refreshing the wall.
*/
function clearWall(isCurrUser){
	var prefix="";
	if(!isCurrUser){
		prefix="browse_";
	}
	 while (document.getElementById(prefix+"wallMessages").hasChildNodes()){
    	document.getElementById(prefix+"wallMessages").removeChild(document.getElementById(prefix+"wallMessages").childNodes[0]);
    }
}

/*
Refreshes the users home wall or a browsed wall, ie loads all messages again and displays.
Could/should 
*/
function refreshWall(isCurrUser){
	var email;
	clearWall(isCurrUser);
	if(isCurrUser){
		// email=serverstub.tokenToEmail(localStorage.token);
		email=localStorage.globalUserEmail;
		loadPersonalData(email,isCurrUser);
	}
	else{
		email=globalBrowsedEmail;
		loadSearchUser(email);
	}
	// loadPersonalData(email, isCurrUser);
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

function changeBorderColor(inputfield, color){
	if(color==1){  //1 gives the standard black border color
		inputfield.className="dotBorder";
	} else { 	//anything else and we change to red border color
		inputfield.className="invalidEntry";
	}
}



