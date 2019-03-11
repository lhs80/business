//地图底图配置
export function baseLayers(L) {
  return {
    高德地图: {
      show: true,
      imageUrl: "/static/img/map/gaodeMap.png",
      mapUrl: L.tileLayer(
        "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        { subdomains: "1234" }
      )
    },
    高德影像: {
      show: false,
      imageUrl: "/static/img/map/gaodeImg.png",
      mapUrl: L.layerGroup([
        L.tileLayer(
          "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          { subdomains: "1234" }
        ),
        L.tileLayer(
          "http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
          { subdomains: "1234" }
        )
      ])
    }
    // 天地图: {
    //   show: false,
    //   imageUrl: require("@/assets/images/poi/htmlOverlay.png"),
    //   mapUrl: L.layerGroup([
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     ),
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     )
    //   ])
    // },
    // 天地图影像: {
    //   show: false,
    //   imageUrl: require("@/assets/images/poi/htmlOverlay.png"),
    //   mapUrl: L.layerGroup([
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     ),
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     )
    //   ])
    // },
    // 天地图地形: {
    //   show: false,
    //   imageUrl: require("@/assets/images/poi/htmlOverlay.png"),
    //   mapUrl: L.layerGroup([
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     ),
    //     L.tileLayer(
    //       "http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",
    //       { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    //     )
    //   ])
    // },
    // "Google地图(偏)": {
    //   show: false,
    //   imageUrl: require("@/assets/images/poi/htmlOverlay.png"),
    //   mapUrl: L.tileLayer(
    //     "http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile"
    //   )
    // },
    // Google影像: {
    //   show: false,
    //   imageUrl: require("@/assets/images/poi/htmlOverlay.png"),
    //   mapUrl: L.layerGroup([
    //     L.tileLayer(
    //       "http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}"
    //     ),
    //     L.tileLayer("http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}")
    //   ])
    // }
    //		"GeoQ(偏) ": {
    //			show:false,
    //			imageUrl:require("@/assets/images/poi/htmlOverlay.png"),
    //			mapUrl:L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}')
    //		},
    //		"GeoQ 藏蓝(偏)":{
    //			show:false,
    //			imageUrl:require("@/assets/images/poi/htmlOverlay.png"),
    //			mapUrl:L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}')
    //		},
    //		"GeoQ 灰(偏)": {
    //			show:false,
    //			imageUrl:require("@/assets/images/poi/htmlOverlay.png"),
    //			mapUrl:L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}')
    //		}
  };
}
//添加线路
export function writeLine(L, lineCode) {
  return {
    line: L.polyline(lineCode, { color: "red", type: "line" })
  };
}
//添加自己图片的点
export function addMyImgPoint(limit, iconUrl) {
  let myMarker = L.marker(limit, {
    icon: new L.icon({
      iconUrl: iconUrl,
      iconSize: [24, 41],
      iconAnchor: [20, 40]
    }),
    type: "point"
  });
  return myMarker;
}
//删除地图上所有点和线
export function removeLineAndPoint(mapLayers) {
  let allLayer = mapLayers;
  for (let key in allLayer) {
    let layer = allLayer[key];
    let type = layer.options.type;
    if (type == "line" || type == "point") {
      layer.remove();
    }
  }
}

//高德的请求路径
export function getGaoDeUrl(){
  let url= "https://restapi.amap.com/v3/direction/walking?key=fe66b9773bf46c56557dea22f9a637db"; 
  return  url;
}

//继承标注聚合
export function initCustomMarkerClusterGroup(L) {
  // 继承MarkerClusterGroup 编写自定义方法
  L.CustomMarkerClusterGroup = L.MarkerClusterGroup.extend({
    // 添加图层
    addLayerEntityId: function(entityId, layer) {
      let flag = this.hasLayerByEntityId(entityId);
      if (flag) this.removeLayerByEntityId(entityId);
      this.addLayer(layer);
    },
    // 通过自定义EntityId获取图层
    getLayerByEntityId: function(entityId) {
      let layers = this.getLayers(),
        result;
      for (let i = 0, len = layers.length; i < len; i++) {
        let lay = layers[i];
        let eId = lay.options.attribution.entityId;
        if (eId && eId == entityId) {
          result = lay;
          break;
        }
      }
      return result;
    },
    // 通过自定义EntityId判断图层存不存在
    hasLayerByEntityId: function(entityId) {
      let lay = this.getLayerByEntityId(entityId),
        flag = false;
      if (lay) flag = true;
      return flag;
    },
    // 通过自定义EntityId删除图层
    removeLayerByEntityId: function(entityId) {
      let layer = this.getLayerByEntityId(entityId);
      if (layer) this.removeLayer(layer);
    },
    // 设置所有图层的透明度
    setAllLayerOpacity: function(number) {
      let layers = this.getLayers();
      for (let i = 0, len = layers.length; i < len; i++) {
        let lay = layers[i];
        if (number != lay.options.opacity) lay.setOpacity(number);
      }
    },
    // 通过自定义EntityId更改图层的透明度
    setLayerOpacity: function(entityId, number) {
      let lay = this.getLayerByEntityId(entityId);
      lay.setOpacity(number);
    },
    // 气泡操作
    popupEntityId: function() {
      let layers = this.getLayers();
      // 关闭所有气泡
      for (let i = 0, len = layers.length; i < len; i++) {
        let layer = layers[i];
        layer.closePopup();
      }
      // 打开不是聚合标注的气泡
      let featureGroupLayers = this._featureGroup._layers;
      for (let key in featureGroupLayers) {
        let layer = featureGroupLayers[key];
        let childCount = layer._childCount;
        if (!childCount) {
          layer.openPopup();
        }
      }
    },
    // 通过自定义EntityId打开气泡
    openPopupEntityId: function(entityId) {
      let layer = this.getLayerByEntityId(entityId);
      layer.openPopup();
    }
  });
}

//添加标注点
export function addMarker(LGroup, Lmap, MData) {
  var latlng = L.latLng(MData.lat, MData.lng);
  var marker = L.marker(latlng, {
    draggable: false,
    attribution: MData,
    title: MData.name,
    icon: new L.icon({
      iconUrl: MData.imgPath,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    }),
    opacity: 0.5,
    type: "point"
  });
  // 气泡
  if (MData.name) {
    // 给气泡文本添加点击事件
    var domElem = document.createElement("span");
    domElem.innerHTML = MData.name;
    domElem.onclick = function() {
      console.info(MData.name);
    };
    // 气泡
    let popup = L.popup({
      maxWidth: 300,
      closeButton: false,
      autoClose: false,
      autoPan: false,
      keepInView: false,
      closeOnClick: false,
      closeOnEscapeKey: false,
      className: "poi-popup"
    })
      .setLatLng(latlng)
      .setContent(domElem)
      .openOn(Lmap);
    // 绑定气泡
    marker.bindPopup(popup);
  }
  // 清空click事件
  marker.off("click");

  if (LGroup instanceof L.FeatureGroup) {
    LGroup.addLayer(marker);
  } else if (LGroup instanceof L.MarkerClusterGroup) {
    LGroup.addLayerEntityId(MData.entityId, marker);
  }
  LGroup.addTo(Lmap);
}
//添加带有overlay的标注点
export function addOverlayMarker(LGroup) {
  // markerLayer = new L.FeatureGroup();
  var popupHtml =
    "<b>" +
    "" +
    "</b><br><hr style='margin:5px'/>" +
    "<p style='margin:0px; margin-top:5px'>" +
    "" +
    "</p>" +
    "<p style='margin:0px; margin-top:5px'>" +
    "" +
    "</p>";
  var popup = L.popup({
    maxWidth: 300,
    maxHeight: 200
  }).setContent(popupHtml);

  //lon: 122.1543,lat: 37.5216
  //lng:120 - 122
  //lat:35.5 - 38
  for (var i = 0; i < 5000; i++) {
    //var i = 0;
    var lng = Math.random() * (122 - 119) + 119; //122.1543;//
    var lat = Math.random() * (38 - 35) + 35; //37.5216;//

    var latlng = L.latLng(lat, lng);
    var marker = L.marker(latlng, {
      draggable: false,
      attribution: i,
      title: i,
      icon: new L.icon({
        iconUrl: "images/DefaultIcon.png",
        iconSize: [40, 40],
        iconAnchor: [20, 0]
      })
    }).on("click", markerOver); //.bindPopup(popup);
    markerLayer.addLayer(marker);
  }
  markerLayer.addTo(map);
}
//添加聚合点
export function initMarkerCluster() {
  markerLayer = new L.FeatureGroup();
  /*var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            spiderfyOnMaxZoom: false
        });*/

  //lon: 122.1543,lat: 37.5216
  //lng:120 - 122
  //lat:35.5 - 38
  for (var i = 0; i < 2000; i++) {
    var lng = Math.random() * (122 - 119) + 119;
    var lat = Math.random() * (38 - 35) + 35;
    var latlng = L.latLng(lat, lng);

    var popupHtml =
      "<p style='margin:0px;border-radius: 50%;width:50px;height:50px;background: red;'>" +
      "dgdgdgf" +
      "</p>";

    var popup = L.popup({
      maxWidth: 50,
      maxHeight: 50,
      className: "layer-marp-marker-up",
      closeButton: false
    }).setContent(popupHtml);

    var marker = L.marker(latlng, {
      draggable: false,
      attribution: i,
      title: i,
      icon: new L.icon({
        iconUrl: "images/htmlOverlay.png",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: "marker-myself"
      })
    })
      .on("mouseover", markerOver)
      .on("mouseout", markerOut); /*.bindPopup(popup).openPopup()*/ //.
    markerLayer.addLayer(marker);

    layrId[i] = markerLayer.getLayerId(marker);
  }
  map.addLayer(markerLayer);
}

//添加一个标注

// export function addMarker(L) {
//   /*https://restapi.amap.com/v3/ip?ip=114.247.50.2&output=xml&key=<用户的key>*/
// }

//定位到当前经纬度点
export function locationLngLat(L) {}

//定位到当前bond范围
export function locationBands(L) {}

/*export {
	baseLayers
}*/

/*const baseLayers = {
	"高德地图(偏)": L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: "1234" }),
	"高德影像(偏)": L.layerGroup([
	    L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', { subdomains: "1234" }),
	    L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8', { subdomains: "1234" })
	]),
	
	"天地图": L.layerGroup([
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}', {  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
	]),
	"天地图影像": L.layerGroup([
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}', {  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
	]),
	"天地图地形": L.layerGroup([
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
	    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
	]),
	
	"Google地图(偏)": L.tileLayer('http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile'),
	"Google影像": L.layerGroup([
	    L.tileLayer('http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}'),
	    ]),
	
	"GeoQ(偏) ": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'),
	"GeoQ 藏蓝(偏)": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'),
	"GeoQ 灰(偏)": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}')
};*/
