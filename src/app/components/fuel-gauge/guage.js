app.directive('tempMarker', function() {
    return {
        restrict: 'E',
        scope: {
            num: '@',
            background: '@'
        },
        template: function(elem, attr) {
            return `<div class="{{divClass}}" ng-style="style"></div>`;
        },
        link: function(scope, element, attrs) {
            const colors = ["#7BE7EC", "#89E8DC", "#96E9CE", "#A0EAC1", "#ABEBB4", "#BAEDA4", "#C5ED96", "#D1EE88", "#DDF07B", "#ECF16A", "#F0E966", "#F0DD68", "#F1D069", "#F2C36B", "#F3C36B", "#F4AA6E", "#F49D6F", "#F58F71", "#F58372", "#F77674"];

            scope.divClass = scope.background === 'true' ? 'temp__marker--background' : 'temp__marker';
            if (scope.background === 'false') {
                scope.style = {
                    backgroundColor: colors[scope.num - 1]
                };
            }
        }
    };
});
