app.controller('TempController', ['$scope', function($scope) {
    $scope.tempMarkers = function(temp) {
        var tempPercent = temp / 210 * 20;
        var markers = [];
        var background = true;

        for (var i = 20; i > 0; i--) {
            if (tempPercent > i) {
                background = false;
            }
            markers.push({
                num: i,
                background: background
            });
        }

        return markers;
    };

    $scope.backgroundTempMarkers = function() {
        var markers = [];
        for (var i = 0; i < 20; i++) {
            markers.push({
                num: i,
                background: true
            });
        }

        return markers;
    };
    
    // Example usage
    $scope.markers = $scope.tempMarkers(150);  // Adjust temp value
    $scope.backgroundMarkers = $scope.backgroundTempMarkers();
}]);
