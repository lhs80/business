"use strict";

if( 'function' === typeof importScripts) {

    //importScripts("LSJPWMHelper.min.js");
    importScripts("LSJPNode.js", "LSJPParser.js","LSJMemStream.js");
    self.onmessage = function (event) {

        var curParser = new LSJPParser();
        var memStream = new LSJMemStream(event.data);
        var pageNode = new LSJPNode();
        curParser.parse(pageNode,memStream);
        self.postMessage(pageNode);
        self.close();
    };

    self.onerror =  function (error) {
        /**
         *Loader deals with worker error
         */
        dump("Load error: " + error.message + "\n");
        //self.postMessage({ "error": error.message});
        //throw error;
    };
}
