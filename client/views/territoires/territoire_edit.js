Template.entrepriseEdit.onCreated(function() {
  Session.set('entrepriseEditErrors', {});
});

Template.entrepriseEdit.helpers({
  errorMessage: function(field) {
    return Session.get('entrepriseEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('entrepriseEditErrors')[field] ? 'has-error' : '';
  }
});

Template.entrepriseEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentEntrepriseId = this._id;


    var entrepriseProperties = {
      Nom: $(e.target).find('[name=Nom]').val(),
      Logo: $(e.target).find('[name=Logo]').val(),
      Responsable: $(e.target).find('[name=Responsable]').val(),
      Adresse: $(e.target).find('[name=Adresse]').val(),
      GeoCode: $(e.target).find('[name=GeoCode]').val(),

    }




    Entreprises.update(currentEntrepriseId, {$set: entrepriseProperties}, function(error) {
      if (error) {

        alert(error);
      } else {
        Router.go('entreprises');
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer cette entreprise?")) {
      var currentEntrepriseId = this._id;
      Entreprises.remove(currentEntrepriseId);
      Router.go('entreprises');
    }
  }
});
