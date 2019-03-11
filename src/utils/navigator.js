/* 当前设备浏览器版本信息 */
const browser = {
    versions: function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //Opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果/谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //iOS终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //Android终端或者UC浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否Web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

//根据设备的不同，可以做一些事情。
// if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
//     //window.location="http://localhost/index.html";
// }
// else if (browser.versions.android) {
//     //window.location="http://localhost/demo.php";
// }

// document.writeln("语言版本: " + browser.language + "<br/>");
// document.writeln("是否为移动终端: " + browser.versions.mobile + "<br/>");
// document.writeln("iOS终端: " + browser.versions.ios + "<br/>");
// document.writeln("Android终端: " + browser.versions.android + "<br/>");
// document.writeln("是否为iPhone: " + browser.versions.iPhone + "<br/>");
// document.writeln("是否iPad: " + browser.versions.iPad + "<br/>");
// document.writeln("用户代理: " + navigator.userAgent + "<br/>");
export {browser}
