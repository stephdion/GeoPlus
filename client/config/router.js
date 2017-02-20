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

Router.route('/pageTwo', function () {
    this.render('pageTwo');
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

Router.route('/accueil', function () {
    this.render('home');
});

Router.route('/login2', function () {
    this.render('pageTwo');
});
