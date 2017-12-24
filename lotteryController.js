mainApp.controller('lotteryController', function($scope) {

    // $scope.colors = [
    //     {name: '黑色', color:'black' },
    //     {name: '白色', color:'white' },
    //     {name: '红色', color:'red' },
    //     {name: '蓝色', color:'blue' },
    //     {name: '黄色', color:'yellow'}
    // ];

    // $scope.colorChosen = '';

    $scope.inputLists = [];

    // $scope.name = "yellow"

    $scope.addItem = function() {
        $scope.inputLists.push({
            "name" :  $scope.name,
            "percentage" : $scope.percentage,
            "color" : $scope.color 
        });

        drawPieChart();

        var elementTurnTable = document.getElementById("turntable");
        elementTurnTable.classList.remove("hidden-turntable");

        var elementLinkButton = document.getElementById("btn");
        elementLinkButton.classList.remove("hidden-turntable");
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
            alert('抱歉！浏览器不支持。');
            return;
        }

        totolRotateNumber = 0;

        // 获取绘图上下文
        var ctx = canvas.getContext('2d');
        for (var i = 0; i < num; i++) {
            // 保存当前状态
            ctx.save();
            // 开始一条新路径
            ctx.beginPath();
            // 位移到圆心，下面需要围绕圆心旋转
            ctx.translate(150, 150);
            // 从(0, 0)坐标开始定义一条新的子路径
            ctx.moveTo(0, 0);
            // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
            // ctx.rotate((360 / num * i + 360 / num / 2) * Math.PI/180);
            ctx.rotate((360 * (totolRotateNumber/getAllInputPercentage())) * Math.PI/180);
            totolRotateNumber += $scope.inputLists[i].percentage;
            // 绘制圆弧
            // ctx.arc(0, 0, 150, 0,  2 * Math.PI / num, false);
            ctx.arc(0, 0, 150, 0,  2 * Math.PI *($scope.inputLists[i].percentage/getAllInputPercentage()) , false);
            // if (i % 2 == 0) {
            //     ctx.fillStyle = '#ffb820';
            // }else{
            //     ctx.fillStyle = '#ffcb3f';
            // }
            ctx.fillStyle = $scope.inputLists[i].color;
            // 填充扇形
            ctx.fill();
            // 绘制边框
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'whitesmoke';
            ctx.stroke();
    
            // 文字
            // ctx.fillStyle = '#fff';
            // ctx.font="16px sans-serif";
            // ctx.fillText(i + 1, 100, 60);
    
            // 恢复前一个状态
            ctx.restore();
        }
    }

    // $scope.showAlert = function() {
    //     alert("123");
    // }

    //$showWinner = false;

    // var abc;
    $scope.rotatePieChart = function() {
        // console.log(showAlert);
        canvas.style.transform = 'rotate(-' + randomRotateDegree() +'deg)'; 
        // this.showAlert();
        setTimeout(() => {
            // $showWinner= true;

            // alert("666");
            var element = document.getElementById("winner");
            element.classList.remove("hidden-winner-text");
        }, 6000);
    }

   

    $scope.winner = "";

    randomRotateDegree = function() {
        //获取随机数
        var num = parseInt((Math.random()*($scope.inputLists.length)) + 1);
        // console.log("the number is: " + num);

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

        // abc = 360 * (getFinalRoundRotateAngles()/getAllInputPercentage());

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