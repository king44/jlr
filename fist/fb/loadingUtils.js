var React = require("react");
var ReactDOM = require("react-dom");
var Loading = require("../components/widget/loading");
var BaseUtils = require("./baseUtils");
var BridgeUtils = require("./bridgeUtils");

module.exports = {

    defaultShowLoading: function() {
        if(!this.loading) {
            this.loading = ReactDOM.render(<Loading></Loading>, this.createMask(true)[0]);
        }
        this.showMask();
        this.loading.show();
    },

    showLoading: function() {
        var self = this;
        if(!this.showID) {
            this.showID = setTimeout(function() {
                if(!BridgeUtils.dealWithLoading(true)) {
                    self.defaultShowLoading();
                }
            }, 200);   //超出0.2s的才显示loading
        }
    },

    defaultHideLoading: function() {
        this.removeMask();
        if(this.loading) {
            this.loading.hide();
        }
    },

    hideLoading: function() {
        clearTimeout(this.showID);
        this.showID = 0;
        if(!BridgeUtils.dealWithLoading(false)) {
            this.defaultHideLoading();
        }
    },

    /**
     * 创建一层遮罩层
     * @param isTransparent 是否透明
     * @param opacity 在是透明的前提下，透明度，为小数。为null或者undefined或者false即为默认透明度0.3
     * @param notDisppear 触摸不消失 null或者undefined或者false即为触摸消失
     * @returns {*|jQuery|HTMLElement}
     */
    createMask: function(isTransparent, opacity, notDisppear) {
        var self = this;
        var id = isTransparent ? "h5-mask-transparent" : "h5-mask";
        var mask = $("div#" + id);
        if(mask.length === 0) {
            mask = $("<div>").attr("id", id).appendTo($(document.body));
            if (!notDisppear) {
                BaseUtils.createClickEvent(mask, function (e) {
                    if ($(e.target).attr("id") == id) {
                        self.removeMask();
                    }
                });
            }
        }
        if (isTransparent && opacity)
        {
            var rgba = "(0, 0, 0, " + opacity +")";
            mask.css("background-color", rgba);
        }
        mask.css("display", "block");
        return mask;
    },

    showMask: function() {
        this.shownTime = (new Date()).getTime();
        $("div#h5-mask").css("display", "block");
        $("div#h5-mask-transparent").css("display", "block");
    },

    removeMask: function() {
        $("div#h5-mask").hide();
        $("div#h5-mask-transparent").hide();
    },
};