'use strict';
angular.module('tuto', []);

angular.module('tuto').controller('tutoCtrl', function ($scope, exercise, exerciseLauncher) {
    $scope.steps = exercise.STEPS;

    exerciseLauncher.execTestsSteps(exercise.STEPS, 0);
});

angular.module('tuto').service('exercise', function ($controller) {
    var assertionFailed = [], countAssert;

    var Step = {
        title: "",
        detailTemplateName: "tutorial-step-empty",
        solutionTemplateName: "tutorial-solution-empty",
        test: function () {
            ok(false, "Test not implemented")
        },
        passed: undefined,
        executed: false,
        errors: [],
        isActive: function () {
            return !this.passed && this.executed;
        },
        init: function (args) {
            for (var prop in args)
                this[prop] = args[prop];
            return this;
        }
    };

    var STEPS = [
        Object.create(Step).init({
            title: "Création de l'application",
            detailTemplateName: "tutorial-step-app",
            solutionTemplateName: "tutorial-solution-app",
            test: function () {
                // Verify module
                try {
                    angular.module('accessLog');
                } catch (e) {
                    fail("Module 'accessLog' n'est pas défini");
                }

                // Verify controller
                try {
                    var elem = angular.element(document.querySelector('#angular-app'));
                    var injector = elem.injector();
                    var $controller = injector.get('$controller');
                    $controller('testCtrl', {$scope: {}});
                } catch (e) {
                    fail("Controller 'testCtrl' n'est pas défini");
                }

                // verify ng-app
                ok($('div[ng-app*="accessLog"]').length, "ng-app n'est pas défini dans template");

                // verify ng-controller
                ok($('div[ng-controller*="testCtrl"]').length, "ng-controller n'est pas défini dans template");
            }
        }),
        Object.create(Step).init({
            title: "Dites bonjour au monde des poneys",
            detailTemplateName: "tutorial-step-hello",
            solutionTemplateName: "tutorial-solution-hello",
            test: function () {
//                ok(false, "Second step. Test 1");
            }
        }),
        Object.create(Step).init({
            title: "Créer un datastore",
            detailTemplateName: "tutorial-step-ds",
            solutionTemplateName: "tutorial-solution-ds",
            test: function () {
//                ok(false, "Third step. Test 1");
//                ok(false, "Third step. Test 2");
            }
        }),
        Object.create(Step).init({
            title: "Créer une classe Pony",
            detailTemplateName: "tutorial-step-model",
            solutionTemplateName: "tutorial-solution-model",
            test: function () {
            }
        })
    ];

    function ok(testPassed, msg) {
        countAssert++;
        testPassed = !!testPassed;
        if (!testPassed) {
            throw new Failed(msg)
        }
    }

    function fail(msg) {
        ok(false, msg)
    }

    function equal(a, b, msg) {
        ok(a === b, msg);
    }

    return {
        STEPS: STEPS
    }
});

angular.module('tuto').service('exerciseLauncher', function () {
    var countAssert;

    function execTestsSteps(steps, index) {
        var assertionFailed = [];
        if (steps.length == index) return;
        var step = steps[index];
        var test = step.test;
        countAssert = 0;
        var failed = false;

        try {
            //if (localStorage.lastRuningTestIdx == undefined || localStorage.lastRuningTestIdx <= index || index == 0) {
            if (index < steps.length) {
                var promiseOfTest = test();
                if (promiseOfTest) {
                    promiseOfTest.done(function () {
                        execTestsSteps(steps, 1 + index);
                    });
                } else {
                    execTestsSteps(steps, 1 + index);
                }
            }
        } catch (e) {
            localStorage.lastRuningTestIdx = index;
            failed = true;
            if (e instanceof Failed) {
                assertionFailed.push(e.message);
            } else {
                assertionFailed.push("Error :" + e.message);
            }
        } finally {
            step.executed = true;
            step.passed = !failed;
            step.errors = assertionFailed;
        }
    }

    return {
        execTestsSteps: execTestsSteps,
        countAssert: countAssert
    };
});

function Failed(message) {
    this.name = "Failed";
    this.message = message || "Default Message";
}
Failed.prototype = new Error();
Failed.prototype.constructor = Failed;





angular.bootstrap($('#tutorial'), ['tuto']);