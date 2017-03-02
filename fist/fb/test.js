showMessage:function (e) {
    var t = this;
    this.setState({errorMsgClass: "h5-login-error-msg show", errorMsg: e}),

        this.timeout = setTimeout(function () {
            t.setState({errorMsgClass: "h5-login-error-msg"})
        }, 3e3)
}
,
handleLogin:function () {
    c.showLoading();
    var e = this;
    l.ajax({
        url: FRH5ReportConstants.servletURL, dataType: "text",
        data: {
            op: "fs_load",
            cmd: "login",
            fr_username: e.state.username,
            fr_password: e.state.password,
            fr_remember: !1
        }, type: "POST", success: function (t) {
            c.hideLoading();
            var n = l.jsonDecode(t);
            if (n.devunsupport)e.showMessage(e.unauthorizedDevice); else if (n.fail)e.setState({
                password: "",
                isLoginBtDisabled: !0
            }), e.showMessage(e.usernameOrPasswordError); else if (n.url) {
                l.setCookie("username", e.state.username);
                var o = new Date, r = n.url + "&time=" + o.getTime();
                l.openWindow({url: r, isCurrent: !0})
            }
        }, error: function () {
            c.hideLoading(), e.showMessage(e.loginRequestFailed)
        }
    })
}
,
getLoginInfo:function () {
    c.showLoading();
    var e = this;
    l.ajax({
        url: FRH5ReportConstants.servletURL,
        dataType: "json",
        data: {op: "h5_fs_title"},
        type: "GET",
        success: function (t) {
            c.hideLoading();
            var o = t.logoImg ? "/WebReport/ReportServer?op=fr_attach&cmd=ah_image&id=" + t.logoImg + "&isAdjust=false" : n(334), r = t.logintitle ? t.logintitle : e.logoName;
            e.setState({logoUrl: o, logoTitle: r})
        },
        error: function () {
            c.hideLoading(), e.showMessage(e.getLogoResourcFailed)
        }
    })
}
,
componentDidMount:function () {
    var e = l.getCookie("username") || "";
    this.setState({username: e}), this.getLoginInfo()
}
,
render:function () {
    return o.createElement("div", {className: "h5-login"}, o.createElement("div", {className: "h5-login-modal"}), o.createElement("div", {
        className: "h5-login-body",
        style: {top: this.state.loginBodyTop}
    }, o.createElement(r, {
        className: "h5-login-logo",
        logoImgUrl: this.state.logoUrl,
        logoLabel: this.state.logoTitle,
        imgAlt: "logo"
    }), o.createElement("div", {
        className: "h5-login-input-box",
        ref: "inputBox"
    }, o.createElement(i, {
        className: "h5-login-username",
        type: "text",
        value: this.state.username,
        leftIconUrl: n(335),
        leftIconSize: "16px 15px",
        rightIconUrl: n(336),
        rightIconSize: "18px 18px",
        placeholder: this.usernamePlaceholder,
        onValueChange: this.handleUsernameChange,
        onInputFocus: this.handleUsernameFocus,
        onInputBlur: this.handleUsernameBlur
    }), o.createElement(i, {
        className: "h5-login-password",
        type: "password",
        value: this.state.password,
        leftIconUrl: n(337),
        leftIconSize: "12px 15px",
        rightIconUrl: n(336),
        placeholder: this.passwordPlaceholder,
        onValueChange: this.handlePasswordChange,
        onInputFocus: this.handlePasswordFocus,
        onInputBlur: this.handlePasswordBlur
    })), o.createElement(a, {
        className: this.state.loginBtClass,
        btName: this.loginName,
        disabled: this.state.isLoginBtDisabled,
        onClickBt: this.handleLogin
    }), o.createElement(s, {className: this.state.errorMsgClass, msgText: this.state.errorMsg, ref: "errorMsg"})))
}
})},
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", render: function () {
            return o.createElement("div", {className: "h5-ui-logo " + (this.props.className || "")}, o.createElement("div", {
                className: "h5-ui-logo-img",
                style: {backgroundImage: "url(" + this.props.logoImgUrl + ")", backgroundSize: "100% 100%"}
            }), o.createElement("div", {className: "h5-ui-logo-text"}, this.props.logoLabel))
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(162);
    e.exports = o.createClass({
        displayName: "exports",
        getInitialState: function () {
            return {displayType: "none"}
        },
        propTypes: {leftIconUrl: o.PropTypes.string.isRequired, rightIconUrl: o.PropTypes.string.isRequired},
        getDefaultProps: function () {
            return {leftIconSize: "18px 18px", rightIconSize: "18px 18px"}
        },
        handleChange: function () {
            this.setDisplayType(), "function" == typeof this.props.onValueChange && this.props.onValueChange(this.getInputValue())
        },
        handleClick: function () {
            var e = r.findDOMNode(this.refs.input);
            e.value = "", this.handleChange()
        },
        handleFocus: function () {
            this.setDisplayType(), "function" == typeof this.props.onInputFocus && this.props.onInputFocus()
        },
        handleBlur: function () {
            this.setState({displayType: "none"}), "function" == typeof this.props.onInputBlur && this.props.onInputBlur()
        },
        setDisplayType: function () {
            var e = r.findDOMNode(this.refs.input), t = "";
            t = e.value.length > 0 ? "block" : "none", this.setState({displayType: t})
        },
        setPlacehoderStyle: function () {
            this.refs.input.className = this.getInputValue().length ? "h5-ui-input-text" : "h5-ui-input-text placeholder"
        },
        getInputValue: function () {
            return this.refs.input.value
        },
        componentDidUpdate: function () {
            this.setPlacehoderStyle()
        },
        render: function () {
            var e = this.props.leftIconUrl || "", t = "url(" + e + ") no-repeat center center", n = this.props.rightIconUrl || "", r = "url(" + n + ") no-repeat left center";
            return o.createElement("div", {className: "h5-ui-icon-input " + (this.props.className || "")}, o.createElement("div", {
                className: "h5-ui-input-icon h5-ui-input-icon-left",
                style: {background: t, backgroundSize: this.props.leftIconSize}
            }), o.createElement("div", {
                className: "h5-ui-input-icon h5-ui-input-icon-right",
                style: {background: r, backgroundSize: this.props.rightIconSize, display: this.state.displayType},
                onClick: this.handleClick
            }), o.createElement("div", {className: "h5-ui-input-container"}, o.createElement("input", {
                className: this.state.inputClassName,
                type: this.props.type,
                value: this.props.value,
                ref: "input",
                placeholder: this.props.placeholder,
                onChange: this.handleChange,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur
            })))
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", handleClick: function () {
            "function" == typeof this.props.onClickBt && this.props.onClickBt()
        }, render: function () {
            return o.createElement("div", {className: "h5-ui-button " + (this.props.className || "")}, o.createElement("button", {
                className: "h5-ui-bt",
                disabled: this.props.disabled,
                onClick: this.handleClick
            }, this.props.btName))
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", render: function () {
            return o.createElement("div", {className: "h5-ui-message " + (this.props.className || "")}, o.createElement("div", {className: "h5-ui-message-text"}, this.props.msgText))
        }
    })
}
,
function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAABMxJREFUeAHtnUuMFFUUhs+51cwgDYENwvSwAGMYjcREDQnRhTGBqCTMMEMgLlBWLl34YGEkUBMlUXGnceHChRtDSCaRaIIufJCYmLhRoYGRcSoxakBRBMPQdE/X9dx+yPT0s2aqTk/avxZ9u+7j/HW/+nPr1u1HMcW5+cFyolubKSwOkbGDFNIqMpQmYlOR+Zz8+05VJTdN/LrDsElV93sptbPFvDE0ObVnwy+uX4vv5NHpdVSY2UWWRsje2E7WCmzZwtJrJbXlHWPy8uY/0GxpomjDlZWavZUYLiHYNPHb0WAsc2hhoK1lOpJ9isg+R7dmtknKvUUpvt5Ya18Z+ujnd6ODHj+3QyC/IXAfKB9Oxa3xHVvPRZq1/Rs7B/3qhSGaLbxDxeL2niORcIfYhn2dgR7PPkmFwodyPKsTPqaeDV+dDTTv4OEzBym0HwNyc0SdlDR3tG/lJGTfF8gHZCbRSSzUaUGghaPPvV6C3KIxijon0Bi0f/YZCsODnYdBzXYE6kH7Zx6WmfZ77RqiPBqBWtDHLqXl3uOEzJH7o4VB7XYEai+G//z5kkDOtGuE8ugEbjvarVmwFdDYkiBwG3Th5hGZxvXmAk8S5CLGLIN+bXKQbPhsxLaoHoFAeYzOF3ZLm9rxOkIQVG1PoOxotg40tgQJGPKDNbJo/2iCGggtBMTRMzslXQYayRIwMtN4JFkJRHcEBDQNAUXyBGTosHclLwMFQ8z41ETBB26MXqWg87+XcPNozDgUbOBAY1Mg0N3bbkMXZP17hUI/6yUs3SMTATWjdRX09Ojg1noCOjnyVa3r8pmz2vVJ7Yzq4Fu6KgCtdG50hw4b7qHDZ2Vs7MJm6CT5Wz7ognJJUhl06QLUHdDWBN2C7HQxdCjRB2iAViKgJANHA7QSASUZOBqglQgoycDRAK1EQEkGjgZoJQJKMnA0QCsRUJKBowFaiYCSDBwN0EoElGTgaIBWIqAkA0cDtBIBJRk4GqCVCCjJwNEArURASUb3m0rMU/ILg0mlvtXKMJ2vzdDd0wZ9nMa3HNLt4tJQwxitdB4AGqCVCCjJwNEArURASQaOVgDNoQ0BWgG0JZMHaAXQ1OcBtAZn8sJrcLQC6X6TvwrQCYNm5ut7H9/wN0AnDFp+b37aZ8asI3HOTJ86Dd3Vu8R7tbQEZNiY9fr5uDsqDB3JnptPpnYO/AHQyUIm49ljVQkMHVUSsaf8xU8jma+rYTF0VEnEmnKR2Xt+bkg4ei6NuN4bejsYXff93HBw9FwaMbyXp7P9sHHNwMvzQ8HR84ksYt/dBTIt2/vlY5ybHwag5xNZ+H7OEg8HY2t/bBQCoBtRiZ6XY8/bF+xe/1WzpgDdjEyH+Ux8Te6vh4OR9adbNcHFsBWddmVM33FfamswkmkJ2YUB6HYwG5S7NQxmeiu1PLNtetedFxtUqctyQ4e7F19bV4KMhgQE8mdeil+YGs5kG1Zokpkit4xnaX+TcmQLAZkb5+V/tk+y5Tenxwa+XQgUAX3Hi2RzD8kC9b0LCdCzbZiuyh/UulnEqRXp9InsE6v/WkxfU+Tf/bs8IuRBohv7BPb9EjzBJ7+F3yzmYONsaywdCCsPf2eyRTKc4yLdtB5f4TB9+enRlVfcJyNxaf4LY2MApZqji7UAAAAASUVORK5CYII="
}
,
function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAOBJREFUOBGNkrsKwkAQRdcHFltYWElsg7Zia2Pvn+iHiL2gHyII+iX2KjYWFmol8QxiWCazJgMn7Ny5d/IgzkUqy7IZHOEEC2hErEUZ8xx0bYpOQyHl4abT9G/o60hdC/RD6Bi6eCdatxaMtSnoCzNrwSgI6OO/2dfLew7gBVZN9UazJ7k00lvTbImEm3APljw4ty2v9Q3EJ+Yw4OlbMigt7pTALrj77yhaEl3AMIUVPCFWMhNPmi+ikT9vDfKnVS3xSsY7LoeqKcO3ryGeeZz4u+XPah4usqDHqGuOy8XrBwskY3O/SLI0AAAAAElFTkSuQmCC"
}
,
function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAARpJREFUKBV9kjFqAkEYhXf0BAqKkBMIabQQsZWFnCBdKisvk8baTvEMdtqICEKW5AYp0wQTBRGy+d4y/zosqw8+/9k383Zm/9FFJUrTtIrdhhokzrlDybKrRaABCziB6Y/BOwyvK4MREzF8wS3pBZMgEkUY2slCvyXJC97Z+6M8jKHjSUdowkoPXgfqAKb++Zva0m5VCL9JIZ1A1UJjxjqq6UXBR3sKqkLauQPFkJa9VjivWl5UF+MBPuAZHISqKZhAGrg/jJ+gD0tQcA2hlMm6qnuS1D01IjyeHXurBV49Cw4x9PFquXXPr8mKQntvzLKQ/WBO/MS98slk3TJ5xRyB7qlMc8w8VOyWrqfFm2LogBa+wYY/+o6a6x8bm8aldMzOwAAAAABJRU5ErkJggg=="
}
,
function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAPCAYAAADQ4S5JAAAAAXNSR0IArs4c6QAAANxJREFUKBWNkTEKwkAQRRPRytTBM1jZeADvYKU3SSNew8rGA3gDe0HEA1iqYCdYKcT3w46ZxAQceJm/f2ayyW4UucjzPIU1XALSqWspJYUEzvCEVUBaXlJ2BoWZwRvGVpQOXmbeN1PYwuFrBCFPNfM7Jsh9eLi1SXmqFREzPUQtYQJdOIKPEYsX7GARMXCCf+OkHXImfWi9CcacHPuidqjH2hoo6B4q4X/a+nomyF4XdtMnqWB3sS+63EOn0hS/Nxu62gZmTW+Rp0+6kgdtDTX/plOawr1yFM0L9Uw/JNj0llTcNwkAAAAASUVORK5CYII="
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(162), i = n(339), a = n(340), s = n(4);
    n(343);
    n(310), e.exports = o.createClass({
        displayName: "exports",
        COOKIE_SELECTED_ID: "selectedID",
        needRemoveCookieWhenUnload: !0,
        subDirectory: null,
        backgroundColor: {startR: 225, startG: 245, startB: 255},
        getInitialState: function () {
            return {selectedIndex: -1}
        },
        componentDidMount: function () {
            this.initCookie()
        },
        render: function () {
            var e = this, t = [];
            return $.map(this.props.options, function (n, r) {
                if (n.hasChildren) {
                    var a = "h5-entry-item";
                    e.state.selectedIndex == r ? a += "-selected" : e.state.selectedIndex - 1 == r && (a += "-before-selected"), t.push(o.createElement("li", {
                        className: a,
                        onTouchStart: e.onTouchStart,
                        onTouchEnd: e.onTouchEnd,
                        onTouchCancel: e.onTouchCancel,
                        onClick: e.onClick,
                        key: r
                    }, o.createElement(i, {icon: e.getIconClass(n), text: n.text})))
                }
            }), o.createElement("div", {className: "h5-directory-tree"}, o.createElement("ul", null, t))
        },
        initCookie: function () {
            var e = this;
            $(window).unload(function () {
                e.needRemoveCookieWhenUnload && s.removeCookie(e.COOKIE_SELECTED_ID)
            });
            var t = s.getCookie(this.COOKIE_SELECTED_ID);
            if (t) {
                $(r.findDOMNode(this));
                $.map(this.props.options, function (n, o) {
                    n.id == t && e.chooseItemAtIndex(o, !1)
                })
            }
        },
        onTouchStart: function (e) {
            $(e.currentTarget).addClass("h5-entry-item-active")
        },
        onTouchEnd: function (e) {
            $(".h5-entry-item-active").removeClass("h5-entry-item-active")
        },
        onTouchCancel: function (e) {
            $(".h5-entry-item-active").removeClass("h5-entry-item-active")
        },
        onClick: function (e) {
            this.chooseItemAtIndex(s.getSelectedIndex($(e.target), "li"), !0), e.stopPropagation()
        },
        chooseItemAtIndex: function (e, t) {
            s.setCookie(this.COOKIE_SELECTED_ID, this.props.options[e].id), this.setState({selectedIndex: e}), this.gotoSubDirectory(e), this.fadeIn(t)
        },
        gotoSubDirectory: function (e) {
            this.initSubDirectory(this.props.options[e], this.createSubWrap())
        },
        createSubWrap: function () {
            var e = ($(r.findDOMNode(this)), $("span.h5-menu-icon").width(), $("div.h5-sub-directory-wrap"));
            return 0 == e.length && (this.subDirectory = null, e = $("<div />").addClass("h5-sub-directory-wrap h5-sub-directory-wrap-transitioning").appendTo(document.body)), e[0]
        },
        initSubDirectory: function (e, t) {
            var n = e.ChildNodes ? e.ChildNodes : [];
            this.subDirectory ? this.subDirectory.setState({
                items: n,
                entryID: e.id,
                entryText: e.text
            }) : this.subDirectory = r.render(o.createElement(a, {
                defaultEntryID: e.id,
                defaultEntryText: e.text,
                defaultItems: n,
                fadeIn: this.fadeIn,
                fadeOut: this.fadeOut,
                onEnterEntry: this.onEnterEntry,
                onMove: this.onMove
            }), t);
            var i = {};
            i[e.id] = n, this.subDirectory.setSelectedEntry(i, e.id, e.text)
        },
        getIconClass: function (e) {
            var t, n = e.id;
            return 0 == n.indexOf("0") && (n = n.substring(1)), t = this.props.icons[n] ? this.props.icons[n] : "e642", t ? "icon-" + t + "-a icon-menu-a; icon-" + t + "-b icon-menu-b" : ""
        },
        fadeIn: function (e) {
            var t = $("div.h5-sub-directory-wrap"), n = $(r.findDOMNode(this));
            e ? (s.setTranslate3D(t, "translate3d(0, 0, 0)"), n.addClass("colorfadein").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                n.css("backgroundColor", "#e1f5ff"), n.removeClass("colorfadein")
            })) : (s.setTranslate3D(t, "translate3d(0, 0, 0)"), n.css("backgroundColor", "#e1f5ff"))
        },
        fadeOut: function () {
            var e = this, t = $("div.h5-sub-directory-wrap"), n = $(r.findDOMNode(this));
            s.setTranslate3D(t, "translate3d(" + t.width() + "px, 0, 0)"), n.addClass("colorfadeout").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                n.css("backgroundColor", "#ffffff"), n.removeClass("colorfadeout"), e.setState({selectedIndex: -1})
            })
        },
        onMove: function (e) {
            var t = Math.floor(this.backgroundColor.startR * (1 - e) + 255 * e), n = Math.floor(this.backgroundColor.startG * (1 - e) + 255 * e), o = Math.floor(this.backgroundColor.startB * (1 - e) + 255 * e);
            $(r.findDOMNode(this)).css("backgroundColor", "#" + t.toString(16) + n.toString(16) + o.toString(16))
        },
        onEnterEntry: function () {
            this.needRemoveCookieWhenUnload = !1
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", componentDidMount: function () {
        }, render: function () {
            var e = this.props.icon ? this.props.icon : "icon-e62f-a icon-menu-a; icon-e62f-b icon-menu-b", t = e.split(";"), n = [];
            return $.map(t, function (e, t) {
                n.push(o.createElement("i", {key: t, className: e}))
            }), o.createElement("div", {className: "h5-entry-item"}, o.createElement("span", {
                key: "icon",
                className: "h5-menu-icon"
            }, n), o.createElement("div", {key: "text", className: "h5-menu-text"}, this.props.text))
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(162), i = n(341), a = n(339), s = n(4);
    n(343);
    e.exports = o.createClass({
        displayName: "exports",
        startX: 0,
        startY: 0,
        originalLeft: 0,
        width: 0,
        startScrollTop: 0,
        scrollDirection: -1,
        moveX: [],
        selectedEntryManager: {},
        touchStartTime: 0,
        COOKIE_SELECTED_FOLDER_ID: "folderSelectedID",
        getInitialState: function () {
            return {items: null, entryID: null, entryText: null}
        },
        componentDidMount: function () {
            var e = this;
            $(".h5-sub-directory").tap(function (t) {
                e.onItemClick(t)
            })
        },
        render: function () {
            var e = this, t = [];
            return $.map(this.getItems(), function (n, r) {
                var i = "icon-tree-" + e.getType(n);
                t.push(o.createElement("li", {key: r}, o.createElement(a, {icon: i, text: n.text})))
            }), o.createElement("div", {
                className: "h5-sub-directory",
                onTouchStart: this.onTouchStart,
                onTouchMove: this.onTouchMove,
                onTouchEnd: this.onTouchEnd
            }, o.createElement(i, {
                key: "navigationBar",
                ref: "navigationBar",
                defaultItems: [{id: this.getEntryID(), text: this.getEntryText()}],
                onClick: this.onNavFolderSelect
            }), o.createElement("div", {
                key: "subList",
                ref: "subList",
                className: "h5-sub-directory-list"
            }, o.createElement("ul", null, t)))
        },
        getItems: function () {
            return null != this.state.items ? this.state.items : this.props.defaultItems
        },
        getEntryID: function () {
            return this.state.entryID ? this.state.entryID : this.props.defaultEntryID
        },
        getEntryText: function () {
            return this.state.entryText ? this.state.entryText : this.props.defaultEntryText
        },
        onNavFolderSelect: function (e, t) {
            var n = this, o = this.selectedEntryManager[e];
            $.map(t, function (e, t) {
                delete n.selectedEntryManager[e]
            }), this.setState({items: o})
        },
        onItemClick: function (e) {
            var t = s.getSelectedIndex($(e.target), "li");
            if (!(t < 0)) {
                var n = this.getItems()[t], o = this.getType(n);
                if ("folder" == o) {
                    var r = n.ChildNodes ? n.ChildNodes : [];
                    this.selectedEntryManager[n.id] = r, this.saveSelectedFolders(), this.setState({items: r}), this.refs.navigationBar.addItem({
                        id: n.id,
                        text: n.text
                    })
                } else this.props.onEnterEntry(), "cpt" == o || "frm" == o ? s.openWindow(FRH5ReportConstants.servletURL + "?op=h5_entry&cmd=entry_report&id=" + n.id) : "bi" == o ? s.openWindow(FRH5ReportConstants.servletURL + n.bilink) : "url" == o ? s.ajax({
                    url: FRH5ReportConstants.servletURL,
                    async: !1,
                    data: {op: "fs_main", cmd: "entry_report", id: n.id},
                    dataType: "text",
                    success: function (e) {
                        s.openWindow(e)
                    }
                }) : s.openWindow(FRH5ReportConstants.serverURL + FRH5ReportConstants.servletURL + "?op=fs_main&cmd=entry_report&id=" + n.id)
            }
        },
        setSelectedEntry: function (e, t, n) {
            this.selectedEntryManager = e, this.refs.navigationBar.setState({
                items: [{id: t, text: n}],
                selectedIndex: 0
            })
        },
        onTouchStart: function (e) {
            var t = s.getSelectedElement($(e.target), "li");
            t && t.addClass("h5-entry-item-active"), this.touchStartTime = (new Date).getTime(), this.originalLeft = $(r.findDOMNode(this)).offset().left, this.width = $(r.findDOMNode(this)).width(), this.startX = e.touches[0].pageX, this.startY = e.touches[0].pageY, this.startScrollTop = $(".h5-sub-directory-wrap").scrollTop(), this.addTransitioningClass(!1), e.preventDefault()
        },
        onTouchMove: function (e) {
            if (!(s.isAndroid() && (new Date).getTime() - this.touchStartTime < 100)) {
                var t = e.touches[0], n = this, o = t.pageX, r = t.pageY, i = o - n.startX, a = r - n.startY;
                if (n.scrollDirection < 0 && (n.scrollDirection = Math.abs(i) > Math.abs(a) ? 0 : 1), 0 == n.scrollDirection) {
                    s.setTranslate3D($(".h5-sub-directory-wrap"), "translate3d(" + Math.max(0, i) + "px, 0, 0)");
                    i / n.width;
                    n.moveX[n.moveX.length - 1] != o && n.moveX.push(o)
                } else 1 == n.scrollDirection && $(".h5-sub-directory-wrap").scrollTop(Math.max(0, n.startScrollTop - a));
                e.preventDefault()
            }
        },
        onTouchEnd: function (e) {
            $(".h5-entry-item-active").removeClass("h5-entry-item-active"), 0 == this.scrollDirection && (this.addTransitioningClass(!0), this.moveX.length > 2 && this.moveX[this.moveX.length - 2] < this.moveX[this.moveX.length - 1] ? this.props.fadeOut() : this.props.fadeIn(!0)), this.scrollDirection = -1, this.moveX = [], e.preventDefault()
        },
        saveSelectedFolders: function () {
            var e = [];
            $.map(this.selectedEntryManager, function (t, n) {
                e.push(n)
            }), s.setCookie(this.COOKIE_SELECTED_FOLDER_ID, e)
        },
        addTransitioningClass: function (e) {
            var t = $(".h5-sub-directory-wrap");
            e ? t.addClass("h5-sub-directory-wrap-transitioning") : t.removeClass("h5-sub-directory-wrap-transitioning")
        },
        getType: function (e) {
            return e.nodeicon ? e.nodeicon : "0" == e.type ? "folder" : "url"
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(342);
    e.exports = o.createClass({
        displayName: "exports", getInitialState: function () {
            return {items: [], selectedIndex: 0}
        }, render: function () {
            var e = this, t = this.getItems(), n = [];
            return $.map(t, function (t, i) {
                var a = i == e.state.selectedIndex, s = 0 === i;
                n.push(o.createElement(r, {key: t.id, onClick: e.onClick, text: t.text, selected: a, isFirst: s}))
            }), o.createElement("div", {className: "h5-navigation"}, n)
        }, onClick: function (e) {
            var t = $(e.target);
            (t.hasClass("h5-navigation-item-text") || "span" != t[0].nodeName.toLocaleLowerCase()) && (t = t.parent());
            var n = t.parent().children(), o = n.indexOf(t[0]), r = this.getItems(), i = r.splice(0, o + 1);
            this.props.onClick(i[o].id, r), this.setState({items: i, selectedIndex: i.length - 1})
        }, getItems: function () {
            return this.state.items.length > 0 ? this.state.items : this.props.defaultItems
        }, addItem: function (e) {
            var t = this.getItems().concat(e);
            this.setState({items: t, selectedIndex: t.length - 1})
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(162);
    e.exports = o.createClass({
        displayName: "exports", componentDidMount: function () {
            var e = this;
            $(r.findDOMNode(this)).tap(function (t) {
                e.onClick(t)
            })
        }, render: function () {
            var e = this.props.selected ? "h5-navigation-item-selected" : "h5-navigation-item";
            return this.props.isFirst && (e += " h5-navigation-item-first"), o.createElement("span", {className: e}, o.createElement("i", null), o.createElement("span", {className: "h5-navigation-item-text"}, this.props.text))
        }, onClick: function (e) {
            this.props.onClick(e)
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = (n(5), {
        file: "2", folder: "0", isFile: function (e) {
            return e.type == this.file
        }
    });
    e.exports = {
        isEmptyDirectory: function (e) {
            var t = this, n = !0;
            return !o.isFile(e) && (!e.ChildNodes || ($.map(e.ChildNodes, function (e) {
                    o.isFile(e) ? n = !1 : void 0 !== e.ChildNodes && t.isEmptyDirectory(e)
                }), n))
        }
    }
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(345), i = n(346), a = n(4);
    n(310), e.exports = o.createClass({
        displayName: "exports", handleClick: function (e) {
            a.openWindow({
                url: FRH5ReportConstants.servletURL + "?op=h5_fs_sub&id=" + this.props.options[e].id + "&__device__=" + a.getDeviceType(),
                isCurrent: !0
            })
        }, getIconCode: function (e) {
            var t = e.id;
            return 0 == t.indexOf("0") && (t = t.substring(1)), this.props.icons[t] ? this.props.icons[t] : "e642"
        }, render: function () {
            var e = [], t = this.props.options;
            t.forEach(function (t, n) {
                var i = this.getIconCode(t);
                e.push(o.createElement(r, {
                    className: "h5-fs-directory-grid",
                    key: "directory-grid-" + n,
                    iconCode: i,
                    title: t.text,
                    onGridClick: this.handleClick.bind(this, n)
                }))
            }.bind(this));
            for (var n = 3 - t.length % 3, a = 0; a < n; a++)e.push(o.createElement("div", {
                className: "h5-fs-directory-grid",
                key: "supply" + a
            }));
            return o.createElement("div", {className: "h5-fs-directory"}, o.createElement(i, null), e)
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    e.exports = o.createClass({
        displayName: "exports", handleClick: function () {
            $.isFunction(this.props.onGridClick) && this.props.onGridClick()
        }, render: function () {
            return o.createElement("div", {
                className: this.props.className + " h5-fs-grid",
                onClick: this.handleClick
            }, o.createElement("div", {className: "h5-fs-grid-icon"}, o.createElement("span", {className: "h5-grid-icon"}, o.createElement("i", {className: "icon-" + this.props.iconCode + " icon-" + this.props.iconCode + "-a icon colorful"}), o.createElement("i", {className: "icon-" + this.props.iconCode + " icon-" + this.props.iconCode + "-b icon colorful"}))), o.createElement("div", {className: "h5-fs-grid-title"}, o.createElement("span", {className: "h5-grid-title"}, this.props.title)))
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", getInitialState: function () {
            return {className: "h5-ui-prevent-layer"}
        }, componentDidMount: function () {
            setTimeout(function () {
                this.setState({className: "h5-ui-prevent-layer hidden"})
            }.bind(this), 300)
        }, render: function () {
            return o.createElement("div", {className: this.state.className + " " + (this.props.name || "")})
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5), r = n(348), i = n(346), a = n(4);
    n(310), e.exports = o.createClass({
        displayName: "exports", handleClick: function (e) {
            var t = this.props.options[e], n = this.getType(t);
            "folder" === n ? a.openWindow({
                url: FRH5ReportConstants.servletURL + "?op=h5_fs_sub&id=" + t.id + "&__device__=" + a.getDeviceType(),
                isCurrent: !0
            }) : ["cpt", "cpr", "frm"].indexOf(n) > -1 ? a.openWindow(FRH5ReportConstants.servletURL + "?op=h5_entry&cmd=entry_report&id=" + t.id) : "url" === n && a.openWindow(t.url)
        }, getType: function (e) {
            return e.nodeicon ? e.nodeicon : "0" == e.type ? "folder" : "others"
        }, render: function () {
            var e = [];
            return this.props.options.forEach(function (t, n) {
                var i = this.getType(t);
                "others" !== i && e.push(o.createElement(r, {
                    className: "h5-fs-directory-item",
                    type: i,
                    title: t.text,
                    showRightIcon: "folder" === i,
                    onItemClick: this.handleClick.bind(this, n),
                    key: "directory-item-" + n
                }))
            }.bind(this)), o.createElement("div", {className: "h5-fs-second-directory"}, o.createElement(i, null), e)
        }
    })
}
,
function (e, t, n) {
    "use strict";
    var o = n(5);
    n(162);
    e.exports = o.createClass({
        displayName: "exports", handleClick: function () {
            $.isFunction(this.props.onItemClick) && this.props.onItemClick()
        }, render: function () {
            var e = null;
            return this.props.showRightIcon && (e = o.createElement("span", {className: this.props.type})), o.createElement("div", {
                className: this.props.className + " h5-fs-item",
                onClick: this.handleClick
            }, o.createElement("div", {className: "h5-item-icon"}, o.createElement("span", {className: this.props.type})), o.createElement("div", {className: "h5-item-content"}, o.createElement("span", {className: "h5-item-title"}, this.props.title)), o.createElement("div", {className: "h5-item-right-icon"}, e))
        }
    })
}
])
;