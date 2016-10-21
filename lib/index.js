import { UsersProfile } from "../imports/api/users-profile.js";
import { ErrandPosts } from "../imports/api/errand-posts.js";
import { ErrandBidders } from "../imports/api/errand-bidders.js";
import { RunningErrands } from "../imports/api/running-errands.js";
import { FavoriteRunners } from "../imports/api/favorite-runners.js";
import { Messages } from "../imports/api/messages.js";
import { Notifications } from "../imports/api/notifications.js";
import { Reports } from "../imports/api/reports-feedback.js";

AdminConfig = {
	name: "OutRands",
  	adminEmails: ["jeelapera@gmail.com"],
	collections: {
		UsersProfile: {
			tableColumns: [
				{ label: 'User ID', name: 'userId' },
				{ label: 'Full Name', name: 'fullName' },
				{ label: 'Address', name: 'address' },
				{ label: 'Date Created', name: 'createdAt' },
				{ label: 'As Boss Rate', name: 'asBossRate'},
				{ label: 'As Runner Rate', name: 'asRunnerRate'},
				{ label: 'Overall Rating', name: 'overallRate'}
			],
			showEditColumn: false,
			showDelColumn: false
		},
		ErrandPosts: { 
			tableColumns: [
				{ label: 'Post ID', name: 'postId' },
				{ label: 'Title', name: 'title' },
				{ label: 'Description', name: 'description' },
				{ label: 'Due Date', name: 'dueDate' },
				{ label: 'Service Fee', name: 'serviceFee'},
				{ label: 'Category', name: 'category'},
				{ label: 'Status', name: 'status'},
				{ label: 'Date Posted', name: 'postDate'},
				{ label: 'Expiration', name: 'expired'}
			],
			showEditColumn: false,
			showDelColumn: false
		},
		ErrandBidders: {
			tableColumns: [
				{ label: 'Post ID', name: 'postId' },
				{ label: 'Bade Price', name: 'price' },
				{ label: 'Date Bade', name: 'date' },
				{ label: 'Bidder ID', name: 'userId' }
			],
			showEditColumn: false,
			showDelColumn: false
		},
		FavoriteRunners: {
			tableColumns: [
				{ label: 'Boss/Owner', name: 'userId'},
				{ label: 'Runner', name: 'runnerId' },
				{ label: 'Date Marked as Favorite', name: 'date' },
			],
			showEditColumn: false,
			showDelColumn: false
		},
		RunningErrands: {
			tableColumns: [
				{ label: 'Post ID', name: 'postId' },
				{ label: 'Boss ID', name: 'bossId' },
				{ label: 'Runner ID', name: 'runnerId' },
				{ label: 'Date Started', name: 'date' },
				{ label: 'Status', name: 'status'},
				{ label: 'Boss Rate', name: 'bossRate'},
				{ label: 'Runner Rate', name: 'runnerRate'},
				{ label: 'Reason if Cancelled', name: 'reasonForCancellation'},
				{ label: 'Remove Runner', name: 'removedRunner'}
			],
			showEditColumn: false,
			showDelColumn: false
		},
		Messages: {
			tableColumns: [
				{ label: 'Post ID', name: 'postId'},
				{ label: 'Full Name', name: 'name' },
				{ label: 'Boss ID', name: 'message' },
				{ label: 'Date Sent', name: 'date' },
				{ label: 'Date Started', name: 'date' },
				{ label: 'User ID', name: 'userId'},
				{ label: 'User Type', name: 'userType'}
			],
			showEditColumn: false,
			showDelColumn: false
		},
		Notifications: {
			tableColumns: [
				{ label: 'Post ID', name: 'postId'},
				{ label: 'Post Owner ID', name: 'postOwnerId' },
				{ label: 'Notification', name: 'notif' },
				{ label: 'On', name: 'notifOn' },
				{ label: 'Notif. for ID', name: 'notifFor'},
				{ label: 'Notif. from ID', name: 'notifFrom'}
			],
			showEditColumn: false,
			showDelColumn: false
		},
		Reports: {
			tableColumns: [
				{ label: 'Full Name', name: 'name'},
				{ label: 'Email Address', name: 'emailAddress' },
				{ label: 'Question', name: 'question' },
				{ label: 'Date Sent', name: 'date' }
			],
			showEditColumn: false
		}
	}
};