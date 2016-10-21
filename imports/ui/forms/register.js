import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./register.html";

Template.Register.events({
    "submit form": function(event) {
        event.preventDefault();

        var fullName = $("#full-name").val();
        var emailAddress = $("#register-email").val();
        //var password = Math.random().toString(36).substr(2, 8);
        var password = $("#password").val();
        var confirmPassword = $("#confirm-password").val();
        var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailAddress.match(regEx)) {
            document.getElementById("error-msg").innerHTML = "Invalid email address format.";
        } else if (password !== confirmPassword) {
            document.getElementById("error-msg").innerHTML = "Passwords don't match.";
        } else {
            if ($.trim(password).length < 8) {
                document.getElementById("error-msg").innerHTML = "Password must be at least 8 characters.";
            } else {
                var userId = Accounts.createUser({
                    email: emailAddress,
                    password: password
                }, function(error) {
                    if (error) {
                        document.getElementById("error-msg").innerHTML = error.reason;
                    } else {
                        fullName = fullName.trim().replace(/\s\s+/g, ' ');

                        Meteor.call("usersProfile.insert", { fullName });
                        
                        FlowRouter.go("/dashboard");
                    }
                });  
            }
        }  
    }
});