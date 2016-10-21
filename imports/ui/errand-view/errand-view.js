import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./errand-view.html";

Template.ErrandView.onRendered(function() {
	var s = Template.instance().$('#errand-rating');
	s.select2();

	var instance = this;
	instance.date = new ReactiveVar(new Date());

	instance.subscribe("errandPosts", function() {
		instance.autorun(function() {
			var posts = ErrandPosts.find({ status: "open" }).fetch();
			var date = instance.date.get();

			posts.forEach(function(post) {

				if (date > post.dueDate) {
					post.result = true;

					var posttId = post.postId;

					Meteor.call("errandPosts.expired", posttId);
				}
			});
		});
	});
});

Template.ErrandView.onCreated(function errandViewOnCreated() {
	var instance = this;

	instance.state = new ReactiveDict();
	instance.location = new ReactiveVar();

	instance.autorun(function() {
		var postId = FlowRouter.getParam("_id");

		var subscription = instance.subscribe("errandView", postId);
		var subscription2 = instance.subscribe("errandBidders", postId);
		var subscription3 = instance.subscribe("runningErrands", postId);
		var subscription4 = instance.subscribe("favoriteRunners");
	});

	// Display each errand post's details
	instance.errandView = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.status === "open") {
				$(".errand-view__status").addClass("green");
			} else if (post.status === "running" || post.status === "expired") {
				$(".errand-view__status").addClass("red");
			} else if (post.status === "cancelled"){
				$(".errand-view__status").addClass("blue");
			} else {
				$(".errand-view__status").css("color", "#384d68");
			}

			return post;
		}
	}

	// Get each post owner's information from their profiles
	instance.getPostOwnerInfo = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			var postOwner = UsersProfile.findOne({userId: post.userId});

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

	// Check if this errand post's status is open
	instance.openErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.status === "open") {
				return true;
			}
		}
	}

	// Check if this errand post's status is running
	instance.runningErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.status === "running") {
				return true;
			}
		}
	}

	// Check if this errand post's status is completed
	instance.completedErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.status === "completed") {
				return true;
			}
		}
	}

	// Check if this errand post's status is cancelled
	instance.cancelledErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.status === "cancelled") {
				return true;
			}
		}
	}

	instance.getReasonForCancellation = function() {
		var postId = FlowRouter.getParam("_id");
		var post = RunningErrands.findOne({ postId: postId });

		if (post) {
			return post.reasonForCancellation;
		}
	}

	// Check if this errand post has already expired
	instance.expiredErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			if (post.expired == true) {
				return true;
			}
		}
	}

	// Get errand boss and runner of a current viewed (running) errand post
	instance.getBossAndRunner = function() {
		var postId = FlowRouter.getParam("_id");
		var user = Meteor.userId();

		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var boss = errand.bossId;
			var runner = errand.runnerId;

			if (boss === user || runner === user) {
				return true;
			}
		}
	}

	// Display bidders on a current viewed errand post
	instance.errandBids = function() {
		var postId = FlowRouter.getParam("_id");
		var bids = ErrandBidders.find({ postId: postId }, { sort: { date: 1 } });

		return bids;
	}

	// Display bidders on a current viewed errand post
	instance.errandBidders = function() {
		var postId = FlowRouter.getParam("_id");
		var bidders = ErrandBidders.find({ postId: postId }, { sort: { date: 1 } }).fetch();

		if (bidders) {
			var userIds = bidders.map(function(b) { return b.userId });
			var biddersInfo = UsersProfile.find({ userId: { $in: userIds } }).fetch();

			var joined = _.map(bidders, function(b) {
				return _.extend(b, _.findWhere(biddersInfo, { userId: b.userId }));
			});

			joined.forEach(function(bidder) {
				var name = bidder.fullName;
				var split = name.split(" ");
				var initials = "";
 				
 				if (split.length > 0) {
                	initials += split[0].charAt(0);
                	
                	if(split.length > 1) {
                		initials += split[1].charAt(0);
                	}

                	bidder.initials = initials;
            	}
			});

			return joined;
		}
	}
	
	instance.distance = function() {
		var distance = instance.distance.get();

		return distance;
	}

	// Check if owner of a current viewed errand post
	instance.isOwner = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			return post.userId === Meteor.userId();
		}
	}

	// Check if post open for favorite runners
	instance.isOpenforFavorite = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			var postType = post.postType;

			if (postType === "Open for Favorite Runners") {
				return true;
			}
		}
	}

	// Check if favorite runner of the post owner
	instance.isFavoriteRunner = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			var postOwnerId = post.userId;
			var userId = Meteor.userId();
			var runner = FavoriteRunners.findOne({ userId: postOwnerId });

			if (runner) {
				var runnerId = runner.runnerId;

				return userId === runnerId;
			}
		}
	}

	// Check if current user viewing this current viewed errand post bade
	instance.isBid = function() {
		var postId = FlowRouter.getParam("_id");
		var userId = Meteor.userId();
		var userPostId = ErrandBidders.findOne({ userId: userId });

		if (userPostId) {
			var bidderPostId = userPostId.postId;

			if (postId == bidderPostId) {
				return true;
			}
		}
	}

	instance.badePrice = function() {
		var postId = FlowRouter.getParam("_id");
		var userId = Meteor.userId();
		var userPostId = ErrandBidders.findOne({ userId: userId });

		if (userPostId) {
			var badePrice = userPostId.price;

			return badePrice;
		}
	}
});

Template.ErrandView.helpers({
  	errandView: function() {
  		return Template.instance().errandView();
	},
	getPostOwnerInfo: function() {
		return Template.instance().getPostOwnerInfo();
	},
	openErrand: function() {
		return Template.instance().openErrand();
	},
	runningErrand: function() {
		return Template.instance().runningErrand();
	},
	completedErrand: function() {
		return Template.instance().completedErrand();
	},
	cancelledErrand: function() {
		return Template.instance().cancelledErrand();
	},
	getReasonForCancellation: function() {
		return Template.instance().getReasonForCancellation();
	},
	expiredErrand: function() {
		return Template.instance().expiredErrand();
	},
	getBossAndRunner: function() {
		return Template.instance().getBossAndRunner();
	},
	errandBids: function() {
		return Template.instance().errandBids();
	},
	errandBidders: function() {
		return Template.instance().errandBidders();
	},
	distance: function() {
		return Template.instance().distance();
	},
	isOwner: function() {
		return Template.instance().isOwner();
	},
	isOpenforFavorite: function() {
		return Template.instance().isOpenforFavorite();
	},
	isFavoriteRunner: function() {
		return Template.instance().isFavoriteRunner();
	},
	isBid: function() {
		return Template.instance().isBid();
	},
	badePrice: function() {
		return Template.instance().badePrice();
	}
});

Template.ErrandView.events({
	"click #bid": function(event) {
		event.preventDefault();

		var notifId = Math.random().toString(36).substr(2, 8);
		var postId = FlowRouter.getParam("_id");
		var toComplete = $("#errand-rating").val();
		var price = parseFloat($("#price").val());
		var serviceFee = parseFloat(document.getElementById("price").max);
		var userId = Meteor.userId();

		if (price < 20.00) {
			document.getElementById("error-msg").innerHTML = "PHP 20.00 is the min. service fee amount.";
		} else if (price > serviceFee) {
			document.getElementById("error-msg").innerHTML = "Must not excess the service fee amount.";
		} else if (isNaN(price)) {
			document.getElementById("error-msg").innerHTML = "Must be a number with 2 decimal places.";
		} else {
			var postOwnerId = $(".errand-view__avatar").find(".post-owner").data("user-id");
			var notif = "bade on your";
			var notifOn = "errand post";
			var notifFor = postOwnerId;
			var notifFrom = userId;

			Meteor.call("errandBidders.insert", { postId, toComplete, price, userId });
			Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });

			document.getElementById("error-msg").innerHTML = "";
		}
	},
	"click #repost": function() {
		Modal.show("RepostCancelledErrand");
	},
	"click #repost-expired": function() {
		Modal.show("RepostExpiredErrand");
	}
});

Template.RepostCancelledErrand.events({
	"focus #due-date": function(e, template) {
		var f = Template.instance().$("#due-date");
		var date = new Date();
		var max = moment(date).add(2, "d").toDate();

		f.bootstrapMaterialDatePicker({ format: "MMMM D, YYYY h:mm A", minDate: date, maxDate: max });
	},
	"click #repost-errand": function(event, template) {
		var postId = FlowRouter.getParam("_id");
		var dueDate = $("#due-date").val();

		dueDate = new Date(dueDate);

		Meteor.call("errandPosts.repost", { postId, dueDate });
		Meteor.call("errandBidders.clear", postId);
		Meteor.call("runningErrands.onRepost", postId);

		Modal.hide("RepostCancelledErrand");
		
		FlowRouter.go("view-profile", { _id: Meteor.userId() });
	}
});

Template.RepostExpiredErrand.events({
	"focus #due-date": function(e, template) {
		var f = Template.instance().$("#due-date");
		var date = new Date();
		var max = moment(date).add(2, "d").toDate();

		f.bootstrapMaterialDatePicker({ format: "MMMM D, YYYY h:mm A", minDate: date, maxDate: max });
	},
	"click #repost-expired-errand": function(event, template) {
		var postId = FlowRouter.getParam("_id");
		var dueDate = $("#due-date").val();

		dueDate = new Date(dueDate);

		Meteor.call("errandPosts.repostExpired", { postId, dueDate });
		Meteor.call("errandBidders.clear", postId);

		Modal.hide("RepostExpiredErrand");

		FlowRouter.go("view-profile", { _id: Meteor.userId() });
	}
});

Template.ErrandRunner.onCreated(function errandBidderOnCreated() {
	var instance = this;

	instance.state = new ReactiveDict();

	var postId = FlowRouter.getParam("_id");

	instance.autorun(function() {
		var subscription = instance.subscribe("errandBidders", postId);
		var subscription2 = instance.subscribe("runningErrands");
	});

	// Display accepted errand runner of a current viewed errand post
	instance.errandRunner = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var runner = UsersProfile.findOne({ userId: errand.runnerId });

			if (runner) {
				var name = runner.fullName;
				var split = name.split(" ");
				var initials = "";

				if (split.length > 0) {
					initials += split[0].charAt(0);

					if(split.length > 1) {
						initials += split[1].charAt(0);
					}

					runner.initials = initials;
				}
			}

			return runner;
		}
	}

	// Accepted errand runner's bidding price
	instance.errandRunnerBid = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var runner = errand.runnerId;
			var runnerBid = ErrandBidders.findOne({ userId: runner });

			return runnerBid;
		}
	}

	// Check if owner of a current viewed errand post
	instance.isOwner = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			return post.userId === Meteor.userId();
		}
	}

	// Check if this errand post's status is running
	instance.runningErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "running") {
				return true;
			}
		}
	}

	// Check if this errand post's status is cancelled
	instance.cancelledErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "cancelled") {
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
});

Template.ErrandRunner.helpers({
	errandRunner: function() {
		return Template.instance().errandRunner();
	},
	errandRunnerBid: function() {
		return Template.instance().errandRunnerBid();
	},
	isOwner: function() {
		return Template.instance().isOwner();
	},
	runningErrand: function() {
		return Template.instance().runningErrand();
	},
	cancelledErrand: function() {
		return Template.instance().cancelledErrand();
	},
	completedErrand: function() {
		return Template.instance().completedErrand();
	}
});

Template.ErrandRunnerRate.onCreated(function() {
	var instance = this;
	instance.state = new ReactiveDict();

	instance.runnerRate = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var rate = errand.runnerRate;

			if (rate === 0) {
				errand.star1 = "fa-star-o";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 0 && rate < 1) {
				errand.star1 = "fa-star-half-o";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 1) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 1 && rate < 2) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star-half-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 2) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 2 && rate < 3) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star-half-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 3) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 3 && rate < 4) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star-half-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 4) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star-o";
			} else if (rate > 4 && rate < 5) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star-half-o";
			} else if (rate === 5) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star";
			}
		}

		return errand;
	}

	instance.noCommentForRunner = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var commentForRunner = errand.commentForRunner;

			if (commentForRunner === "") {
				return true;
			}
		}
	}

	instance.commentForRunner = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var commentForRunner = errand.commentForRunner;

			return commentForRunner;
		}
	}
});

Template.ErrandRunnerRate.helpers({
	runnerRate: function() {
		return Template.instance().runnerRate();
	},
	commentForRunner: function() {
		return Template.instance().commentForRunner();
	}
});

Template.ErrandBossRate.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.bossRate = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var rate = errand.bossRate;

			if (rate === 0) {
				errand.star1 = "fa-star-o";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 0 && rate < 1) {
				errand.star1 = "fa-star-half-o";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 1) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 1 && rate < 2) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star-half-o";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 2) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 2 && rate < 3) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star-half-o";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 3) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star-o";
				errand.star5 = "fa-star-o";
			} else if (rate > 3 && rate < 4) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star-half-o";
				errand.star5 = "fa-star-o";
			} else if (rate === 4) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star-o";
			} else if (rate > 4 && rate < 5) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star-half-o";
			} else if (rate === 5) {
				errand.star1 = "fa-star";
				errand.star2 = "fa-star";
				errand.star3 = "fa-star";
				errand.star4 = "fa-star";
				errand.star5 = "fa-star";
			}
		}

		return errand;
	}

	instance.noCommentForBoss = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var commentForBoss = errand.commentForBoss;

			if (commentForBoss === "") {
				return true;
			}
		}
	}

	instance.commentForBoss = function() {
		var postId = FlowRouter.getParam("_id");
		var errand = RunningErrands.findOne({ postId: postId });

		if (errand) {
			var commentForBoss = errand.commentForBoss;

			return commentForBoss;
		}
	}
});

Template.ErrandBossRate.helpers({
	bossRate: function() {
		return Template.instance().bossRate();
	},
	noCommentForBoss: function() {
		return Template.instance().noCommentForBoss();
	},
	commentForBoss: function() {
		return Template.instance().commentForBoss();
	}
});

Template.ErrandBidder.onCreated(function errandBidderOnCreated() {
	var instance = this;

	instance.state = new ReactiveDict();

	// Check if this errand post's status is running
	instance.runningErrand = function() {
		var postId = FlowRouter.getParam("_id");
		var posts = ErrandPosts.findOne({ postId: postId });

		if (posts) {
			if (posts.status === "running") {
				return true;
			}
		}
	}

	// Check if owner of a current viewed errand post
	instance.isOwner = function() {
		var postId = FlowRouter.getParam("_id");
		var post = ErrandPosts.findOne({ postId: postId });

		if (post) {
			return post.userId === Meteor.userId();
		}
	}
});

Template.ErrandBidder.helpers({
	runningErrand: function() {
		return Template.instance().runningErrand();
	},
	isOwner: function() {
		return Template.instance().isOwner();
	}
});

Template.ErrandBidder.events({
	"click .accept": function(event) {

		var _self = $(event.target);
		var parent = _self.closest(".errand-view__bidders-item");
		
		_self.closest(".button.button--black").prop("disabled", true);
		_self.closest(".button.button--black").text("Accepted");

		var postId = FlowRouter.getParam("_id");
		var bossId = Meteor.userId();
		var runnerId = parent.find(".title").data("user-id");

		var notifId = Math.random().toString(36).substr(2, 8);
		var postOwnerId = $(".errand-view__avatar").find(".post-owner").data("user-id");
		var notif = "accepted your bid request on this";
		var notifOn = "errand post";
		var notifFor = runnerId;
		var notifFrom = bossId;

		Meteor.call("errandPosts.accept", postId);
		Meteor.call("runningErrands.insert", { postId, bossId, runnerId });
		Meteor.call("notifications.insert", { notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom });
	}
});