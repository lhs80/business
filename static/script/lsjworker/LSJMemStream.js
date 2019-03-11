

LSJMemStream = function (buffer) {


    this.curOffset = 0;
    this.data = buffer;
    this.bLittleEndian = this.isLittleEndian();


};

LSJMemStream.prototype.constructor = LSJMemStream;
LSJMemStream.prototype.TWO_POW_MINUS23 = Math.pow(2, -23);
LSJMemStream.prototype.TWO_POW_MINUS126 = Math.pow(2, -126);

LSJMemStream.prototype.isLittleEndian = function(){
    var buffer = new ArrayBuffer(2),
        bytes = new Uint8Array(buffer),
        ints = new Uint16Array(buffer);

    bytes[0] = 1;

    return ints[0] === 1;
};

LSJMemStream.prototype.readByte_1 = function(){
    return this.data[this.curOffset ++] & 0xff;
};
LSJMemStream.prototype.readUChar8_1 = function(){
    return this.data[this.curOffset ++] & 0xff;
};
LSJMemStream.prototype.readUInt32_1 = function( ) {

    var i = this.readByte();
    i |= this.readByte() << 8;
    i |= this.readByte() << 16;
    return i | (this.readByte() << 24);
};
LSJMemStream.prototype.readInt32_1 = function( ) {

    var i = this.readByte();
    i |= this.readByte() << 8;
    i |= this.readByte() << 16;
    return i | (this.readByte() << 24);
};
LSJMemStream.prototype.readFloat_1 = function( ) {


    var m = this.readByte();
    m += this.readByte() << 8;

    var b1 = this.readByte();
    var b2 = this.readByte();

    m += (b1 & 0x7f) << 16;
    var e = ( (b2 & 0x7f) << 1) | ( (b1 & 0x80) >>> 7);
    var s = b2 & 0x80? -1: 1;

    if (e === 255){
        return m !== 0? NaN: s * Infinity;
    }
    if (e > 0){
        return s * (1 + (m * this.TWO_POW_MINUS23) ) * Math.pow(2, e - 127);
    }
    if (m !== 0){
        return s * m * this.TWO_POW_MINUS126;
    }
    return s * 0;

};



LSJMemStream.prototype.readUChar8 = function( ) {

    var charArray = new Uint8Array( this.data, this.curOffset, 1 );
    this.curOffset +=1;

    return charArray[ 0 ];

};
LSJMemStream.prototype.readUInt32 = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 4 );
    var v2  =  dataView.getUint32(0,true); // 以大端读出，默认是小端
    this.curOffset +=4;
    return v2;
};
LSJMemStream.prototype.readInt32 = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 4 );
    this.curOffset +=4;
    return dataView.getInt32(0,true);

};
LSJMemStream.prototype.readInt16 = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 2 );
    this.curOffset +=2;
    return dataView.getInt16(0,true);

};
LSJMemStream.prototype.readUInt16 = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 2 );
    this.curOffset +=2;
    return dataView.getUint16(0,true);

};

LSJMemStream.prototype.readFloat = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 4);
    this.curOffset += 4;
    return dataView.getFloat32(0,true);

};

LSJMemStream.prototype.readDouble = function( ) {

    var dataView = new DataView(this.data, this.curOffset, 8);
    this.curOffset += 8;
    return dataView.getFloat64(0,true);

};

LSJMemStream.prototype.readFloat32Array = function(nLen) {

    var nByteLen = nLen * 4;
    var dataView = new DataView(this.data, this.curOffset, nByteLen);
    this.curOffset += nByteLen;
    return dataView;
};

LSJMemStream.prototype.readFloat64Array = function(nLen) {

    var nByteLen = nLen * 8;
    var dataView = new DataView(this.data,this.curOffset, nByteLen);
    this.curOffset += nByteLen;
    return dataView;
};
LSJMemStream.prototype.readUInt16Array = function(nLen) {

    var nByteLen = nLen * 2;
    var dataView = new DataView(this.data, this.curOffset, nByteLen);
    this.curOffset += nByteLen;
    return dataView;
};
LSJMemStream.prototype.readUInt32Array = function(nLen) {

    var nByteLen = nLen * 4;
    //var nByteLen2 = nLen * Uint32Array.BYTES_PER_ELEMENT;
    var dataView = new DataView(this.data, this.curOffset, nByteLen);
    this.curOffset += nByteLen;
    return dataView;
};

LSJMemStream.prototype.readUChar8Array = function(nLen) {

    var nByteLen = nLen * 1;
    var dataView = new DataView(this.data, this.curOffset, nByteLen);
    this.curOffset += nByteLen;
    return dataView;
};

LSJMemStream.prototype.readUChar8Array2 = function(nLen) {

    var charArray = new Uint8Array( this.data, this.curOffset, nLen );
    this.curOffset +=nLen;
    return charArray;
};
LSJMemStream.prototype.readString = function() {


    var strLen = this.readUInt32();

    var charArray = new Uint8Array( this.data, this.curOffset, strLen );

    var text = "";

    for ( var i = 0; i < strLen; i ++ ) {

        text += String.fromCharCode( charArray[ i ] );

    }

    this.curOffset += strLen;
    return text;

};

