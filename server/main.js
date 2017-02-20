Meteor.startup(function () {
  if (Meteor.users.find().count() === 0) {
    seedUserId = Accounts.createUser({
      email: 'GoeAdmin@geo.com',
      password: 'GeoCode$'
    });
    seedgeolocId = geoloc.insert({
      poly: '',
      user:'madey@doctoratmarketing.com',

    });
  }






});
