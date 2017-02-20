Meteor.startup(function () {
  if (Meteor.users.find().count() === 0) {
    seedUserId = Accounts.createUser({
      email: 'GoeAdmin@geo.com',
      password: 'GeoCode$'
    });
  }
});
