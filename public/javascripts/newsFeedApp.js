var app = angular.module('newsFeedApp', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  	.state('posts', {
      url: '/c/:category',
      templateUrl: '/partials/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        fetchedPosts: ['$stateParams', 'post', function($stateParams, post) {
          return post.getAll($stateParams.category);
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
    });

  $urlRouterProvider.otherwise('/');
}]);