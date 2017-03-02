var BridgeUtils = require("./bridgeUtils");

module.exports = {

    agent : navigator.userAgent.toLowerCase(),

    isWebKit: function() {
        return this.agent.indexOf(' applewebkit/') > -1;
    },

    isChrome: function() {
        return /chrome\/(\d+\.\d)/i.test(this.agent);
    },

    cjkEncode: function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== 'string') {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {//91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText
    },

    cjkEncodeDO: function (o) {
        var self = this;
        if ($.isPlainObject(o)) {
            var result = {};
            $.each(o, function (k, v) {
                if (!(typeof v == "string")) {
                    v = self.jsonEncode(v);
                }
                //wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = self.cjkEncode(k);
                result[k] = self.cjkEncode(v);
            });
            return result;
        }
        return o;
    },

    /**
     * 将cjkEncode处理过的字符串转化为原始字符串
     *
     * @static
     * @param text 需要做解码的字符串
     * @return {String} 解码后的字符串
     */
    cjkDecode: function (text) {
        if (text == null) {
            return "";
        }
        //查找没有 "[", 直接返回.  kunsnat:数字的时候, 不支持indexOf方法, 也是直接返回.
        if (!isNaN(text) || text.indexOf('[') == -1) {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch == '[') {
                var rightIdx = text.indexOf(']', i + 1);
                if (rightIdx > i + 1) {
                    var subText = text.substring(i + 1, rightIdx);
                    //james：主要是考虑[CDATA[]]这样的值的出现
                    if (subText.length > 0) {
                        ch = String.fromCharCode(eval("0x" + subText));
                    }

                    i = rightIdx;
                }
            }

            newText += ch;
        }

        return newText;
    },

    //json encode
    jsonEncode: function (o) {
        var self = this;
        //james:这个Encode是抄的EXT的
        var useHasOwn = {}.hasOwnProperty ? true : false;

        // crashes Safari in some instances
        //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
        };

        var encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : self.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if ($.isArray(o)) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            /*
             * alex:原来只是把年月日时分秒简单地拼成一个String,无法decode
             * 现在这么处理就可以decode了,但是JS.jsonDecode和Java.JSONObject也要跟着改一下
             */
            return self.jsonEncode({
                __time__: o.getTime()
            })
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else if ($.isFunction(o)) {
            return String(o);
        } else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(self.jsonEncode(i), ":",
                                v === null ? "null" : self.jsonEncode(v));
                            b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    },
    /**
     * hiram 优化了一下，但仅为了找o.__time__还是多耗了点时间
     * richie:为了找__time__，需要把整个JSON树都遍历一遍，耗时不少，应该要想办法优化
     */
    jsonDecode: function (text) {
        try {
            // 注意0啊
            //var jo = $.parseJSON(text) || {};
            var jo = $.parseJSON(text);
            if (jo == null) {
                jo = {};
            }
        } catch (e) {
            /*
             * richie:浏览器只支持标准的JSON字符串转换，而jQuery会默认调用浏览器的window.JSON.parse()函数进行解析
             * 比如：var str = "{'a':'b'}",这种形式的字符串转换为JSON就会抛异常
             */
            try {
                jo = new Function("return " + text)() || {};
            } catch (e) {
                //do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!this._hasDateInJson(text)) {
            return jo;
        }
        return (function (o) {
            if (typeof o === "string") {
                return o;
            }
            if (o && o.__time__ != null) {
                return new Date(o.__time__);
            }
            for (var a in o) {
                if (o[a] == o || typeof o[a] == 'object' || $.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    },

    _hasDateInJson: function (json) {
        if (!json || typeof json !== "string") {
            return false;
        }
        return json.indexOf("__time__") != -1;
    },

    /**
     * URLdecode时候+和%要特别处理
     * @static
     * @param {String} s 原始字符串
     * @return {String} 编码后的字符串
     */
    encodePrecentPlus: function (s) {
        if (typeof(s) == "string") {
            s = s.replace(/%/gi, "%25");
            s = s.replace(/\+/gi, "%2B");
        } else if ($.isArray(s)) {
            for (var i = 0; i < s.length; i++) {
              s[i] = this.encodePrecentPlus(s[i]);
            }
        }
        return s;
    },

    //noBirdige: 不需要走jsbridge,直接走正常的ajax请求
    ajax: function (options, noBridge) {
        var self = this;
        if (options) {
            if(!options.data) {
                options.data = {};
            }
            options.data.__device__ = this.getDeviceType();
            options.url = this.cjkEncodeDO(options.url);
            options.data = this.cjkEncodeDO(options.data);
            if(window.FRCustomAjax && (device.tablet() || device.mobile())) {
                var method = window.FRCustomAjax.method;
                var urlKey = window.FRCustomAjax.urlKey;
                var urlValue = window.FRCustomAjax.urlValue;
                var parameterKey = window.FRCustomAjax.parameterKey;
                var successKey = window.FRCustomAjax.successKey;
                var failKey = window.FRCustomAjax.failKey;

                var ajaxStr = method + "({" +
                    urlKey + ":'" + urlValue + "'," +
                    parameterKey + ":" + JSON.stringify(options.data) + "," +
                    successKey + ":" + options.success + "," +
                    failKey + ":" + options.error
                + "})";
                (new Function(ajaxStr))();
                return ;
            }
            if(noBridge) {
                $.ajax(options);
                return ;
            }
            var success = options.success.clone();
            options.success = (function(successClone) {
                return function(result) {
                    var jsBridge = window.JSBridge;
                    if(jsBridge) {
                        var uniqueFunctionName = "F" + (new Date()).getTime() + Math.floor(Math.random() * 10000);
                        jsBridge[uniqueFunctionName] = function(response) {
                            var jsonData = (response == "") ? {} : JSON.parse(response);
                            successClone(self.jsonEncode(jsonData));
                            delete jsBridge[uniqueFunctionName];
                        }
                        var jsonResult = self.jsonDecode(result);
                        if(jsonResult == null || (typeof jsonResult == "object" && jsonResult.length === 0) ) {
                            jsonResult = result;
                        }
                        if(jsBridge.callHandler) {
                            jsBridge.callHandler("dataDecrypt", self.json2String(jsonResult), jsBridge[uniqueFunctionName]);
                        } else if(jsBridge.dataDecrypt) {
                            jsBridge.dataDecrypt(self.json2String(jsonResult), "window.JSBridge." + uniqueFunctionName);
                        } else {
                            successClone(result);
                        }
                    } else {
                        successClone(result);
                    }
                }
            })(options.success.clone());
        }
        var jsBridge = window.JSBridge;
        if(jsBridge && !noBridge) {
            var uniqueFunctionName = "F" + (new Date()).getTime() + Math.floor(Math.random() * 10000);
            jsBridge[uniqueFunctionName] = function(response) {
                response = response;
                options.data = JSON.parse(response);
                var tempZepto = $;
                tempZepto.ajax(options);
                delete jsBridge[uniqueFunctionName];
            }
            if(jsBridge.callHandler) {
                jsBridge.callHandler("dataEncrypt", self.json2String(options.data), jsBridge[uniqueFunctionName]);
            } else if(jsBridge.dataEncrypt) {
                jsBridge.dataEncrypt(self.json2String(options.data), "window.JSBridge." + uniqueFunctionName);
            } else {
                var tempZepto = $;
                tempZepto.ajax(options);
            }
        } else {
            var tempZepto = $;
            tempZepto.ajax(options);
        }
    },

    json2String: function(json) {
        var result = (typeof json == "string") ? json : JSON.stringify(json);
        return result;
    },

    //因为androidPad上device.js判断有问题
    isWeiXinAndroidPad: function () {
        var userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf('pad') >= 0 && userAgent.indexOf('micromessenger') >= 0;
    },

    isDingDingAndroidPad: function () {
        var userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf('pad') >= 0 && userAgent.indexOf('dingtalk') >= 0;
    },

    isMiPad: function() {
        var userAgent = navigator.userAgent.toLowerCase();
        return device.android() && userAgent.indexOf('pad') >= 0;
    },

    getDeviceType: function() {
        if(device.iphone() || device.ipod()) {
            return "iPhone";
        } else if(device.ipad()) {
            return "iPad";
        } else if(device.androidTablet() || device.tablet() || this.isMiPad() || this.isWeiXinAndroidPad() || this.isDingDingAndroidPad()) {
            return "androidPad";
        } else  if(device.androidPhone() || device.mobile()){
            return "android";
        }
        return "unknown";
    },

    toArray: function(value, delimiter, startSymbol, endSymbol) {
        var value_array = [];
        if(typeof value == "string") {
            if (startSymbol && endSymbol) {
                if (value.startWith(startSymbol)) {
                    value = value.substring(startSymbol.length);
                }
                if (value.endWith(endSymbol)) {
                    value = value.substring(0, value.length - endSymbol.length);
                }
            }
            value_array = value.split(delimiter);
        } else if($.isArray(value)) {
            value_array = value;
        }
        return value_array;
    },

    arrayContains: function(array, obj) {
        for(var index in array) {
            if(array[index] == obj) {
                return true;
            }
        }
        return false;
    },

    setCookie: function(name,value) {
        var days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },

    getCookie: function(name) {
        var arr, reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },

    removeCookie: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if(cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },

    getSelectedIndex: function(element, rightTag) {
        while (element[0] && (element[0].nodeName.toLocaleLowerCase() != rightTag)) {
            element = element.parent();
        }
        if(!element[0]) {
            return -1;
        }
        var elements = element.parent().children();
        return elements.indexOf(element[0]);
    },

    getSelectedElement: function(element, rightTag) {
        while (element[0] && (element[0].nodeName.toLocaleLowerCase() != rightTag)) {
            element = element.parent();
        }
        return element;
    },

    isHorizontalScreen: function() {
        return window.orientation === 90 || window.orientation === -90;
    },

    isVerticalScreen: function() {
        return !this.isHorizontalScreen();
    },

    getWindowWidth: function() {
        return document.body.clientWidth;
    },

    getWindowHeight: function() {
        return document.body.clientHeight;
    },

    setScale: function(iniScale, minScale, maxScale) {
        var viewport = document.querySelector("meta[name=viewport]");
        var targetDpi = this.isSupportTargetDPI() ? "target-densitydpi=device-dpi," : "";
        viewport.setAttribute("content", "width=device-width," + targetDpi + "user-scalable=no,initial-scale=" + iniScale);
    },

    unicode2CJK: function(str) {
        return unescape(str.replace(/z/g, "%u"));
    },

    setTranslate3D: function(element, value) {
        element.css("transform", value);
        element.css("-webkit-transform", value);
    },

    isIOS: function () {
        return device.ios();
    },

    isAndroid: function() {
        var u = navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Adr') > -1; //android终端
    },

    isDingTalk: function() {
        var u = navigator.userAgent;
        return u.indexOf("dingtalk") > -1;
    },

    performEventListener: function(listeners, eventName, event){
        var self = this;
        $.map(listeners, function(listener) {
            if(listener.eventName == eventName) {
                if($.isFunction(listener.action)) {
                    try {
                        listener.action.call(self, event);
                    } catch(e) {
                    }
                } else {
                    var action = listener.action.replace(/\n/g,"");
                    try {
                        (new Function("(" + action + ").apply(this, arguments)")).apply(self, arguments);
                    } catch(e) {
                    }
                }
            }
        });
    },

    analysisUrl: function(url) {
        var urlArr = url.split('?');
        if(!urlArr[1]) {
            return {};
        }
        var urlArrItems = urlArr[1].split('&');
        var urlItemsObj = {};
        var itemArr;
        for(var i = 0; i < urlArrItems.length; i++){
            var urlArrItem = urlArrItems[i];
            itemArr = urlArrItem.split('=');
            urlItemsObj[itemArr[0]] = itemArr[1];
        }
        return urlItemsObj;
    },

    //Android 4.4 以上抛弃了 target-densitydpi
    isSupportTargetDPI: function() {
        var match;
        if (match = navigator.userAgent.match(/Android (\d+\.\d+)/)) {
            if (parseFloat(match[1]) < 4.5 && this.isDingTalk()) {
                return true;
            }
        }
        return false;
    },

    /**
     *  这里要求scale后,数组里的长度仍然是整数.因为如果col宽度是小数,不同浏览器会采取不同的取整策略. 先计算出scale后的总长度,算出差值后分配
     *  TODO: 这样使用工具栏的放大缩小后,可能因为一些四舍五入导致计算有偏差,不过影响较小.
     */
    scaleLength: function(lengthArray, scale) {
        var hiddenNumber = this.getHiddenItemNumber(lengthArray);
        var number = lengthArray.length - hiddenNumber;
        var result = [];

        $.map(lengthArray, function(length, index) {
            result.push(Math.floor(length * scale));
        });
        //计算差值
        var originalLength = Math.floor(this.getTotalLength(lengthArray) * scale);
        var currentLength = this.getTotalLength(result);
        var gap = originalLength - currentLength;
        var eachGap = Math.floor(gap / number);
        var restGap = gap - eachGap * number;
        var restGapLength = Math.abs(restGap);
        $.map(result, function(gap, index) {
            if(gap === 0) {
                result[index] = 0;
            } else {
                result[index] = gap + eachGap + ((restGapLength > 0) ? 1 : 0);
                restGapLength --;
            }
        });
        return result;
    },

    getHiddenItemNumber: function(lengthArray) {
        var result = 0;
        $.map(lengthArray, function(length, index) {
            if(length === 0) {
                result ++;
            }
        });
        return result;
    },

    getTotalLength: function(lengthArray) {
        var result = 0;
        $.map(lengthArray, function(length) {
            result += length;
        });
        return result;
    },

    dealWithImageData: function (imageData) {
        if (imageData.indexOf("data:image") === 0) {
            imageData = "url(" + imageData + ")";
        } else if (imageData.indexOf("url(data:image") !== 0) {
            imageData = "url(data:image/png;base64," + imageData + ")";
        }
        return imageData;
    },

    //渐变色
    createGradientColor: function (options) {
        var directionStr = (options.direction == "1" ? "to bottom" : "to right"); //横向0,纵向1
        var beginColor = options.beginColor;
        var endColor = options.endColor;
        return "linear-gradient(" + directionStr + ", " + beginColor + ", " + endColor + ")";
    },

    analyseBackground: function(background, style, containerWidth, containerHeight) {
        if(!background) {
            return ;
        }
        var backgroundType = background["backgroundType"];
        if (backgroundType == "ColorBackground") {
            style["backgroundColor"] = background["color"];
        } else if (backgroundType == "GradientBackground") {
            style["background"] = this.createGradientColor(background);
        } else {
            var picData = background["image"];
            if(picData) {
                style["backgroundImage"] = this.dealWithImageData(picData);
                this.analyseBackgroundLayout(background["layout"], picData, style, containerWidth, containerHeight);
            }
        }
    },

    analyseBackgroundLayout: function(layout, imageData, style, containerWidth, containerHeight) {
        switch (layout) {
            case 0 :
                //平铺
                style.backgroundRepeat = "repeat";
                break;
            case 1 :
                //默认,居中
                style.backgroundPosition = "center";
                style.backgroundRepeat = "no-repeat";
                break;
            case 2:
                //拉伸
                style.backgroundSize = "100% 100%";
                style.backgroundRepeat = "no-repeat";
                break;
            case 4:
                //适应
                style.backgroundPosition = "center";
                style.backgroundRepeat = "no-repeat";
                style.backgroundSize = this.createBackgroundZoomSize(containerWidth, containerHeight, imageData);
                break;
        }
        return style;
    },

    createBackgroundZoomSize: function (containerWidth, containerHeight, imageData) {
        var zoomSize = "100% 100%";
        if (containerWidth == 0 || containerHeight == 0) {
            return zoomSize;
        }

        var size = this.getImageSize(imageData);
        if (size.width > 0 && size.height > 0) { //图片长宽获取正常
            var widthRatio = size.width / containerWidth;  //计算图片长宽跟单元格长宽的比值
            var heightRatio = size.height / containerHeight;
            if (widthRatio > 0 && heightRatio > 0) {
                if (widthRatio > heightRatio) {  //以比值较大的边为100%
                    zoomSize = "100% " + (heightRatio / widthRatio) * 100 + "%"; //比值较小的边的实际占比等于原始占比除以缩小的倍数，即为比值较大的边缩小到单元格的长度的缩小倍数
                } else {
                    zoomSize = (widthRatio / heightRatio) * 100 + "% 100%";
                }
            }
        }

        return zoomSize
    },

    getImageSize: function (imageData) {
        var image = new Image();
        if(!imageData) {
            return {
                width: 0,
                height: 0
            }
        }
        if(imageData.indexOf("url(data") === 0) {
            image.src = imageData.substring(4, imageData.length - 1);
        } else {
            image.src = "data:image/png;base64," + imageData;
        }
        return {
            width: image.width,
            height: image.height
        }
    },

    addParameters2HyperLinkUrl: function (url, parameters) {
        var self = this;
        if (typeof parameters == "string") {
            url += parameters;
        } else {
            if (Object.keys(parameters).length == 0) {
                return url;
            }
            var splitChar = url.indexOf("?") >= 0 ? "&" : "?";
            url += splitChar;
            $.each(parameters, function (key, value) {
                url += (self.cjkEncode(key) + "=" + self.cjkEncode(self.cjkDecode(value)) + "&");
            });
            url = url.substring(0, url.length - 1);
        }
        return url;
    },

    isNormalUrl: function (url) {
        var expression=/http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp=new RegExp(expression);
        return objExp.test(url)==true;
    },

    /**
     * [openWindow 页面跳转]
     * @param  {[type]} url     String|Object
     * @param  {[type]} target
     * @param  {[type]} title
     */
    openWindow: function(url, target, title) {
        var options = arguments[0];
        var _self = false;
        if ((typeof options === 'object') && (typeof options !== null)) {
            url = options.url || '';
            target = options.target || '';
            title = options.title || '';
            _self = options.isCurrent || false;
        }
        if (window.JSBridge && BridgeUtils.dealWithHyperLink(url, title)) {
            //如果是定义了jsbridge的app端,则交给app端处理,这边return
            return;
        }
        this.recordLinkOpenInWebView();
        // 判断是否当前页面打开
        if (_self) {
            window.location.href = url;
            return;
        }
        var windowOpen = window.open(url, target);
        //浏览器设置阻止弹窗打开窗口时,window.open可能失效
        if (windowOpen == null || typeof(windowOpen)=='undefined'){
            window.location.href = url;
        }
    },

    recordLinkOpenInWebView: function() {
        if(window.H5Entry) {
            window.H5Entry.linkOpenInWebView = true;
        }
    },

    hasLinkOpenInWebView: function() {
        return window.H5Entry && window.H5Entry.linkOpenInWebView;
    },

    stopEvent: function(e) {
        if(e && e.stopPropagation) {
            e.stopPropagation();
        }
        if(e && e.preventDefault) {
            e.preventDefault();
        }
    },

    createClickEvent: function(element, event) {
        if(device.mobile()) {
            element.bind("tap", event);
        } else {
            element.bind("click", event);
        }
    },

    createMoveInAndOutEvent: function(element, moveIn, moveOut) {
        if(device.mobile()) {
            element.bind("touchstart", moveIn);
            element.bind("touchend", moveOut);
            element.bind("touchcancel", moveOut);
        } else {
            element.bind("mouseenter", moveIn);
            element.bind("mouseleave", moveOut);
        }
    },

    //后台有的地方大些有的地方小写……
    getSessionID: function(jsonData) {
        return jsonData["sessionid"] || jsonData["sessionID"];
    },

    // 设置 body 的滚动高度
    setBodyScrollTop: function(number) {
        document.body.scrollTop = number;
    },


    // 获取设备系统
    getOsType: function() {
        if (device.ios()) {
            return "ios";
        } else if (device.android()) {
            return "android";
        } else if (device.windows()) {
            return "windows";
        } else {
            return "others";
        }
    },

    // 获取当前服务器地址
    getServer: function() {
        return FRH5ReportConstants.serverURL + FRH5ReportConstants.servletURL;
    }
}
