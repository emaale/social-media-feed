var app = angular.module('newsFeedApp', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/partials/front-page.html',
      controller: 'FrontPageCtrl',
      resolve: {
        fetchedPosts: ['post', function(post) {
          return post.getAll();
        }]
      }
    })
    .state('searchPosts', {
      url: '/posts/query/:q',
      templateUrl: '/partials/search-posts.html',
      controller: 'SearchCtrl',
      resolve: {
        fetchedPosts: ['post', '$stateParams', function(post, $stateParams) {
          return post.search($stateParams.q);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/partials/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('savedCategories', {
      url: '/c/saved',
      templateUrl: '/partials/saved-categories.html',
      controller: 'SavedCategoriesCtrl',
      resolve: {
        savedCategories: ['user', function(user) {
          return user.getSavedCategories().then(function(res) {
            return user.savedCategories;
          });
        }]
      }
    })
    .state('categories', {
      url: '/categories',
      templateUrl: '/partials/categories.html',
      controller: 'CategoryCtrl',
      resolve: {
        fetchedCategories: ['category', function(category) {
          return category.getAll();
        }]
      }
    })
    .state('newCategory', {
      url: '/categories/new',
      templateUrl: '/partials/new-category.html',
      controller: 'FrontPageCtrl',
      resolve: {
        fetchedPosts: ['post', function(post) {
          return post.getAll();
        }]
      }
    })
    .state('editCategory', {//Add button for this in the sidebar
      url: '/c/:category/edit',
      templateUrl: '/partials/edit-category.html',
      controller: 'PostsCtrl',
      resolve: {
        fetchedCategory: ['$stateParams', 'category', function($stateParams, category) {
          return category.get($stateParams.category);
        }]
      }
    })
  	.state('posts', {
      url: '/c/:category',
      templateUrl: '/partials/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        fetchedCategory: ['$stateParams', 'category', function($stateParams, category) {
          return category.get($stateParams.category);
        }]
      }
    }).state('post', {
      url: '/c/:category/posts/:postId',
      templateUrl: '/partials/post.html',
      controller: 'PostCtrl',
      resolve: {
        fetchedPost: ['$stateParams', 'post', function($stateParams, post) {
          return post.get($stateParams.category, $stateParams.postId);
        }]
      }
    })
    .state('newPost', {
      url: '/c/:category/new',
      templateUrl: '/partials/new-post.html',
      controller: 'PostsCtrl',
      resolve: {
        fetchedCategory: ['$stateParams', 'category', function($stateParams, category) {
          return category.get($stateParams.category);
        }]
      }
    })
    .state('editPost', {
      url: '/c/:category/posts/:postId/edit',
      templateUrl: '/partials/edit-post.html',
      controller: 'PostCtrl',
      resolve: {
        fetchedPost: ['$stateParams', 'post', function($stateParams, post) {
          return post.get($stateParams.category, $stateParams.postId);
        }]
      }
    })
    .state('user', {
      url: '/u/:username',
      templateUrl: '/partials/user.html',
      controller: 'UserCtrl',
      resolve: {
        information: ['$stateParams', 'user', function($stateParams, user) {
          return user.getInformation($stateParams.username);
        }]
      }
    });

  $urlRouterProvider.otherwise('/');
}]);