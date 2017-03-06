/**
 * Created by 04259 on 2017-02-16.
 */
var markerIndex = 0;
var map;

function $(a) {
    return document.getElementById(a);
}
var data = [];
window.init = function () {
    console.log('-->', latLng.length)

    //optData();
    // return
    data = optData();
    var Map = qq.maps.Map;
    var Marker = qq.maps.Marker;
    var LatLng = qq.maps.LatLng;
    var Event = qq.maps.event;

    var MarkerImage = qq.maps.MarkerImage;
    var MarkerShape = qq.maps.MarkerShape;
    var MarkerAnimation = qq.maps.MarkerAnimation;
    var Point = qq.maps.Point;
    var Size = qq.maps.Size;
    var ALIGN = qq.maps.ALIGN;

    var MVCArray = qq.maps.MVCArray;
    var MarkerCluster = qq.maps.MarkerCluster;
    var Cluster = qq.maps.Cluster;
    var MarkerDecoration = qq.maps.MarkerDecoration;

    var forEach = function (array, fun) {
        for (var i = 0, l = array.length; i < l; ++i) {
            if (fun(array[i], i) === false) {
                return false;
            }
        }
    };

    var latlng = new LatLng(33.4230, 104.2115);
    var options = {
        'zoom': 5 ,
        'center': latlng,
        // mapTypeId:qq.maps.MapTypeId.//"roadmap"
        // qq.maps.MapTypeId.SATELLITE//
        //mapTypeId: qq.maps.MapTypeId.HYBRID
        //'mapTypeId':qq.maps.MapTypeId.SATELLITE
         'mapTypeId': qq.maps.MapTypeId.HYBRID
    };

    var map = new Map($('map_canvas'), options);

    var markers = new MVCArray();
    var markerCluster;
    /*for(var i=0;i<data.;i++){
     data.push([28.4230+20*Math.random()-i%9,  104.2115+30*Math.random()-i%9])
     }*/


    function optData() {
        /*latLng.sort(function(a,b){

         if(a[0]>b[0]){
         return 0
         }else{
         return 1
         }


         }


         );*/
        latLng.sort(function (a, b) {
            return Math.random() > .5 ? -1 : 1;
        });
        return latLng;

        for (var key in hashMap) {
            var strs = key.split("_")
            var info = '{'
            info += '"from": "' + strs[0] + ',' + strs[1] + '",'
            info += '"to": "' + '"28.4230, 104.2115"'
            info += '},'
            //console.log(info)
        }
        // console.log("---hashMap>>",hashMap)


    }

    function rlt() {
        //地图异步加载，在idle或者tilesloaded后初始化
        qq.maps.event.addListenerOnce(map, "idle", function () {
            if (QQMapPlugin.isSupportCanvas) {
                heatmap = new QQMapPlugin.HeatmapOverlay(map,
                    {
                        //点半径，设置为1即可
                        "radius": 0.1,
                        //热力图最大透明度
                        "maxOpacity": 0.3,
                        //是否在每一屏都开启重新计算，如果为true则每一屏都会有一个红点
                        "useLocalExtrema": true,
                        //设置大小字段
                        "valueField": 'count'
                    }
                );
                //test data form baidu.com
                testData = {
                    max: 9000,
                    data: []

                };
                testData.data = latLng_llt;
                console.log(testData.data.length)

                //绘制热力图
                heatmap.setData(testData);
            } else {
                alert("您的浏览器不支持canvas，无法绘制热力图！！")
            }

        });
    }


    function createCluster() {
        //data.length
        //var decoration = new MarkerDecoration(i, new Point(0, -5));
        //console.log('createCluster')

        markerClusterer = new MarkerCluster({
            map: map,
            minimumClusterSize: 2, //默认2
            markers: markers,
            zoomOnClick: true, //默认为true
            gridSize: 2, //默认60
            averageCenter: true, //默认false
            maxZoom:2, //默认18
        });
        var tmp = 0
        var addArr = [];

        function myInterval() {
            findTarget($('map_canvas'))
            if (tmp > data.length) {
                tmp = 0
            }
            var i = 0 + tmp
            tmp = Math.round(i + Math.random() * 50);


            for (; i < data.length && i < tmp; i++) {
                var latLng = new LatLng(data[i][1], data[i][0]);
                var anchor = new qq.maps.Point(1, 1),
                    size = new qq.maps.Size(2, 2),
                    origin = new qq.maps.Point(0, 0);

                icon = new qq.maps.MarkerImage('img/circle000' + i % 9 + '.png', size, origin, anchor);


                var marker = new qq.maps.Marker({
                    icon: icon,
                    // animation: qq.maps.MarkerAnimation.UP,
                    map: map,
                    position: latLng
                });
                addArr.push(marker);

            }

            for (var t = 0; (addArr.length) > 500; t++) {
                try {
                    addArr.shift().setMap(null)

                } catch (err) {
                    //console.log('---22---------',err)
                }

                //addArr[t].unbindAll();addArr.shift()
            }

            //   console.log('--markers.length-->>',markerClusterer.markers.getLength(),addArr.length)


        }


        setInterval(myInterval, 50);//1000为1秒钟
        
    };

    createCluster();
    //rlt();


    function findTarget(map_canvas) {

        //  var map_canvas =;
        // console.log('map_canvas',map_canvas.childNodes);
        // console.log(map_canvas.childNodes.length)
        for (var i = 0; i < map_canvas.childNodes.length; i++) {
            var child = map_canvas.childNodes[i];
           // console.log('smnoprint---',child)
            if (child.__src__ != null && child.__src__.indexOf('map.gtimg.com') > 0) {
                child.style.filter = ' brightness(0.2)';
            }else if(child.style!= null && (child.style.zIndex ==1000000|| child.style.margin == '5px')){
              //  child.style.zIndex = -1
                //child.parent
                map_canvas.removeChild(child)
            //    console.log('--------------------',child,child.id);
            }

            if (child != null) {
                findTarget(child)
            }
        }

        //   console.log('map_canvas',map_canvas.getElementsByTagName('ccssprite'));
    }

    var imgPath = "./images/";
    var Styles = {
        "People": [
            {
                icon: new MarkerImage('img/plane.png', new Size(35, 35), new Point(0, 0), new Point(16, 0)),
                text: new MarkerDecoration('<font style="color:#ff00ff;font-size:10px;font-weight:bold;">{num}</font>', new Point(0, 5))
            }
        ],
        "Conversation": [
            {
                icon: new MarkerImage('img/plane.png', new Size(30, 27), new Point(0, 0), new Point(3, 0)),
                text: new MarkerDecoration('<font style="color:#ff00ff;font-size:10px;font-weight:bold;">{num}</font>', new Point(0, -2))
            }
        ]
    };

    var maker_add;

    function addMarker(index) {
        var latLng = new LatLng(39.849558, 116.406893);
        var decoration = new MarkerDecoration(index, new Point(0, -5));
        maker_add = new Marker({
            'position': latLng,
            decoration: decoration,
            map: map
        });
        markers.push(maker_add);

        markerClusterer.addMarker(maker_add);
    }

    var markers_add = [];

    function addMarkers() {
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var lngSpan = Math.abs(sw.getLng() - ne.getLng());
        var latSpan = Math.abs(ne.getLat() - sw.getLat());
        var decoration = new MarkerDecoration(i, new Point(0, -5));
        for (var i = 0; i < 100; i++) {
            var position = new qq.maps.LatLng(ne.getLat() - latSpan, sw.getLng() + lngSpan);
            var makeradd = new Marker({
                'position': position,
                decoration: decoration,
                map: map
            });
            markers_add.push(makeradd);
        }

        markerClusterer.addMarkers(markers_add);
    }

    function removeMarker() {
        markerClusterer.removeMarker(maker_add);
    }

    function removeMarkers() {
        markerClusterer.removeMarkers(markers_add);
    }

    function clearMarkers() {
        markerClusterer.clearMarkers();
    }

    function setMarkerClusterOption(key, value) {
        markerClusterer.set(key, value);
    }

    var setKeyHandle = {
        'gridSize': 'setGridSize',
        'maxZoom': 'setMaxZoom',
        'averageCenter': 'setAverageCenter'
    };

    var getKeyHandle = {
        'gridSize': 'getGridSize',
        'maxZoom': 'getMaxZoom',
        'averageCenter': 'getAverageCenter'
    };

    var gridSize = $("gridSize");


    var maxZoom = $("maxZoom");


    var addmarker = $("addMarkerBt");


    var removeMarkerb = $("removeMarkerBt");


    var addmarker = $("addMarkersBt");


    var removeMarkerb = $("removeMarkersBt");


    var clearMarkerb = $("clearMarkersBt");


    var minimumClusterSize = $("minimumClusterSize");


    var averageCenter_true = $("averageCenter_true");


    var averageCenter_false = $("averageCenter_false");

    var zoomOnClick_true = $("zoomOnClick_true");


    var zoomOnClick_false = $("zoomOnClick_false");


    var stylesSelect = $("styles");

};

/*
 var anchor = new qq.maps.Point(4, 4);
 var size = new qq.maps.Size(8, 8);
 var origin = new qq.maps.Point(0, 0);
 //http://www.easyicon.net/api/resizeApi.php?id=1104055&size=16
 var icon = new qq.maps.MarkerImage('./img/car.png', size, origin, anchor);
 //var sizeScale = new qq.maps.Size(6, 6);
 var originShadow = new qq.maps.Point(0, 0);
 var shadowSize = new qq.maps.Size(2, 2);
 var shadow =new qq.maps.MarkerImage(
 './img/car.png',
 shadowSize,
 originShadow,
 anchor
 );
 var marker = new Marker({
 icon: icon,
 'position':latLng,
 map:map,
 shadow: shadow,
 animation: qq.maps.MarkerAnimation.BOUNCE
 });*/