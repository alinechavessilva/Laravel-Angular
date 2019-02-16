
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
require('angular');



/*
window.Vue = require('vue');
*/

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

/*
Vue.component('example-component', require('./components/ExampleComponent.vue').default);
*/

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

/*const app = new Vue({
    el: '#app'
});*/


var app = angular.module('LaravelCRUD', []
    , ['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
    }]);

app.controller('TaskController', ['$scope', '$http', function ($scope, $http) {

    $scope.tasks = [];

    // List tasks
    $scope.loadTasks = function () {
        $http.get('/task')
            .then(function success(e) {
                $scope.tasks = e.data.tasks;
            });
    };
    $scope.loadTasks();


    $scope.errors = [];

    $scope.task = {
        name: '',
        description: ''
    };
    $scope.initTask = function () {
        $scope.resetForm();
        $("#add_new_task").modal('show');
    };

    // Add new Task
    $scope.addTask = function () {
        $http.post('/task', {
            name: $scope.task.name,
            description: $scope.task.description
        }).then(function success(e) {
            $scope.resetForm();
            $scope.tasks.push(e.data.task);
            $("#add_new_task").modal('hide');

        }, function error(error) {
            $scope.recordErrors(error);
        });
    };

    $scope.recordErrors = function (error) {
        $scope.errors = [];
        if (error.data.errors.name) {
            $scope.errors.push(error.data.errors.name[0]);
        }

        if (error.data.errors.description) {
            $scope.errors.push(error.data.errors.description[0]);
        }
    };

    $scope.resetForm = function () {
        $scope.task.name = '';
        $scope.task.description = '';
        $scope.errors = [];
    };

    $scope.edit_task = {};
    // initialize update action
    $scope.initEdit = function (index) {
        $scope.errors = [];
        $scope.edit_task = $scope.tasks[index];
        $("#edit_task").modal('show');
    };

    // update the given task
    $scope.updateTask = function () {
        $http.patch('/task/' + $scope.edit_task.id, {
            name: $scope.edit_task.name,
            description: $scope.edit_task.description
        }).then(function success(e) {
            $scope.errors = [];
            $("#edit_task").modal('hide');
        }, function error(error) {
            $scope.recordErrors(error);
        });
    };

    // delete the given task
    $scope.deleteTask = function (index) {

        var conf = confirm("Do you really want to delete this task?");

        if (conf === true) {
            $http.delete('/task/' + $scope.tasks[index].id)
                .then(function success(e) {
                    $scope.tasks.splice(index, 1);
                });
        }
    };

}]);
