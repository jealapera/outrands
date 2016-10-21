FlowRouter.route("/", {
	name: "landing-page",
	action() {
		if (!Meteor.userId()) {
			BlazeLayout.render("MainLayout", {
				header: "HeaderLanding",
				main: "LandingPage",
				footer: "FooterLanding"
			});
		} else {
			FlowRouter.go("/dashboard");
		}
	}
});

FlowRouter.route("/terms", {
	name: "terms",
	action() {
		if (!Meteor.userId()) {
			BlazeLayout.render("MainLayout", {
				header: "HeaderLanding",
				main: "TermsLanding",
				footer: "FooterLanding"
			});
		} else {
			FlowRouter.go("/dashboard");
		}
	}
});

FlowRouter.route("/privacy", {
	name: "privacy",
	action() {
		if (!Meteor.userId()) {
			BlazeLayout.render("MainLayout", {
				header:"HeaderLanding",
				main: "PrivacyLanding",
				footer: "FooterLanding"
			});
		} else {
			FlowRouter.go("/dashboard");
		}
	}
});

FlowRouter.route("/register", {
	name: "register",
	action() {
		if (!Meteor.userId()) {
			BlazeLayout.render("MainLayout", {
				header: "HeaderForms",
				main: "Register",
				footer: "FooterForms"
			});
		} else {
			FlowRouter.go("/dashboard");
		}
	}
});

FlowRouter.route("/login", {
	name: "login",
	action() {
		if (!Meteor.userId()) {
			BlazeLayout.render("MainLayout", {
				header: "HeaderForms",
				main: "Login",
				footer: "FooterForms"
			});
		} else {
			FlowRouter.go("/dashboard");
		}
	}
});

FlowRouter.route("/view-profile/:_id", {
	name: "view-profile",
	data: function() { 
		return UsersProfile.findOne(this.params._id); 
	},
	action(params) {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "ProfileView",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/dashboard", {
	name: "dashboard",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "Dashboard",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/post-errand", {
	name: "post-errand",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "PostErrand",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/view-errand/:_id", {
	name: "view-errand",
	data: function() { 
		return ErrandPosts.findOne(this.params._id);
	},
	action: function(params) {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "ErrandView",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/errand-tracking/:_id", {
	name: "errand-tracking",
	data: function() {
		return RunningErrands.findOne(this.params._id);
	},
	action: function(params) {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "ErrandTrackingActivity",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/errand-activities", {
	name: "errand-activities",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "ErrandActivities",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/favorite-runners", {
	name: "favorite-runners",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "MyFavoriteRunners",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/my-runners", {
	name: "my-runners",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "MyRunners",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/notifications", {
	name: "notifications",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "Notifications",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/help", {
	name: "help",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "Help",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/terms-logged-in", {
	name: "terms",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "TermsUser",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});

FlowRouter.route("/privacy-logged-in", {
	name: "privacy",
	action() {
		if (Meteor.userId()) {
			BlazeLayout.render("UserMainLayout", {
				sidebarUser: "SideBar",
				headerUser: "HeaderUser",
				mainUser: "PrivacyUser",
				footerUser: "FooterUser"
			});
		} else {
			FlowRouter.go("/");
		}
	}
});