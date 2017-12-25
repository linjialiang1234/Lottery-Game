mainApp.controller('lotteryController', function($scope) {

    $scope.inputLists = [];

    $scope.addItem = function() {
        $scope.inputLists.push({
            "name" :  $scope.name,
            "percentage" : $scope.percentage,
            "color" : $scope.color 
        });

        drawPieChart();

        showElement("turntable", "hidden-turntable");
        showElement("btn", "hidden-turntable");

        // var elementTurnTable = document.getElementById("turntable");
        // elementTurnTable.classList.remove("hidden-turntable");

        // var elementLinkButton = document.getElementById("btn");
        // elementLinkButton.classList.remove("hidden-turntable");
    } 

    showElement = function(idOfElement,classOfElement) {
        var getElement = document.getElementById(idOfElement);
        getElement.classList.remove(classOfElement);

    }

    getAllInputPercentage = function() {
        var totalInputPercentage = 0;
        for(var i = 0; i < $scope.inputLists.length; i++) {
            totalInputPercentage += $scope.inputLists[i].percentage;
        }
        return totalInputPercentage;
    }

    $scope.remove = function() {
        $scope.inputLists.splice(this.$index, 1);
        drawPieChart();
    }

    drawPieChart = function() {
        var num = $scope.inputLists.length;
        var canvas = document.getElementById('canvas');
        var btn = document.getElementById('btn');
        if(!canvas.getContext){
            alert('Sorry, this browser do not support it.');
            return;
        }

        totolRotateNumber = 0;

        var ctx = canvas.getContext('2d');
        for (var i = 0; i < num; i++) {
            // save the current state
            ctx.save();
            // start to draw
            ctx.beginPath();
            // the center has been changed
            ctx.translate(150, 150);
            // from(0, 0) define a new route
            ctx.moveTo(0, 0);
            // uese formular degrees * Math.PI/180 to change degree into arc
            // ctx.rotate((360 / num * i + 360 / num / 2) * Math.PI/180);
            ctx.rotate((360 * (totolRotateNumber/getAllInputPercentage())) * Math.PI/180);
            totolRotateNumber += $scope.inputLists[i].percentage;
            // draw the arc
            // ctx.arc(0, 0, 150, 0,  2 * Math.PI / num, false);
            ctx.arc(0, 0, 150, 0,  2 * Math.PI *($scope.inputLists[i].percentage/getAllInputPercentage()) , false);
            // if (i % 2 == 0) {
            //     ctx.fillStyle = '#ffb820';
            // }else{
            //     ctx.fillStyle = '#ffcb3f';
            // }
            ctx.fillStyle = $scope.inputLists[i].color;
            // fill the color
            ctx.fill();
            // draw outline
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'whitesmoke';
            ctx.stroke();
    
            // literal
            // ctx.fillStyle = '#fff';
            // ctx.font="16px sans-serif";
            // ctx.fillText(i + 1, 100, 60);
    
            //restore previous state
            ctx.restore();
        }
    }

    var result = 0;
    var counter = 0;
    $scope.rotatePieChart = function() {
        var element = document.getElementById("winner");
        element.classList.add("hidden-winner-text");

        if(counter === 0) {
            result = randomRotateDegree();
        }else {
            result = (3600 * counter + randomRotateDegree());
        }

        canvas.style.transform = 'rotate(-' + result +'deg)'; 
        setTimeout(() => {

            showElement("winner", "hidden-winner-text");

            // var element = document.getElementById("winner");
            // element.classList.remove("hidden-winner-text");
        }, 6000);
        // console.log("counter")
        counter += 1;
    }

    

    $scope.winner = "";

    randomRotateDegree = function() {
        //get the random number
        var num = parseInt((Math.random()*($scope.inputLists.length)) + 1);

        $scope.winner = $scope.inputLists[num-1].name;
        console.log("the winner is:" + $scope.winner);

        getFinalRoundRotateAngles = function() {
            var finalRoundRotateAngles = 0;

            for(var i = 0 ; i < (num-1); i++) {
                finalRoundRotateAngles += $scope.inputLists[i].percentage;
            }
    
            finalRoundRotateAngles += Math.floor(($scope.inputLists[num-1].percentage)/2);

            return finalRoundRotateAngles;
        }

        var totalRotateDegree = (3600 + 90 + 360 * (getFinalRoundRotateAngles()/getAllInputPercentage()));
        console.log("123:   " + totalRotateDegree);

        return totalRotateDegree;
    }  
}).directive("inputList", function() {
    return {
        restrict: 'E',
        replace: true,
        template: `
  
        `
    };
}).directive("outputList", function() {
    return {
        restrict: 'E',
        replace: true,
        template: `
        <div class="output-list">
            <div ng-repeat="list in inputLists" class="single-output">
                <span>{{list.name}}</span>
                <span>{{list.percentage}}</span>
                <span>{{list.color}}</span>
                <button ng-click="remove()">Delete</button>
            </div>
        </div>
        
        `
    };  

});