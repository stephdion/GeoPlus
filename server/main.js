import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  if (Meteor.users.find().count() === 0) {
      seedUserId = Accounts.createUser({
        email: 'GoeAdmin@geo.com',
        password: 'GeoCode$'
      });

    }


});
