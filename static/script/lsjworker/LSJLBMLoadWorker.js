/**
 * Created by mlq on 2016/9/6.
 */
"use strict";

if( 'function' === typeof importScripts) {

    //importScripts("LSJPWMHelper.min.js");
    importScripts("jszip.min.js","LSJBinModelNode.js", "LSJLBMParser.js","LSJMemStream.js");
    self.onmessage = function (event) {

        var curParser = new LSJLBMParser();
        var zip = new JSZip( event.data );
        var bufferData = zip.file( "data.lmb" ).asArrayBuffer();
        var memStream = new LSJMemStream(bufferData);
        var binNode = new LSJBinModelNode();
        curParser.parse(binNode,memStream);
        self.postMessage(binNode);
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
