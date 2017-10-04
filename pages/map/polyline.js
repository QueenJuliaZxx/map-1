var amapFile = require('../../utils/amap-wx.js');
Page({
  data: {
    latitude: 23.05,
    longitude: 113.76,
    markers: [],
    distance: '',
    polyline: []
  },
  onLoad: function (options) {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: function () {
        _this.setData({
          latitude: 23.05,
          longitude: 113.76
        });
      },
      complete: function(){
        let distance = Math.abs(_this.data.longitude - options.longitude) + Math.abs(_this.data.latitude - options.latitude)
        console.log(distance);
        var myAmapFun = new amapFile.AMapWX({ key: '2b9a90d2d9ac9ab1902ec83603b144a4' });
        let routeData = {
          origin: options.longitude + ',' + options.latitude,
          destination: _this.data.longitude + ',' + _this.data.latitude,
          success: function (data) {
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            _this.setData({
              markers: [{
                latitude: options.latitude,
                longitude: options.longitude
              }, {
                latitude: _this.data.latitude,
                longitude: _this.data.longitude
              }],
              polyline: [{
                points: points,
                color: "#0091ff",
                width: 6
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              _this.setData({
                distance: data.paths[0].distance + '米'
              });
            }
          },
          fail: function (info) {
          }
        }
        if (distance < 0.85){
          // getWalkingRoute 步行
          myAmapFun.getWalkingRoute(routeData)
        }else{
          // getDrivingRoute 驾车
          myAmapFun.getDrivingRoute(routeData)
        }
      }
    })
  },
})