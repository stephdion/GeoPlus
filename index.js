Entreprises = new Mongo.Collection( 'entreprises' );



Entreprises.allow({
  insert: function(userId, doc) {

    return !! userId;
  },
  update: function(userId, doc) {

    return !! userId;
  },
  remove: function(userId, doc) {

    return !! userId;
  }


});









if (Meteor.isClient) {



  Template.register.helpers({
    users: function(){
         return Users.find();

     }
  });
  Template.entreprises.helpers({
    entreprises: function(){
         return Entreprises.find();

     }
  });

  Template.entreprisesForm.events({
     'submit .new-entreprise': function(event){


      var nom = event.target.Nom.value;
      var logo = event.target.Logo.value;
      var responsable = event.target.Responsable.value;
      var adresse = event.target.Adresse.value;
      var geoCode = event.target.GeoCode.value;



       Entreprises.insert({
          Nom: nom,
          Logo: logo,
          Responsable: responsable,
          Adresse: adresse,
          GeoCode: geoCode,
          createdAt: new Date()

       });
       Router.go('entreprises');
       return false;


     }


  });

  Template.entrepriseItem.events({

    'click .delete': function(){

      Entreprises.remove(this);
    }

    });

}




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
