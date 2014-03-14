/**
 * Created by TDDD24.
 */

var serverstub = new Object();
// var users = null;
// var loggedInUsers = null;

// if (localStorage.getItem("users") == null) {
//     users = {};
// }else users = JSON.parse(localStorage.getItem("users"));

// if (localStorage.getItem("loggedinusers") == null) {
//     loggedInUsers = {};
// }else loggedInUsers = JSON.parse(localStorage.getItem("loggedinusers"));

// // local methods
// serverstub.persistUsers = function(){
//     localStorage.setItem("users", JSON.stringify(users));
// };
// serverstub.persistLoggedInUsers = function(){
//     localStorage.setItem("loggedinusers", JSON.stringify(loggedInUsers));
// };
// serverstub.tokenToEmail = function(token){
//     return loggedInUsers[token];
// };
// serverstub.copyUser = function(user){
//     return JSON.parse(JSON.stringify(user));
// };

serverstub.finishSignIn = function(serverResponse){
    bool=serverResponse["success"];
    console.log(bool);
    if(bool){
        localStorage.token = serverResponse["data"]; //If login is successful, a session token is stored locally
    } else {
        changeBorderColor(document.getElementById("loginForm")["username"], 2);
        changeBorderColor(document.getElementById("loginForm")["password"], 2);
        document.getElementById("msgLogin").innerHTML = serverResponse["message"];
    }
}

// Public methods
serverstub.signIn = function(email, password){
    
    var con = new XMLHttpRequest();
    var serverResponse;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            var serverResponse = JSON.parse(event.target.responseText);
            console.log(serverResponse);
            // If we want to do it this way, we have to call another function inside this callback that performs whatever we want it to with the response provided. Worst solution ever.
            serverstub.finishSignIn(serverResponse);
        }
    }

    console.log("before");

    con.open("POST", "/signin", true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("email=" + email + "&password=" + password);
    
    console.log("after");

};

serverstub.postMessage = function(token, content, toEmail){
      
    var con = new XMLHttpRequest();
    var repsonse;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("POST", "/postmessage", true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("token=" + token + "&message=" + content + "&email=" + toEmail);

    return response;
};

/*
Returns an object containing the field email, firstname, 
familyname, gender, city and country. 
*/
serverstub.getUserDataByToken = function(token){
    
    var con = new XMLHttpRequest();
    var response;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("GET", "/getuserdatabytoken?token=" + token, true);
    con.send(null);

    return response;
};

serverstub.getUserDataByEmail = function(token, email){
    
    var con = new XMLHttpRequest();
    var response;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("GET", "/getuserdatabyemail?token=" + token + "&email=" + email, true);
    con.send(null);

    return response;
};
serverstub.getUserMessagesByToken = function(token){
    var con = new XMLHttpRequest();
    var response;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("GET", "/getuserdatabyemail?token=" + token, true);
    con.send();

    return response;
};
serverstub.getUserMessagesByEmail = function(token, email){
    var con = new XMLHttpRequest();
    var response;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("GET", "/getuserdatabyemail?token=" + token + "email=" + email, true);
    con.send();

    return response;
};
serverstub.signOut = function(token){
    
    var con = new XMLHttpRequest();
    var response;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("GET", "/signout?token=" + token, true);
    con.send(null);

    return response;
};

serverstub.signUp = function(formData){ // {email, password, firstname, familyname, gender, city, country}
    
    var con = new XMLHttpRequest();
    var repsonse;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
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

    return response;
};

serverstub.changePassword = function(token, oldPassword, newPassword){
    
    var con = new XMLHttpRequest();
    var repsonse;

    con.onreadystatechange=function(event){
        if (event.target.readyState==4 && event.target.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("POST", "/changepassword?token=" + token, true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("old_password=" + oldPassword + "&new_password=" + newPassword);

    return response;
};