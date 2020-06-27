function tbClass(min, max, r1, r2, dist){

  am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  var container = am4core.create("travellingBehaviour_canvas", am4core.Container);
  container.width = am4core.percent(100);
  container.height = am4core.percent(100);
  container.layout = "vertical";

  createBulletChart(container, "solid");
  // createBulletChart(container, "gradient");

  /* Create ranges */
  function createRange(axis, from, to, color, text) {
    var range = axis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.8;
    // range.label.disabled = true;
    range.grid.disabled = true;
    
    // range.label.inside = true;
    // range.label.text = "Goal";
    // range.label.fill = range.grid.stroke;
    // //range.label.align = "right";
    // range.label.verticalCenter = "bottom";

    range.label.text = text;
    range.label.disabled = false;
    range.label.rotation = 0;
    range.label.fill = am4core.color(color);
    range.label.adapter.add("verticalCenter", function() {
      return "left";
    });

    // range.renderer.opposite = false;
    // range.axisFill.tooltip = new am4core.Tooltip();
    // range.axisFill.tooltipText = text;
    // range.axisFill.interactionsEnabled = true;

    // range.axisFill.isMeasured = true;
    // range.label.inside = true;
    // range.label.text = "Goal";
    // range.label.text.rotation = 270;
    // range.text = "Hello";
  }

  /* Create bullet chart with specified color type for background */
  function createBulletChart(parent, colorType) {
    var colors = ["#19d228", "#f4fb16", "#fb7116"];

    /* Create chart instance */
    var chart = container.createChild(am4charts.XYChart);
    chart.paddingRight = 30;

    /* Add data */
    chart.data = [{
      "category": "Total Distance Travelled",
      "value": dist
      // "target": 78
    }];

    /* Create axes */
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fill = am4core.color("#dde1eb"); /****/

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 100;   //30
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = min-200;   //0
    valueAxis.max = max+200;   //100
    valueAxis.strictMinMax = true;
    valueAxis.numberFormatter.numberFormat = "#'km'";
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#dde1eb"); /****/
    // valueAxis.paddingTop = 25;
    valueAxis.renderer.opposite = true;
    // valueAxis.renderer.labels.template.rotation = 270;

    /* 
      In order to create separate background colors for each range of values, 
      you have to create multiple axisRange objects each with their own fill color 
    */
    if (colorType === "solid") {
      // var start = min, end = r1;
      // for (var i = 0; i < 3; ++i) {
      //   createRange(valueAxis, start, end, am4core.color(colors[i]));
      //   start += 20;
      //   end += 20;
      // }
      createRange(valueAxis, min-200, r1, am4core.color(colors[0]), "Rare");
      createRange(valueAxis, r1, r2, am4core.color(colors[1]), "Average");
      createRange(valueAxis, r2, max+200, am4core.color(colors[2]), "Frequent");
    }

    /*
      In order to create a gradient background, only one axisRange object is needed
      and a gradient object can be assigned to the axisRange's fill property. 
    */

    // else if (colorType === "gradient") {
    //   var gradient = new am4core.LinearGradient();
    //   for (var i = 0; i < 5; ++i) {
    //     // add each color that makes up the gradient
    //     gradient.addColor(am4core.color(colors[i]));
    //   }
    //   createRange(valueAxis, 0, 100, gradient);
    // }

    /* Create series */
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.fill = am4core.color("#aba4a4");
    series.columns.template.stroke = am4core.color("#000");
    series.columns.template.strokeWidth = 1;
    series.columns.template.strokeOpacity = 0.5;
    series.columns.template.height = am4core.percent(25);
    series.tooltipText = "{value}"


    // var series2 = chart.series.push(new am4charts.StepLineSeries());
    // series2.dataFields.valueX = "target";
    // series2.dataFields.categoryY = "category";
    // series2.strokeWidth = 3;
    // series2.noRisers = true;
    // series2.startLocation = 0.15;
    // series2.endLocation = 0.85;
    // series2.tooltipText = "{valueX}"
    // series2.stroke = am4core.color("#000");

    chart.cursor = new am4charts.XYCursor()
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    valueAxis.cursorTooltipEnabled = false;
    chart.arrangeTooltips = false;

    // let label = chart.createChild(am4core.Label);
    // label.text = "Hello world!";
    // label.fontSize = 20;
    // label.align = "center";
    // label.isMeasured = false;
    // label.x = 100;
    // label.y = 60;
  }

  }); // end am4core.ready()

}

function dbClass(mark, db){
  //Gauge Plugin
  (function () {
    if (!window.Chart) {
      return;
    }
    function GaugeChartHelper() {
    }
    GaugeChartHelper.prototype.setup = function(chart, config) {
      this.chart = chart;
      this.ctx = chart.ctx;
      this.limits = config.data.datasets[0].gaugeLimits;
      this.data = config.data.datasets[0].gaugeData;
      var options = chart.options;
      this.fontSize = 12;//options.defaultFontSize;
      this.fontStyle = options.defaultFontFamily;
      this.fontColor = "#dde1eb";//options.defaultFontColor;
      this.ctx.textBaseline = "alphabetic";
      this.arrowAngle = 30 * Math.PI / 180;   //25
      this.arrowColor = config.options.indicatorColor || options.arrowColor;
      this.showMarkers = typeof(config.options.showMarkers) === 'undefined' ? true : config.options.showMarkers;
      if (config.options.markerFormatFn) {
        this.markerFormatFn = config.options.markerFormatFn;
      } else {
        this.markerFormatFn = function(value) {
          return value;
        }
      }
    };
    GaugeChartHelper.prototype.applyGaugeConfig = function(chartConfig) {
      this.calcLimits();
      chartConfig.data.datasets[0].data = this.doughnutData;
      var ctx = this.ctx;
      var labelsWidth = this.limits.map(function(label){
        var text = this.markerFormatFn(label);
        return ctx.measureText(text).width;
      }.bind(this));
      // var padding = Math.max.apply(this, labelsWidth) + this.chart.width / 35;    //35
      var padding = 20  ;
      // var heightRatio = this.chart.height / 10;     //50
      var heightRatio = 10;
      chartConfig.options.layout.padding = {
        top: this.fontSize + heightRatio,
        left: padding,
        right: padding,
        bottom: heightRatio * 2
      };
    };
    GaugeChartHelper.prototype.calcLimits = function() {
      var limits = this.limits;
      var data = [];
      var total = 0;
      for (var i = 1, ln = limits.length; i < ln; i++) {
        var dataValue = Math.abs(limits[i] - limits[i - 1]);
        total += dataValue;
        data.push(dataValue);
      }
      this.doughnutData = data;
      var minValue = limits[0];
      var maxValue = limits[limits.length - 1];
      this.isRevers = minValue > maxValue;
      this.minValue = this.isRevers ? maxValue : minValue;
      this.totalValue = total;
    };
    GaugeChartHelper.prototype.updateGaugeDimensions = function() {
      var chartArea = this.chart.chartArea;
      this.gaugeRadius = this.chart.innerRadius;
      this.gaugeCenterX = (chartArea.left + chartArea.right) / 2;
      this.gaugeCenterY = (chartArea.top + chartArea.bottom + this.chart.outerRadius) / 2;
      this.arrowLength = this.chart.radiusLength * 2;   //2
    };
    GaugeChartHelper.prototype.getCoordOnCircle = function(r, alpha) {
      return {
        x: r * Math.cos(alpha),
        y: r * Math.sin(alpha)
      };
    };
    GaugeChartHelper.prototype.getAngleOfValue = function(value) {
      var result = 0;
      var gaugeValue = value - this.minValue;
      if (gaugeValue <= 0) {
        result = 0;
      } else if (gaugeValue >= this.totalValue) {
        result = Math.PI;
      } else {
        result = Math.PI * gaugeValue / this.totalValue;
      }
      if (this.isRevers) {
        return Math.PI - result;
      } else {
        return result;
      }
    };
    GaugeChartHelper.prototype.renderLimitLabel = function(value) {
      var ctx = this.ctx;
      var angle = this.getAngleOfValue(value);
      var coord = this.getCoordOnCircle(this.chart.outerRadius + (this.chart.radiusLength / 2), angle);
      var align;
      var diff = angle - (Math.PI / 2);
      if (diff > 0) {
        align = "left";
      } else if (diff < 0) {
        align = "right";
      } else {
        align = "center";
      }
      ctx.textAlign = align;
      ctx.font = this.fontSize + "px " + this.fontStyle;
      ctx.fillStyle = this.fontColor;
      var text = this.markerFormatFn(value);
      ctx.fillText(text, this.gaugeCenterX - coord.x, this.gaugeCenterY - coord.y);
    };
    GaugeChartHelper.prototype.renderLimits = function() {
      for (var i = 0, ln = this.limits.length; i < ln; i++) {
        this.renderLimitLabel(this.limits[i]);
      }
    };
    GaugeChartHelper.prototype.renderValueLabel = function() {
      var label = this.data.value.toString();
      var ctx = this.ctx;
      ctx.font = "30px " + this.fontStyle;
      var stringWidth = ctx.measureText(label).width;
      var elementWidth = 0.75 * this.gaugeRadius * 2;
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var fontSizeToUse = Math.min(newFontSize, this.gaugeRadius);
      ctx.textAlign = "center";
      ctx.font = fontSizeToUse + "px " + this.fontStyle;
      ctx.fillStyle = this.data.valueColor || this.fontColor;
      ctx.fillText(label, this.gaugeCenterX, this.gaugeCenterY);
    };
    GaugeChartHelper.prototype.renderValueArrow = function(value) {
      var angle = this.getAngleOfValue(typeof value === "number" ? value : this.data.value);
      this.ctx.globalCompositeOperation = "source-over";
      this.renderArrow(this.gaugeRadius, angle, this.arrowLength, this.arrowAngle, this.arrowColor);
    };
    GaugeChartHelper.prototype.renderSmallValueArrow = function(value) {
      var angle = this.getAngleOfValue(value);
      this.ctx.globalCompositeOperation = "source-over";
      this.renderArrow(this.gaugeRadius - 1, angle, this.arrowLength - 1, this.arrowAngle, this.arrowColor);
    };
    GaugeChartHelper.prototype.clearValueArrow = function(value) {
      var angle = this.getAngleOfValue(value);
      this.ctx.lineWidth = 2;
      this.ctx.globalCompositeOperation = "destination-out";
      this.renderArrow(this.gaugeRadius - 1, angle, this.arrowLength + 1, this.arrowAngle, "#FFFFFF");
      this.ctx.stroke();
    };
    GaugeChartHelper.prototype.renderArrow = function(radius, angle, arrowLength, arrowAngle, arrowColor) {
      var coord = this.getCoordOnCircle(radius, angle);
      var arrowPoint = {
        x: this.gaugeCenterX - coord.x,
        y: this.gaugeCenterY - coord.y
      };
      var ctx = this.ctx;
      ctx.fillStyle = arrowColor;
      ctx.beginPath();
      ctx.moveTo(arrowPoint.x, arrowPoint.y);
      coord = this.getCoordOnCircle(arrowLength, angle + arrowAngle);
      ctx.lineTo(arrowPoint.x + coord.x, arrowPoint.y + coord.y);
      coord = this.getCoordOnCircle(arrowLength, angle - arrowAngle);
      ctx.lineTo(arrowPoint.x + coord.x, arrowPoint.y + coord.y);
      ctx.closePath();
      ctx.fill();
    };
    GaugeChartHelper.prototype.animateArrow = function() {
      var stepCount = 30;
      var animateTimeout = 300;
      var gaugeValue = this.data.value - this.minValue;
      var step = gaugeValue / stepCount;
      var i = 0;
      var currentValue = this.minValue;
      var interval = setInterval(function() {
        i++;
        this.clearValueArrow(currentValue);
        if (i > stepCount) {
          clearInterval(interval);
          this.renderValueArrow();
        } else {
          currentValue += step;
          this.renderSmallValueArrow(currentValue);
        }
      }.bind(this), animateTimeout / stepCount);
    };
    Chart.defaults.tsgauge = {
      animation: {
        animateRotate: true,
        animateScale: false
      },
      cutoutPercentage: 96,   //95
      rotation: Math.PI,
      circumference: Math.PI,
      legend: {
        display: false
      },
      scales: {},
      arrowColor: "#444"
    };
    Chart.controllers.tsgauge = Chart.controllers.doughnut.extend({
      initialize: function(chart) {
        var gaugeHelper = this.gaugeHelper = new GaugeChartHelper();
        gaugeHelper.setup(chart, chart.config);
        gaugeHelper.applyGaugeConfig(chart.config);
        chart.config.options.animation.onComplete = function(chartElement) {
          gaugeHelper.updateGaugeDimensions();
          gaugeHelper.animateArrow();
        };
        Chart.controllers.doughnut.prototype.initialize.apply(this, arguments);
      },
      draw: function() {
        Chart.controllers.doughnut.prototype.draw.apply(this, arguments);
        var gaugeHelper = this.gaugeHelper;
        gaugeHelper.updateGaugeDimensions();
        gaugeHelper.renderValueLabel();
        if (gaugeHelper.showMarkers) {
          gaugeHelper.renderLimits();
        }
        gaugeHelper.renderSmallValueArrow(gaugeHelper.minValue);
      }
    });
  })();

//Chart setup

  var ctx = document.getElementById("chartjs-gauge").getContext("2d");
  new Chart(ctx, {
    type: "tsgauge",
    data: {
      datasets: [{
        backgroundColor: ["limegreen", "gold", "red"],
        borderWidth: 0,
        gaugeData: {
          value: mark,
          valueColor: "#ff7143"
        },
        gaugeLimits: [0, 1.5, 6.0, 10],
      }]
    },
    options: {
      events: [],
      showMarkers: true,
      layout: {
        padding: {
          left: 100,
          right: 100,
          top: 0,
          bottom: 10
        }
      }
      // markerFormatFn: n => n % 20 === 0 ? n.toString() : '',
    }
  });
}