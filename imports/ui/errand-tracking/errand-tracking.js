import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './errand-tracking.html';

Template.ErrandTrackingActivity.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();
});

Template.ErrandTrackingActivity.onCreated(function() {
	var instance = this;
	instance.state = new ReactiveDict();
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(24);
	instance.timeAgo = new ReactiveVar();

	instance.autorun(function() {
		var postId = FlowRouter.getParam("_id");

		var subscription = instance.subscribe("errandView", postId);
		var subscription2 = instance.subscribe("errandBidders", postId);
		var subscription3 = instance.subscribe("runningErrands", postId);

		var limit = instance.limit.get();

		var subscription4 = instance.subscribe("messages", postId, {
	    	limit: limit, 
	    	sort: { date: -1 }});

		if (subscription4.ready()) {
			instance.loaded.set(limit);
		}
	});

	instance.errandView = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({postId: postId});
		
		if (posts) {
			if (posts.status === "open") {
				$(".errand-view__status").addClass("green");
			} else if (posts.status === "running") {
				$(".errand-view__status").addClass("red");
			} else if (posts.status === "cancelled"){
				$(".errand-view__status").addClass("blue");
			} else {
				$(".errand-view__status").css("color", "#384d68");
			}

			return posts;
		}
	}

	// instance.decidedServiceFee = function() {
	// 	var postId = FlowRouter.getParam("_id");
	// 	var errand = RunningErrands.findOne({postId: postId});

	// 	if (errand) {
	// 		var runner = errand.runnerId;
	// 		var acceptedBidder = ErrandBidders.findOne({userId: runner});
	// 		var acceptedBidPrice = parseFloat(acceptedBidder.price).toFixed(2);

	// 		return acceptedBidPrice;
	// 	}
	// }

	instance.getPostOwnerInfo = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId});

		if (posts) {
			var postOwner = UsersProfile.findOne({ userId: posts.userId });

			if (postOwner) {
				var name = postOwner.fullName;
				var split = name.split(" ");
				var initials = "";
 				
 				if (split.length > 0) {
                	initials += split[0].charAt(0);
                	
                	if(split.length > 1) {
                		initials += split[1].charAt(0);
                	}

                	postOwner.initials = initials;
            	}
			}

			return postOwner;
		}
	}

	instance.isOwner = function() {
		var userId = Meteor.userId();
		var owner = ErrandPosts.findOne({ userId: userId });

		return owner;
	}

	instance.messages = function() {
		var postId = FlowRouter.getParam("_id");
		var messages = Messages.find({ postId: postId }, { sort: { date: 1 }});

		var msgs = messages.fetch();

		msgs.forEach(function(msg) {
			var name = msg.name;
			var split = name.split(" ");
			var initials = "";
				
				if (split.length > 0) {
            	initials += split[0].charAt(0);
            	
            	if(split.length > 1) {
            		initials += split[1].charAt(0);
            	}

            	msg.initials = initials;
        	}
		});

		return msgs;
	}

	instance.runningErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "running") {
				return true;
			}
		}
	}

	instance.completedErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "completed") {
				return true;
			}
		}
	}

	instance.cancelledErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "cancelled") {
				return true;
			}
		}
	}
});

Template.ErrandTrackingActivity.helpers({
	errandView: function() {
		return Template.instance().errandView();
	},
	// decidedServiceFee: function() {
	// 	return Template.instance().decidedServiceFee();
	// },
	getPostOwnerInfo: function() {
		return Template.instance().getPostOwnerInfo();
	},
	isOwner: function() {
		return Template.instance().isOwner();
	},
	messages: function() {
		return Template.instance().messages();
	},
	hasMoreMessages: function() {
		return Template.instance().messages().length >= Template.instance().limit.get();
	},
	noMessages: function() {
		return Template.instance().messages().length === 0;
	},
	runningErrand: function() {
		return Template.instance().runningErrand();
	},
	completedErrand: function() {
		return Template.instance().completedErrand();
	},
	cancelledErrand: function() {
		return Template.instance().cancelledErrand();
	}
});

Template.ErrandTrackingActivity.events({
	"click #done": function() {
		Modal.show("SubmitForm");
	},
   "click #cancel": function() {
        Modal.show("CancelForm");
    },
	"click #send": function (event) {
		var userId = Meteor.userId();
		var user = UsersProfile.findOne({userId: userId});

		if (user) {
			var name = user.fullName;
		}

		var message = $("#message").val();
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({postId: postId});

		if (errand) {
			var bossId = errand.bossId;
			var runnerId = errand.runnerId;

			if (userId === bossId) {
				var userType = "boss";
				var notifFor = runnerId;
				var notifFrom = userId;
			} else if (userId === runnerId) {
				var userType = "runner";
				var notifFor = bossId;
				var notifFrom = runnerId;
			}
		}

		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = bossId;
		var notif = "has a new message for you on this";
		var notifOn = "errand activity";
		
		Meteor.call("messages.insert", { name, message, userId, userType, postId });
		Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });

		$("#message").val("");

		var chatList = $(".errand-view__chat-list");

		chatList.scrollTop(chatList[0].scrollHeight);
	},
	"click #show-more-msg": function(event, instance) {
		event.preventDefault();

		var limit = instance.limit.get();

		limit += 4;
		instance.limit.set(limit);

		var chatList = $(".errand-view__chat-list");

		chatList.animate({ scrollTop: 0 }, "slow");
	}
});

Template.SubmitForm.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();
});

var runnerRate = 0;

Template.SubmitForm.events({
	"click #star1": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");

		$("#rate2").removeClass("fa-star");
		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate2").addClass("fa-star-o");
		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRate = 1;
	},
	"click #star2": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");

		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRate = 2;
	},
	"click #star3": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");

		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRate = 3;
	},
	"click #star4": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");

		$("#rate5").removeClass("fa-star");

		$("#rate5").addClass("fa-star-o");

		runnerRate = 4;
	},
	"click #star5": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate5").removeClass("fa-star-o");

		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");
		$("#rate5").addClass("fa-star");

		runnerRate = 5;
	},
	"click #rate-runner": function() {
		var postId = FlowRouter.getParam("_id");
		parseInt(runnerRate);
		var comment = $("#comment-runner").val();
		var userId = Meteor.userId();
		var runnerId = $(".errand-view__bidders-item").find(".title").data("user-id");
		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = userId;
		var notif = "has rated you and added a comment on this";
		var notifOn = "errand that you have completed";
		var notifFor = runnerId;
		var notifFrom = userId;

		if (runnerRate == 0) {
			document.getElementById("comment-error").innerHTML = "Required to rate the runner.";
		} else if (!isNaN(comment)) {
			document.getElementById("comment-error").innerHTML = "Your comment is required.";
		} else {
			Meteor.call("runningErrands.runnerRate", { postId, runnerRate, comment });
			Meteor.call("errandPosts.completed", postId);
			Meteor.call("runningErrands.completed", postId);
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });
				
			Modal.hide("SubmitForm");

			FlowRouter.go("view-errand", { _id: postId });
		}
	}
});

Template.CancelForm.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();
});

Template.CancelForm.events({
	"click #submit": function() {
		var postId = FlowRouter.getParam("_id");
		var reason = $("#reason").val();
		var userId = Meteor.userId();
		var runnerId = $(".errand-view__bidders-item").find(".title").data("user-id");
		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = userId;
		var notif = "has cancelled this";
		var notifOn = "errand activity";
		var notifFor = runnerId;
		var notifFrom = userId;

		if (!$.trim(reason).length > 0) {
			document.getElementById("error-msg").innerHTML = "Your reason is required.";
		} else if (!isNaN(reason)) {
			document.getElementById("error-msg").innerHTML = "Reason should have letters.";
		} else {
			Meteor.call("errandPosts.cancel", postId);
			Meteor.call("runningErrands.cancel", {postId: postId, reason: reason});
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });			

			Modal.hide("CancelForm");
		}
	}
});

var runnerRateCancel = 0;

Template.RateRunnerCancel.events({
	"click #star1": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");

		$("#rate2").removeClass("fa-star");
		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate2").addClass("fa-star-o");
		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRateCancel = 1;
	},
	"click #star2": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");

		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRateCancel = 2;
	},
	"click #star3": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");

		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		runnerRateCancel = 3;
	},
	"click #star4": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");

		$("#rate5").removeClass("fa-star");

		$("#rate5").addClass("fa-star-o");

		runnerRateCancel = 4;
	},
	"click #star5": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate5").removeClass("fa-star-o");

		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");
		$("#rate5").addClass("fa-star");

		runnerRateCancel = 5;
	},
	"click #rate-runner-cancel": function() {
		var postId = FlowRouter.getParam("_id");
		var runnerRate = parseInt(runnerRateCancel);
		var comment = $("#comment-runner").val();
		var userId = Meteor.userId();
		var runnerId = $(".errand-view__bidders-item").find(".title").data("user-id");
		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = userId;
		var notif = "has rated you and added a comment on this";
		var notifOn = "cancelled errand";
		var notifFor = runnerId;
		var notifFrom = userId;

		if (runnerRate == 0) {
			document.getElementById("comment-error").innerHTML = "Required to rate the runner.";
		} else if (!isNaN(comment)) {
			document.getElementById("comment-error").innerHTML = "Your comment is required.";
		} else {
			Meteor.call("runningErrands.runnerRateCancel", { postId, runnerRate, comment });
			Meteor.call("errandPosts.cancel", postId);
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });

			FlowRouter.go("view-errand", { _id: postId });
		}
	}
});

Template.RateBoss.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();
});

var bossRate = 0;

Template.RateBoss.events({
	"click #star1": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");

		$("#rate2").removeClass("fa-star");
		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate2").addClass("fa-star-o");
		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRate = 1;
	},
	"click #star2": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");

		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRate = 2;
	},
	"click #star3": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");

		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRate = 3;
	},
	"click #star4": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");

		$("#rate5").removeClass("fa-star");

		$("#rate5").addClass("fa-star-o");

		bossRate = 4;
	},
	"click #star5": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate5").removeClass("fa-star-o");

		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");
		$("#rate5").addClass("fa-star");

		bossRate = 5;
	},
	"click #rate-boss": function() {
		var postId = FlowRouter.getParam("_id");
		parseInt(bossRate);
		var comment = $("#comment-boss").val();
		var userId = Meteor.userId();
		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = $(".errand-view__avatar").find(".post-owner").data("user-id");
		var notif = "has rated you and added a comment on this";
		var notifOn = "completed errand";
		var notifFor = postOwnerId;
		var notifFrom = userId;

		if (bossRate == 0) {
			document.getElementById("comment-error").innerHTML = "Required to rate the boss.";
		} else if (!isNaN(comment)) {
			document.getElementById("comment-error").innerHTML = "Your comment is required.";
		} else {
			Meteor.call("runningErrands.bossRate", { postId, bossRate, comment });
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });
			
			FlowRouter.go("view-errand", { _id: postId });
		}
	}
});

Template.RateBossCancel.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();
});

var bossRateCancel = 0;

Template.RateBossCancel.events({
	"click #star1": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");

		$("#rate2").removeClass("fa-star");
		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate2").addClass("fa-star-o");
		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRateCancel = 1;
	},
	"click #star2": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");

		$("#rate3").removeClass("fa-star");
		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate3").addClass("fa-star-o");
		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRateCancel = 2;
	},
	"click #star3": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");

		$("#rate4").removeClass("fa-star");
		$("#rate5").removeClass("fa-star");

		$("#rate4").addClass("fa-star-o");
		$("#rate5").addClass("fa-star-o");

		bossRateCancel = 3;
	},
	"click #star4": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");

		$("#rate5").removeClass("fa-star");

		$("#rate5").addClass("fa-star-o");

		bossRateCancel = 4;
	},
	"click #star5": function() {
		$("#rate1").removeClass("fa-star-o");
		$("#rate2").removeClass("fa-star-o");
		$("#rate3").removeClass("fa-star-o");
		$("#rate4").removeClass("fa-star-o");
		$("#rate5").removeClass("fa-star-o");

		$("#rate1").addClass("fa-star");
		$("#rate2").addClass("fa-star");
		$("#rate3").addClass("fa-star");
		$("#rate4").addClass("fa-star");
		$("#rate5").addClass("fa-star");

		bossRateCancel = 5;
	},
	"click #rate-boss-cancel": function() {
		var postId = FlowRouter.getParam("_id");
		var bossRate = parseInt(bossRateCancel);
		var comment = $("#comment-boss").val();
		var userId = Meteor.userId();
		var runnerId = $(".errand-view__bidders-item").find(".title").data("user-id");
		var notifId = Math.random().toString(36).substr(2, 8);
		var errand = RunningErrands.findOne({ postId: postId });
		var postOwnerId = errand.bossId;
		var notif = "has rated you and added a comment on this";
		var notifOn = "cancelled errand";
		var notifFor = postOwnerId;
		var notifFrom = runnerId;

		if (bossRate == 0) {
			document.getElementById("comment-error").innerHTML = "Required to rate the boss.";
		} else if (!isNaN(comment)) {
			document.getElementById("comment-error").innerHTML = "Your comment is required.";
		} else {
			Meteor.call("runningErrands.bossRateCancel", { postId, bossRate, comment });
			Meteor.call("errandPosts.cancel", postId);
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });

			FlowRouter.go("view-errand", { _id: postId });
		}
	}
});

Template.Messages.onRendered(function() {
	var chatList = $(".errand-view__chat-list");

	chatList.scrollTop(chatList[0].scrollHeight);
});

Template.Messages.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.you = function() {
		return Template.instance().data.userId == Meteor.userId();
	}
});

Template.Messages.helpers({
	you: function() {
		return Template.instance().you();
	}
});

Template.Map.onCreated(function() {  
	var instance = this;

	instance.state = new ReactiveDict();
	instance.location = new ReactiveVar(0);
	instance.address = new ReactiveVar("");

	instance.autorun(function() {
		var subscription = instance.subscribe("runningErrands");
		var subscription2 = instance.subscribe("usersProfile");

		GoogleMaps.ready("map", function(map) {

			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({ location: map.options.center }, function(r, s) {
				if (r && r.length && r[0].formatted_address) {
					instance.address.set(r[0].formatted_address);

					var address = instance.address.get();

					var marker = new google.maps.Marker({
				    	title: address,
						position: map.options.center,
						map: map.instance
				    });

				    marker.addListener("click", function() {
		          		infowindow.open(map, marker);
			        });

				    var infowindow = new google.maps.InfoWindow({
						content:"You" + " (" + address + ")"
					});

					infowindow.open(map.instance, marker);
				}
			});

			var postId = FlowRouter.getParam("_id");
			var errands = RunningErrands.findOne({ postId: postId });
			var userLabel = "";
			var location, address2;

			if (errands) {
				var userId = Meteor.userId();
				var bossId = errands.bossId;
				var runnerId = errands.runnerId;

				if (userId !== runnerId) {
					userLabel = "Runner";

					var runnerInfo = UsersProfile.findOne({ userId: runnerId });

					if (runnerInfo) {
						var runnerLocation = runnerInfo.location;
						var runnerAddress = runnerInfo.address;

						location = runnerLocation;
						address2 = runnerAddress;

						if (location) {
							var locLat = location.lat;
							var locLng = location.lng;
						}
					}	

				} else if (userId !== bossId) {
					userLabel = "Boss";

					var bossInfo = UsersProfile.findOne({ userId: bossId });

					if (bossInfo) {
						var bossLocation = bossInfo.location;
						var bossAddress = bossInfo.address;

						location = bossLocation;
						address2 = bossAddress;

						if (location) {
							var locLat = location.lat;
							var locLng = location.lng;
						}
					}
				}		
			}

			var infowindow2 = new google.maps.InfoWindow({
				content: userLabel + " (" + address2 + ")"
			});

			var marker2 = new google.maps.Marker({
				title: address2,
				position: new google.maps.LatLng(locLat, locLng),
				map: map.instance
			});	   

			marker2.addListener("click", function() {
          		infowindow2.open(map.instance, marker2);
	        });

			infowindow2.open(map.instance, marker2);
		});	
	});

	instance.mapOptions = function() {
		var currentLocation = Geolocation.latLng(); // Get current location

		if (GoogleMaps.loaded()) {
			if (currentLocation) {
				return {
					center: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
					zoom: 8
				};
			}	
		}
	}
});

Template.Map.helpers({
	mapOptions: function() {
		return Template.instance().mapOptions();
	}
});
