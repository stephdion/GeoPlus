Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'

});

//
// Example pages routes
//

Router.route('/entreprises', function () {
    this.render('entreprises');
});

Router.route('/Nouvelle_entreprise', function () {
    this.render('entreprisesForm');
});

Router.route('entreprisePage', {
path: '/entreprises/:_id',
data: function() { return Entreprises.findOne(this.params._id); }
});
Router.route('entrepriseEdit', {
path: '/entreprises/:_id/edit',
data: function() { return Entreprises.findOne(this.params._id); }
});



Router.route('/', function () {
    Router.go('entreprises');
});


Router.route('/register', function () {
    this.render('register');
});

Router.route('/login', function () {
    this.render('login');
});

Router.route('/territoires', function () {
    //this.render('googleMaps');
    this.render('territoires');
});

Router.route('/territoires-design', function () {
    this.render('googleMaps');

});
Router.route('/Nouveau_territoire', function () {
    this.render('territoiresForm');
});
Router.route('teritoireEdit', {
path: '/territoire/:_id/edit',
data: function() { return Entreprises.findOne(this.params._id); }
});

Router.route('teritoireAssign', {
path: '/territoireAssign/:_id/',

});
