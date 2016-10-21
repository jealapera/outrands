import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./users-profile.html";

Template.ProfileView.onRendered(function() {
	var instance = this;

	instance.date = new ReactiveVar(new Date());

	instance.subscribe("errandPosts", function() {
		instance.autorun(function() {
			var posts = ErrandPosts.find({ status: "open" }).fetch();
			var date = instance.date.get();

			posts.forEach(function(post) {

				if (date > post.dueDate) {
					post.result = true;

					var postId = post.postId;
					var postOwnerId = post.userId;
					var notif = "errand post";
					var notifOn = "has already expired";
					var notifFor = postOwnerId;
					var notifFrom = Meteor.userId();

					Meteor.call("errandPosts.expired", postId);
				}
			});	
		});
	});
});

Template.ProfileView.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(8);

	instance.autorun(function() {
		var limit = instance.limit.get();

		var subscription = instance.subscribe("usersProfile");
		var subscription2 = instance.subscribe("users");

		var subscription3 = instance.subscribe("errandPosts", {
	    	limit: limit, 
	    	sort: { postDate: -1 }
	    });

		if (subscription3.ready()) {
			instance.loaded.set(limit);
	    }

	    var subscription4 = instance.subscribe("runningErrands");
	    var subscription5 = instance.subscribe("errandBidders");

	});

	instance.userProfile = function() {
		var userId = FlowRouter.getParam("_id");
		var profile = UsersProfile.findOne({ userId: userId });

		if (profile) {
			var name = profile.fullName;
			var split = name.split(" ");
			var initials = "";
				
				if (split.length > 0) {
            	initials += split[0].charAt(0);
            	
            	if(split.length > 1) {
            		initials += split[1].charAt(0);
            	}

            	profile.initials = initials;
        	}
		}     

		return profile;
	}

	instance.emailAddress = function() {
		var userId = FlowRouter.getParam("_id");
		var users = Meteor.users.findOne({ _id: userId });

		if (users) {
			var emailAdress = users.emails[0].address;

			return emailAdress;
		}
	}

	instance.getBossRating = function() {
		var userId = FlowRouter.getParam("_id");
		var errandBosses = RunningErrands.find({ bossId: userId });

		eb = errandBosses.fetch();
		eb.bossRateTotal = 0;

		eb.forEach(function(errand, i) {
			var bossRate = errand.bossRate;

			eb.bossRateTotal = eb.bossRateTotal + bossRate;
		});
		
		var bossRateTotal = eb.bossRateTotal;
		var noOfErrands = eb.length;

		var bossRating = bossRateTotal / noOfErrands;

		Meteor.call("usersProfile.updateBossRate", { userId, bossRating });

		if (isNaN(bossRating)) {
			return 0;
		} else {
			return bossRating;
		}
	}

	instance.bossRate = function() {
		var userId = FlowRouter.getParam("_id");
		var user = UsersProfile.findOne({ userId: userId });

		if (user) {
			var rate = user.bossRating;

			if (rate === 0 || isNaN(rate)) {
				user.star1 = "fa-star-o";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 0 && rate < 1) {
				user.star1 = "fa-star-half-o";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 1) {
				user.star1 = "fa-star";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 1 && rate < 2) {
				user.star1 = "fa-star";
				user.star2 = "fa-star-half-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 2) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 2 && rate < 3) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star-half-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 3) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 3 && rate < 4) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star-half-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 4) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 4 && rate < 5) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star-half-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 5) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			}
		}

		return user;
	}

	instance.getRunnerRating = function() {
		var userId = FlowRouter.getParam("_id");
		var errandRunners = RunningErrands.find({ runnerId: userId });

		er = errandRunners.fetch();
		er.runnerRateTotal = 0;

		er.forEach(function(errand, i) {
			var runnerRate = errand.runnerRate;

			er.runnerRateTotal = er.runnerRateTotal + runnerRate;
		});
		
		var runnerRateTotal = er.runnerRateTotal;
		var noOfErrands = er.length;
		var runnerRating = runnerRateTotal / noOfErrands;

		Meteor.call("usersProfile.updateRunnerRate", { userId, runnerRating });

		if (isNaN(runnerRating)) {
			return 0;
		} else {
			return runnerRating;
		}
	}

	instance.runnerRate = function() {
		var userId = FlowRouter.getParam("_id");
		var user = UsersProfile.findOne({ userId: userId });

		if (user) {
			var rate = user.runnerRating;

			if (rate === 0 || isNaN(rate)) {
				user.star1 = "fa-star-o";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 0 && rate < 1) {
				user.star1 = "fa-star-half-o";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 1) {
				user.star1 = "fa-star";
				user.star2 = "fa-star-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 1 && rate < 2) {
				user.star1 = "fa-star";
				user.star2 = "fa-star-half-o";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 2) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 2 && rate < 3) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star-half-o";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 3) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 3 && rate < 4) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star-half-o";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 4) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate > 4 && rate < 5) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star-half-o";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			} else if (rate === 5) {
				user.star1 = "fa-star";
				user.star2 = "fa-star";
				user.star3 = "fa-star";
				user.star4 = "fa-star";
				user.star5 = "fa-star";
				user.star6 = "fa-star-o";
				user.star7 = "fa-star-o";
				user.star8 = "fa-star-o";
				user.star9 = "fa-star-o";
				user.star10 = "fa-star-o";
			}
		}

		return user;
	}

	instance.getRunnerIncome = function() {
		var userId = FlowRouter.getParam("_id");
		var runners = RunningErrands.find({ runnerId: userId, status: "completed" }).fetch();

		if (runners) {
			var runnerIds = runners.map(function(r) { return r.runnerId });
			var bidders = ErrandBidders.find({ userId: { $in: runnerIds } }).fetch();
			var prices = bidders.map(function(p) { return p.price });
			var income = 0;

			prices.forEach(function(p) {
				income = income + p;
			});

			Meteor.call("usersProfile.updateIncome", { userId, income });

			return income;
		}
	}

	instance.errandPosts = function() {
		var userId = FlowRouter.getParam("_id");
    	var posts = ErrandPosts.find({ userId: userId }, { limit: instance.loaded.get(), sort: { postDate: -1 } });

    	var p = posts.fetch();
    	
    	p.forEach(function(post) {
    		if (post.status === "expired") {
    			post.expiration = "This errand has already expired.";
    			post.color = "#f16362";
    		} else if (post.status === "open") {
    			post.color = "#69f0ae";
    		} else if (post.status === "running") {
    			post.color = "#f16362";
    			post.isDisabled = true;
    		} else if (post.status === "cancelled") {
    			post.color = "#448aff";
    			post.isDisabled = true;
    		} else {
    			post.color = "#384d68";
    			post.isDisabled = true;
    		}
    	});

		return p;
  	}

  	instance.isOwner = function() {
		var userId = FlowRouter.getParam("_id");
		//var owner = UsersProfile.findOne({ userId: userId });

		if (Meteor.userId() === userId) {
			return true;
		}
	}
});

Template.ProfileView.helpers({
	userProfile: function() {
		return Template.instance().userProfile();
	},
	getRunnerIncome: function() {
		return Template.instance().getRunnerIncome();
	},
	emailAddress: function() {
		return Template.instance().emailAddress();
	},
	getBossRating: function() {
		return Template.instance().getBossRating();
	},
	bossRate: function() {
		return Template.instance().bossRate();
	},
	getRunnerRating: function() {
		return Template.instance().getRunnerRating();
	},
	runnerRate: function() {
		return Template.instance().runnerRate();
	},
	errandPosts: function() {
		return Template.instance().errandPosts();
	},
  	hasMorePosts: function() {
    	return Template.instance().errandPosts().length >= Template.instance().limit.get();
  	},
  	noPosts: function() {
    	return Template.instance().errandPosts().length === 0;
  	},
  	isOwner: function() {
  		return Template.instance().isOwner();
  	}
});

Template.ProfileView.events({
	"click #show--more": function(event, instance) {
		event.preventDefault();

    	// get current value for limit, i.e. how many posts are currently displayed
    	var limit = instance.limit.get();

    	// increase limit by 3 and update it
    	limit += 3;
    	instance.limit.set(limit);
	}
});

Template.CurrentUserErrandPost.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.isOwner = function() {
		var userId = FlowRouter.getParam("_id");
		//var owner = UsersProfile.findOne({ userId: userId });

		if (Meteor.userId() === userId) {
			return true;
		}
	}

	instance.isOpen = function() {
		return Template.instance().data.status === "open";
	}

	instance.expired = function() {
		return Template.instance().data.expired === true;
	}
});

Template.CurrentUserErrandPost.helpers({
	isOwner: function() {
		return Template.instance().isOwner();
	},
	isOpen: function() {
		return Template.instance().isOpen();
	},
	expired: function() {
		return Template.instance().expired();
	}
});

Template.CurrentUserErrandPost.events({
	"click #edit": function() {
		Modal.show("ErrandPostEdit");
	},
	"click #delete": function(event) {
		Modal.show("DeleteConfirmation");
	},
	"click #repost": function(event) {
		Modal.show("ExpiredErrand");
	}
});

Template.ExpiredErrand.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	var _self = $(event.target);
	var parent = _self.closest(".profile-errand__actions");
	var postId = parent.find(".button").data("post-id");

	instance.autorun(function() {
		var subscription = instance.subscribe("errandView", postId);
	});

	instance.repostExpired = function() {
		var post = ErrandPosts.findOne({ postId: postId });

		return post;
	}
});

Template.ExpiredErrand.helpers({
	repostExpired: function() {
		return Template.instance().repostExpired();
	}
});

Template.ExpiredErrand.events({
	"focus #due-date": function(e, template) {
		var f = Template.instance().$("#due-date");
		var date = new Date();
		var max = moment(date).add(2, "d").toDate();

		f.bootstrapMaterialDatePicker({ format: "MMMM D, YYYY h:mm A", minDate: date, maxDate: max });
	},
	"click #repost-expired": function(event){
		event.preventDefault();

      	var _self = $(event.target);
		var parent = _self.closest(".modal-footer");
		var postId = parent.find(".button").data("post-id");

		var dueDate = $("#due-date").val();

		dueDate = new Date(dueDate);

		Meteor.call("errandPosts.repostExpired", { postId, dueDate });
		Meteor.call("errandBidders.clear", postId);

		Modal.hide("ExpiredErrand");
	}
});

Template.ErrandPostEdit.onRendered(function() {
	var s = Template.instance().$("#errand-category");
	s.select2();

	var s2 = Template.instance().$("#post-type");
	s2.select2();
});

Template.ErrandPostEdit.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	var _self = $(event.target);
	var parent = _self.closest(".profile-errand__actions");
	var postId = parent.find(".button").data("post-id");

	instance.autorun(function() {
		var subscription = instance.subscribe("errandView", postId);
		var subscription2 = instance.subscribe("favoriteRunners");
	});

	instance.editErrand = function() {
		var post = ErrandPosts.findOne({ postId: postId });

		return post;
	}

	instance.hasFavoriteRunners = function() {
		var userId = Meteor.userId();
		var runners = FavoriteRunners.find({ userId: userId });

		return runners;
	}
});

Template.ErrandPostEdit.helpers({
	editErrand: function() {
		return Template.instance().editErrand();
	},
	hasFavoriteRunners: function() {
		return Template.instance().hasFavoriteRunners().count() > 0;
	}
});

Template.ErrandPostEdit.events({
	"focus #due-date": function(event, template) {
		var f = Template.instance().$("#due-date");
		var date = new Date();
		var max = moment(date).add(2, "d").toDate();

		f.bootstrapMaterialDatePicker({ format: "MMMM D, YYYY h:mm A", minDate: date, maxDate: max });
	},
	"click #add-item": function(event) {
		event.preventDefault();

		var item = $("#item").val();

		if(item !== ""){
			var newItem = $(document.createElement("li")).attr("class", "errand-form__list-item");

	 		newItem.after().html("<i class='fa fa-caret-right errand-form__check-ic'></i>"
			+ item + "<i class='fa fa-close errand-form__delete-ic' data-></i>");

			newItem.appendTo("#list");
			
	 		$("#item").val("");
	 	}
	},
	"click .errand-form__delete-ic": function(event) {
		$(event.target).closest(".errand-form__list-item").remove();
	},
	"click #save": function(event){
		event.preventDefault();

		var items = [];

		$(".errand-form__list-item").each(function(index) {
			//console.log( index + ": " + $(this).text());
			items.push($(this).text());
		});

      	var title = $("#title").val();
      	var description = $("#description").val();
      	var dueDate = $("#due-date").val();
      	var serviceFee = parseFloat($("#service-fee").val());
      	var category = $("#errand-category").val();

      	var _self = $(event.target);
		var parent = _self.closest(".modal-footer");
		var postId = parent.find(".button").data("post-id");

		Meteor.call("errandPosts.update", { postId, title, description, items, dueDate, serviceFee, category });

		Modal.hide("ErrandPostEdit");
	}
});

Template.DeleteConfirmation.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	var _self = $(event.target);
	var parent = _self.closest(".profile-errand__actions");
	var postId = parent.find(".button").data("post-id");

	instance.autorun(function() {
		var subscription = instance.subscribe("errandView", postId);
	});

	instance.deleteErrand = function() {
		var post = ErrandPosts.findOne({ postId: postId });

		return post;
	}
});

Template.DeleteConfirmation.helpers({
	deleteErrand: function() {
		return Template.instance().deleteErrand();
	}
});

Template.DeleteConfirmation.events({
	"click #yes": function(event){
		event.preventDefault();

      	var _self = $(event.target);
		var parent = _self.closest(".modal-footer");
		var postId = parent.find(".btn").data("post-id");

		Meteor.call("errandPosts.delete", postId);
		Modal.hide("DeleteConfirmation");
	},
	"click #no": function() {
		Modal.hide("DeleteConfirmation");
	}
});

Template.FloatingButton.events({
    "click #post-errand": function(){
		$(".sidebar-o").removeClass("open");
        FlowRouter.go("/post-errand");
    }
});