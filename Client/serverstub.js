/**
 * Created by TDDD24.
 */

var serverstub = new Object();
var users = null;
var loggedInUsers = null;

if (localStorage.getItem("users") == null) {
    users = {};
}else users = JSON.parse(localStorage.getItem("users"));

if (localStorage.getItem("loggedinusers") == null) {
    loggedInUsers = {};
}else loggedInUsers = JSON.parse(localStorage.getItem("loggedinusers"));

// local methods
serverstub.persistUsers = function(){
    localStorage.setItem("users", JSON.stringify(users));
};
serverstub.persistLoggedInUsers = function(){
    localStorage.setItem("loggedinusers", JSON.stringify(loggedInUsers));
};
serverstub.tokenToEmail = function(token){
    return loggedInUsers[token];
};
serverstub.copyUser = function(user){
    return JSON.parse(JSON.stringify(user));
};

// Public methods
serverstub.signIn = function(email, password){
    
    var con = new XMLHttpRequest();
    var repsonse;

    con.onreadystatechange=function(event){
        if (event.readyState==4 && event.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("POST", "/signin", true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("email=" + email + "&password=" + password);

    return response;
};

serverstub.postMessage = function(token, content, toEmail){
      
    var con = new XMLHttpRequest();
    var repsonse;

    con.onreadystatechange=function(event){
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
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
        if (event.readyState==4 && event.status==200){
            response = JSON.parse(event.target.responseText);
        }
    }

    con.open("POST", "/changepassword?token=" + token, true);
    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con.send("old_password=" + oldPassword + "&new_password=" + newPassword);

    return response;
};