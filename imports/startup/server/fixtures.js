// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }

  SimpleRest.configure({
       collections: []
   });


   JsonRoutes.add("get", "/links/:id", function (req, res, next) {
     var id = req.params.id;

     JsonRoutes.sendResult(res, {
       data: Links.findOne(id)
     });
   });
   // Enable cross origin requests for all endpoints
   JsonRoutes.setResponseHeaders({
       "Cache-Control": "no-store",
       "Pragma": "no-cache",
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
       "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
   });
});
