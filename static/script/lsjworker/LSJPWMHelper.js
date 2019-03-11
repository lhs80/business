///<jscompress sourcefile="LSJPNode.js" />
LSJPNodeMat = function()
{
    this.id = -1;
    this.imgUrl = '';
    this.imgBlob = null;
    this.bUrl = true;
};

LSJPNode = function () {

    this.children = [];
    this.childRanges = []; // min,max成对出现
    this.strDataPath =  '';
    this.bdSphere  = [];  // 4个值，x,y,z,radius
    this.enRangeMode = 0;
    this.arryMaterials = [];
    this.matIndex = -1;
    this.indices = null;
    this.verts = null;
    this.normals = null;
    this.colors = null;
    this.colorPerNum = 1;
    this.uvs = [];
};
LSJPNode.prototype.constructor = LSJPNode;
LSJPNode.prototype.addNode = function (node) {

    this.children.push(node);
};

///<jscompress sourcefile="LSJMemStream.js" />


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


///<jscompress sourcefile="LSJPParser.js" />
LSJPParser = function () {


};
LSJPParser.prototype.constructor = LSJPParser;


//解析二进制osgb
LSJPParser.prototype.parse = function (pageNode,memStream) {


    var headerLow = memStream.readUInt32();
    var headerHigh = memStream.readUInt32();

    // OSG Header (MD5, 16Bit)
    //#define OSG_HEADER_LOW  0x6C910EA1
    //#define OSG_HEADER_HIGH 0x1AFB4545
    /*
     if ( headerLow==OSG_HEADER_LOW && headerHigh==OSG_HEADER_HIGH )
     {
     OSG_INFO<<"Reading OpenSceneGraph binary file with the same endian as this computer."<<std::endl;
     return new BinaryInputIterator(&fin, 0); // endian the same so no byte swap required
     }
     else if ( headerLow==OSG_REVERSE(OSG_HEADER_LOW) && headerHigh==OSG_REVERSE(OSG_HEADER_HIGH) )
     {
     OSG_INFO<<"Reading OpenSceneGraph binary file with the different endian to this computer, doing byte swap."<<std::endl;
     return new BinaryInputIterator(&fin, 1); // endian different so byte swap required
     }
     */

    var typeValue = memStream.readUInt32();

    var version = memStream.readUInt32();

    var attributes = memStream.readUInt32();

    /*
     if ( attributes&0x4 ) inIterator->setSupportBinaryBrackets( true );
     if ( attributes&0x2 ) _useSchemaData = true;
     if ( attributes&0x1 )
     {
     unsigned int numDomains; *this >> numDomains;
     for ( unsigned int i=0; i<numDomains; ++i )
     {
     std::string domainName; *this >> domainName;
     int domainVersion; *this >> domainVersion;
     _domainVersionMap[domainName] = domainVersion;
     }
     }
     */



    var compressorName = memStream.readString();

    /*


     if ( compressorName!="0" )
     {
     std::string data;
     _fields.push_back( "Decompression" );

     BaseCompressor* compressor = Registry::instance()->getObjectWrapperManager()->findCompressor(compressorName);
     if ( !compressor )
     {
     OSG_WARN << "InputStream::decompress(): No such compressor "
     << compressorName << std::endl;
     }

     if ( !compressor->decompress(*(_in->getStream()), data) )
     throwException( "InputStream: Failed to decompress stream." );
     if ( getException() ) return;

     _dataDecompress = new std::stringstream(data);
     _in->setStream( _dataDecompress );
     _fields.pop_back();
     }

     */


    /*

     if ( _useSchemaData )
     {
     _fields.push_back( "SchemaData" );
     std::string schemaSource; *this >> schemaSource;
     std::istringstream iss( schemaSource );
     readSchema( iss );
     _fields.pop_back();
     }
     */

    var className =  this.parseOSGBClass(memStream);

    if (className== 'osg::PagedLOD')
    {
        this.parseOSGBPagedLOD(pageNode,memStream,version,pageNode.arryMaterials);
    }
    else if (className== 'osg::Group')
    {
        this.parseOSGBGroup(pageNode,memStream,version,pageNode.arryMaterials);
    }

};

LSJPParser.prototype.parseOSGBClass = function (memStream) {


    var strClassName = memStream.readString();

    var id =  memStream.readUInt32();

    return strClassName;

};
LSJPParser.prototype.parseOSGBObject = function (memStream,version) {

    // 先读取object
    // StringSerilize
    var strValue =  memStream.readString(); //  _name


    var intValue =  memStream.readUInt32();  //DataVariance

    // ObjSerilize
    var hasObject =  memStream.readUChar8(); //UserDataContainer

};

LSJPParser.prototype.parseOSGBNode = function (memStream,version) {

    // 读取Node
    // UserSerilize

    var ok =  memStream.readUChar8(); //UserSerilize

    var hasObject;


    hasObject =  memStream.readUChar8(); //_computeBoundCallback

    hasObject =  memStream.readUChar8(); //_updateCallback

    hasObject =  memStream.readUChar8(); //_eventCallback

    hasObject =  memStream.readUChar8(); //_cullCallback

    hasObject =  memStream.readUChar8(); //_cullingActive

    var pnVal = memStream.readUInt32(); //_nodeMask

    // 版本77的话，这里还有个

    //ADD_USER_SERIALIZER( Descriptions );  // _descriptions, deprecated


    // ObjSerilize

    hasObject =   memStream.readUChar8(); //_stateset

};
LSJPParser.prototype.parseOSGBGroup = function (pageNode,memStream,version,arryMaterials) {


    //下面读取Object的信息
    this.parseOSGBObject(memStream,version);


    //下面读取Node的信息
    this.parseOSGBNode(memStream,version);


    var ok =   memStream.readUChar8(); //_children


    if (ok)
    {

        var nSize =  memStream.readUInt32(); //_nodeMask

        for (var i=0; i<nSize; ++i )
        {

            var  strClassName = this.parseOSGBClass(memStream);
            if (strClassName== 'osg::PagedLOD')
            {
                var newNode = new LSJPNode();
                pageNode.addNode(newNode);
                this.parseOSGBPagedLOD(newNode,memStream,version,arryMaterials);
            }
        }
    }
};
LSJPParser.prototype.parseOSGBPagedLOD = function (pageNode,memStream,version,arryMaterials) {


    //下面读取Object的信息
    this.parseOSGBObject(memStream,version);


    //下面读取Node的信息
    this.parseOSGBNode(memStream,version);


    // 读取LOD

    /*

     enum CenterMode
     {
     USE_BOUNDING_SPHERE_CENTER,
     USER_DEFINED_CENTER,
     UNION_OF_BOUNDING_SPHERE_AND_USER_DEFINED
     };

     */



    var intValue =   memStream.readUInt32();  //CenterMode

    var ok =   memStream.readUChar8();//UserCenter, _userDefinedCenter, _radius

    var i = 0;
    var nSize = 0;

    if (ok)
    {


        var x = memStream.readDouble();
        var y = memStream.readDouble();
        var z = memStream.readDouble();
        var dRadius = memStream.readDouble();


        pageNode.bdSphere.push(x);
        pageNode.bdSphere.push(y);
        pageNode.bdSphere.push(z);
        pageNode.bdSphere.push(dRadius);


    }

    // EumSerilize
    var nRangeMode = memStream.readInt32(); //RangeMode

    /*
     enum RangeMode
     {
     DISTANCE_FROM_EYE_POINT,
     PIXEL_SIZE_ON_SCREEN
     };
     */

    if (nRangeMode == 0)
    {
        pageNode.enRangeMode = 0;  //RM_DISTANCE_FROM_EYE_POINT;
    }
    else if (nRangeMode == 1)
    {
        pageNode.enRangeMode = 1; //RM_PIXEL_SIZE_ON_SCREEN;
    }

    // UserSerilize,_rangeList
    ok = memStream.readUChar8();

    if (ok)
    {

        pageNode.childRanges.splice(0,pageNode.childRanges.length);

        var nRangeSize = memStream.readUInt32();

        // 由于没有大括号，所以这里不读取
        //is >> is.BEGIN_BRACKET;

        for (i=0; i<nRangeSize; ++i )
        {

            var min = memStream.readFloat();
            var max = memStream.readFloat();

            var newNode =  new LSJPNode();
            pageNode.addNode(newNode);
            pageNode.childRanges.push(min);
            pageNode.childRanges.push(max);
        }
        // is >> is.END_BRACKET;
    }



    // 读取PagedLOD

    // UserSerilize
    ok = memStream.readUChar8();
    if (ok)
    {
        var hasPath  = memStream.readUChar8();
        if (hasPath)
        {
            var strDatasetPath = memStream.readString();
        }

    }
    // properByvalSerilize
    var puValue =memStream.readUInt32();
    // properByvalSerilize
    var pbVal = memStream.readUChar8();
    // UserSerilize
    ok = memStream.readUChar8();
    if (ok)
    {
        nSize = memStream.readUInt32();

        // 由于没有大括号，所以这里不读取
        //is >> is.BEGIN_BRACKET;


        for (i=0; i<nSize; ++i )
        {
            var strFileName = memStream.readString();
            if (i<pageNode.children.length)
            {
                pageNode.children[i].strDataPath = strFileName;
            }

        }

        // is >> is.END_BRACKET;


        //is >> is.PROPERTY("PriorityList") >> size >> is.BEGIN_BRACKET; PROPERTY("PriorityList"), 这个没有，不读去
        nSize = memStream.readUInt32();
        for ( i=0; i<nSize; ++i)
        {
            var offset = memStream.readFloat();
            var scale = memStream.readFloat();
        }

        // is >> is.END_BRACKET;
    }
    // UserSerilize
    ok = memStream.readUChar8();
    if (ok)
    {
        var nSize = memStream.readUInt32();
        //is >> is.BEGIN_BRACKET;
        var pChildNode = null;
        for (i=0; i<nSize; ++i )
        {
            if (i<pageNode.children.length)
            {
                pChildNode = pageNode.children[i];
            }
            else
            {
                pChildNode = null;
            }
            // readObject
            var strClassName = this.parseOSGBClass(memStream);
            if (strClassName== 'osg::Node')
            {
                this.parseOSGBObject(memStream,version);
                this.parseOSGBNode(memStream,version);
            }
            else if (strClassName== 'osg::Geode')
            {
                this.parseOSGBGeode(pChildNode,memStream,version,arryMaterials);
            }

        }
        //is >> is.END_BRACKET;

    }
};
LSJPParser.prototype.parseOSGBGeode = function (pageNode,memStream,version,arryMaterials) {

    //下面读取Object的信息
    this.parseOSGBObject(memStream,version);


    //下面读取Node的信息
    this.parseOSGBNode(memStream,version);

    // userserilized
    var ok = false;
    var nSize = 0;
    var i = 0;

    ok = memStream.readUChar8();

    if (ok)
    {

        //Drawable读取
        nSize = memStream.readUInt32();

        if (nSize>0)
        {

            //is >> is.BEGIN_BRACKET;
            for (i=0; i<nSize; ++i )
            {

                var strClassName = this.parseOSGBClass(memStream);
                if (strClassName== 'osg::Geometry')
                {
                    this.parseOSGBGeometry(pageNode,memStream,version,arryMaterials);
                }
            }

        }

    }
};
LSJPParser.prototype.parseOSGBDrawable = function (pageNode,memStream,version,arryMaterials) {

    //objectSerilized,_stateset
    var hasObject = memStream.readUChar8();
    var resNodeMat = null;
    if (hasObject)
    {
        var strClassName = memStream.readString();
        var id =  memStream.readUInt32();
        if (strClassName=='osg::StateSet')
        {

            for(var i= 0,l= arryMaterials.length;i< l;i++)
            {
                if(id == arryMaterials[i].id)
                {
                    resNodeMat = arryMaterials[i];
                    pageNode.matIndex = i;
                    break;
                }
            }

            if (resNodeMat === undefined  || resNodeMat==null ) {

                resNodeMat = new LSJPNodeMat();
                resNodeMat.id = id;
                arryMaterials.push(resNodeMat);
                pageNode.matIndex = arryMaterials.length -1;
                this.parseOSGBStateSet(pageNode,memStream,version,resNodeMat);

            }

        }

    }
    // userSerilized,_initialBound
    var ok = memStream.readUChar8();
    if (ok)
    {
    }
    //objectSerilized,_computeBoundCallback
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    //objectSerilized,_shape
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    //PropByValSerializer,_supportsDisplayList
    var pbValue = memStream.readUChar8();
    //PropByValSerializer,_useDisplayList
    pbValue = memStream.readUChar8();
    //PropByValSerializer,_useVertexBufferObjects
    pbValue = memStream.readUChar8();
    //objectSerilized,_updateCallback
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    //objectSerilized,_eventCallback
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    //objectSerilized,_cullCallback
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    //objectSerilized,_drawCallback
    hasObject = memStream.readUChar8();
    if (hasObject)
    {
    }
    return  resNodeMat;
};
LSJPParser.prototype.parseOSGBStateSet = function (pageNode,memStream,version,resNodeMat) {

    var strClassName;
    //下面读取父类Object的信息
    this.parseOSGBObject(memStream,version);
    // userSerilized,_modeList
    var ok = memStream.readUChar8();
    var i=0;
    if (ok)
    {
        var size = memStream.readUInt32();
        if ( size>0 )
        {
            for ( i=0; i<size; ++i )
            {
                var nMode = memStream.readInt32();
                var nModeValue = memStream.readInt32();
            }
        }
    }
    //userSerilized , _attributeList
    ok = memStream.readUChar8();
    if (ok)
    {
        var size = memStream.readUInt32();
        for (  i=0; i<size; ++i )
        {
            strClassName = this.parseOSGBClass(memStream);
            if (strClassName=='osg::Material')
            {
               this.parseOSGBMaterial(memStream,version,resNodeMat);
            }
            var value = memStream.readInt32();
        }
    }
    //userSerilized ,_textureModeList
    ok = memStream.readUChar8();
    if (ok)
    {
        var size = memStream.readUInt32();
        // is >> is.BEGIN_BRACKET;


        for (i=0; i<size; ++i )
        {
            var nModeCount = memStream.readUInt32();
            for ( var j=0; j<nModeCount; ++j )
            {
                var nGlEnumMode = memStream.readInt32();
                var nGlEnumModeVal = memStream.readInt32();
            }
        }
    }

    //userSerilized ,_textureAttributeList
    ok = memStream.readUChar8();
    if (ok)
    {
        var size = memStream.readUInt32();
        //is >> is.BEGIN_BRACKET;
        for (i=0; i<size; ++i )
        {
            //is >> is.PROPERTY("Data");
            var nAttributes = memStream.readUInt32();
            for ( var j=0; j<nAttributes; ++j )
            {
                // is >> is.BEGIN_BRACKET;
                strClassName = this.parseOSGBClass(memStream);
                if (strClassName== 'osg::Texture2D')
                {
                    this.parseOSGBTexture2D(pageNode,memStream,version,resNodeMat);
                }
                var value = memStream.readInt32();
            }
        }
    }

    //userSerilized ,_uniformList
    ok = memStream.readUChar8();
    if (ok)
    {
    }

    //PropByValSerializer,_renderingHint
    var pnValue = memStream.readInt32();


    //EnumSerializer,RenderBinMode
    //INHERIT_RENDERBIN_DETAILS
    var eValue = memStream.readInt32();

    //PropByValSerializer,_binNum
    pnValue = memStream.readInt32();

    //StringSerializer,_binName
    var strVal = memStream.readString();

    //PropByValSerializer,_nestRenderBins
    var pbValue = memStream.readUChar8();

    //ObjectSerializer,_updateCallback
    var bHasObject = memStream.readUChar8();
    if (bHasObject)
    {
    }
    //ObjectSerializer,_eventCallback
    bHasObject = memStream.readUChar8();
    if (bHasObject)
    {
    }

};

LSJPParser.prototype.parseOSGBMaterial = function (memStream,version,resNodeMat) {

    //下面读取父类Object的信息
    this.parseOSGBObject(memStream,version);
    //stateAttribute
    this.parseOSGBStateAttribute(memStream,version);
    //EnumSerializer,ColorMode
    var eVal = memStream.readInt32();
    //UserSerializer ,ambient
    var ok = memStream.readUChar8();
    if (ok)
    {
        var frontAndBack = memStream.readUChar8();
        var arryFrontVal = memStream.readFloat32Array(4);
        var arryBackVal = memStream.readFloat32Array(4);
       // material.ambient
    }

    //UserSerializer ,Diffuse
    ok = memStream.readUChar8();
    if (ok)
    {
        var frontAndBack = memStream.readUChar8();
        var frontD = memStream.readFloat32Array(4);
        var backD = memStream.readFloat32Array(4);
        var r = frontD.getFloat32(0,true) ;//malq_getFloat32第一个参数是字节位数
        var g = frontD.getFloat32(4,true) ;
        var b = frontD.getFloat32(8,true) ;
        //resPathMaterial.material.color = new Color().setRGB(r,g,b); //diffuse
    }

    //UserSerializer ,Specular
    ok = memStream.readUChar8();
    if (ok)
    {
        var frontAndBack = memStream.readUChar8();
        var frontD = memStream.readFloat32Array(4);
        var backD = memStream.readFloat32Array(4);
        //resPathMaterial.material.specular = new Color().setRGB(frontD.getFloat32(0,true)*255,
        // frontD.getFloat32(1*4,true)*255,frontD.getFloat32(2*4,true)*255); //specular
    }

    //UserSerializer ,Emission
    ok = memStream.readUChar8();
    if (ok)
    {
        var frontAndBack = memStream.readUChar8();
        var arryFrontVal = memStream.readFloat32Array(4);
        var arryBackVal = memStream.readFloat32Array(4);
       /// resPathMaterial.material.emissive =new Color().setRGB(frontD.getFloat32(0,true)*255,
       // frontD.getFloat32(1*4,true)*255,frontD.getFloat32(2*4,true)*255); //emissive
    }

    //UserSerializer ,Shininess
    ok = memStream.readUChar8();
    if (ok)
    {
        var frontAndBack = memStream.readUChar8();
        var fFrontVal = memStream.readFloat();
        var fBackVal = memStream.readFloat();
       // resPathMaterial.material.shininess = fFrontVal;
    }
};
LSJPParser.prototype.parseOSGBTexture = function (memStream,version) {


    //UserSerializer ,osg::Texture::WRAP_S
    var ok = memStream.readUChar8();
    if (ok)
    {
        var nGlEnumModeVal = memStream.readInt32();
    }
    //UserSerializer ,osg::Texture::WRAP_T
    ok = memStream.readUChar8();
    if (ok)
    {
        var nGlEnumModeVal = memStream.readInt32();
    }
    //UserSerializer ,osg::Texture::WRAP_R
    ok = memStream.readUChar8();
    if (ok)
    {
        var nGlEnumModeVal = memStream.readInt32();
    }
    //UserSerializer ,osg::Texture::MIN_FILTER
    ok = memStream.readUChar8();
    if (ok)
    {
        var nGlEnumModeVal = memStream.readInt32();
    }
    //UserSerializer ,osg::Texture::MAG_FILTER
    ok = memStream.readUChar8();
    if (ok)
    {
        var nGlEnumModeVal = memStream.readInt32();
    }
    //PropByValSerializer,_maxAnisotropy
    var profValue = memStream.readFloat();
    //PropByValSerializer,_useHardwareMipMapGeneration
    var probValue = memStream.readUChar8();
    //PropByValSerializer ,_UnRefImageDataAfterApply
    probValue = memStream.readUChar8();

    //PropByValSerializer,_clientStorageHint
    probValue = memStream.readUChar8();
    //PropByValSerializer,_resizeNonPowerOfTwoHint
    probValue = memStream.readUChar8();
    //PropByValSerializer,_borderColor

    /*
    GSVec4d provecVal;
    stream>>provecVal.x;
    stream>>provecVal.y;
    stream>>provecVal.z;
    stream>>provecVal.w;
    */
    var provecVal = memStream.readFloat64Array(4);

    //PropByValSerializer,_borderWidth

    var pnVal = memStream.readInt32();

    var eVal = memStream.readInt32();

    //UserSerializer,_internalFormat
    ok = memStream.readUChar8();
    if (ok)
    {
    }
    //UserSerializer,_sourceFormat
    ok = memStream.readUChar8();
    if (ok)
    {
    }
    //UserSerializer,_sourceType
    ok = memStream.readUChar8();
    if (ok)
    {
    }
    //PropByValSerializer,_use_shadow_comparison
    probValue = memStream.readUChar8();

    // LEQUAL
    eVal = memStream.readInt32();

    // LUMINANCE
    eVal = memStream.readInt32();
    profValue = memStream.readFloat();
};

LSJPParser.prototype.parseOSGBTexture2D = function (pageNode,memStream,version,resNodeMat) {

    this.parseOSGBObject(memStream,version);
    this.parseOSGBStateAttribute(memStream,version);
    this.parseOSGBTexture(memStream,version);
    //ImageSerializer
    var hasObject = memStream.readUChar8();
    if (hasObject)
    {
        var strClassName = 'osg::Image';
        if (version>94)
        {
            strClassName =  memStream.readString();
        }

        var id = memStream.readInt32();
        var strName = memStream.readString();

        //IMAGE_EXTERNAL
        var writeHint = memStream.readInt32();
        var decision = memStream.readInt32();


        var bRenameTexture = false;
        switch ( decision )
        {
            case 0:
                {
                }
                break;
            case 1:
                {

                    strName = 'IMAGE_INLINE_FILE_'+strName;
                    bRenameTexture = true;
                    var size = memStream.readUInt32();
                    if ( size>0 )
                    {
                        var data = memStream.readUChar8Array2(size);
                        var extension = strName.substring(strName.lastIndexOf('.'), strName.length).toLowerCase();

                        var eftype;
                        if(extension=='.jpeg' || extension=='.jpg')
                        {
                            eftype = 'jpeg';
                        }
                        else if(extension=='.png')
                        {
                            eftype = 'png';
                        }
                        else if(extension=='.gif')
                        {
                            eftype = 'gif';
                        }
                        else if(extension=='.icon')
                        {
                            eftype = 'x-icon';
                        }
                        //if(size<3000000)
                        {

                            /*
                            var binaryString = '',length = data.length;
                            for (var p = 0; p < length; p++) {
                                binaryString += String.fromCharCode(data[p]);
                            }
                            var encodedData = btoa(binaryString);
                            var dataURI = "data:image/"+eftype+";base64," + encodedData;
                            // var base64String = btoa(String.fromCharCode.apply(null, data));
                            resNodeMat.imgUrl = dataURI;
                            resNodeMat.bUrl = false;
                            */
                            resNodeMat.imgBlob = new Blob([data], {type : eftype});
                            resNodeMat.bUrl = false;
                        }

                    }
                }
                break;
        }


        if(strName!='')
        {
            if (!bRenameTexture)
            {

                resNodeMat.imgUrl = strName;
                
            }
            else
            {
               // pMaterial->SetTexPath(strName);
            }


        }
        this.parseOSGBImage(memStream,version);

    }

    //PropByValSerializer
    var pnValue =  memStream.readInt32();
    //PropByValSerializer
    pnValue =  memStream.readInt32();



};
LSJPParser.prototype.parseOSGBImage = function (memStream,version) {

    this.parseOSGBObject(memStream,version);

};
LSJPParser.prototype.parseOSGBStateAttribute = function (memStream,version) {
    //objectSerilized,_updateCallback
    var hasObject = memStream.readUChar8();
    //objectSerilized,_eventCallback
    hasObject = memStream.readUChar8();
};
LSJPParser.prototype.parseOSGBGeometry = function (pageNode,memStream,version,arryMaterials) {

    //下面读取Object的信息
    this.parseOSGBObject(memStream,version);


    //下面读取Drawable的信息
    var resNodeMat = this.parseOSGBDrawable(pageNode,memStream,version,arryMaterials);


    // ListSerializer
    var faceGroupNum = memStream.readUInt32();

    var i=0;
    var j=0;
    var nType = 0;
    var nMode = 0;
    var numInstances=0;


    for ( var faceGroupIndex=0; faceGroupIndex<faceGroupNum; ++faceGroupIndex )
    {
        //readPrimitiveSet

        nType = memStream.readInt32();
        nMode = memStream.readInt32();


        //pRenderElement->m_enOperationType = OT_TRIANGLE_LIST;
        switch(nMode)
        {
            case 0:
                //pRenderElement->m_enOperationType = OT_POINT_LIST;
                break;
            case 1:
                //pRenderElement->m_enOperationType = OT_LINE_LIST;
                break;
            case 2:
                //pRenderElement->m_enOperationType = OT_LINE_STRIP;
                break;
            case 0x0004:
                //pRenderElement->m_enOperationType = OT_TRIANGLE_LIST;
                break;
            case 0x0005:
                ///pRenderElement->m_enOperationType = OT_TRIANGLE_STRIP;
                break;
            case 0x0006:
                //pRenderElement->m_enOperationType = OT_TRIANGLE_FAN;
                break;
        }




        if ( version>96 )
        {
            //stream >> numInstances;
            memStream.readInt32();
        }


        var nVertexStride = 0;
        var nVerticesCount = 0;
        var nIndexesCount = 0;
        var indexes;

        switch (nType)
        {

            case 50:
            {
                nVertexStride = memStream.readInt32();
                nVerticesCount = memStream.readInt32();
            }
                break;
            case 53:
            {
                nIndexesCount = memStream.readUInt32();
                if (nIndexesCount>0)
                {
                    indexes = memStream.readUInt16Array(nIndexesCount);
                }
            }
                break;
            case 54: //ID_DRAWELEMENTS_UINT
            {
                nIndexesCount = memStream.readUInt32();
                if (nIndexesCount>0)
                {
                    indexes = memStream.readUInt32Array(nIndexesCount);
                }

            }
                break;
        }




        if(nIndexesCount>0)
        {


            switch(nMode)
            {
                case 0:
                    //pRenderElement->m_enOperationType = OT_POINT_LIST;
                    break;
                case 1:
                    //pRenderElement->m_enOperationType = OT_LINE_LIST;
                    break;
                case 2:
                    //pRenderElement->m_enOperationType = OT_LINE_STRIP;
                    break;
                case 0x0004: //TraingleList

                    if(nType == 53)
                    {
                        pageNode.indices = new Uint16Array(nIndexesCount);

                        for(i=0;i<nIndexesCount;i++)
                        {
                            pageNode.indices[i] = indexes.getUint16(i*2,true);
                        }
                    }
                    else if(nType == 54)
                    {
                        pageNode.indices = new Uint32Array(nIndexesCount);

                        for(i=0;i<nIndexesCount;i++)
                        {
                            pageNode.indices[i] = indexes.getUint32(i*4,true);
                        }

                    }
                    break;
                case 0x0005:
                    ///pRenderElement->m_enOperationType = OT_TRIANGLE_STRIP;
                    break;
                case 0x0006:
                    //pRenderElement->m_enOperationType = OT_TRIANGLE_FAN;
                    break;
            }




        }
        else if(nVerticesCount>0)
        {

            switch(nMode)
            {
                case 0:
                    //pRenderElement->m_enOperationType = OT_POINT_LIST;
                    break;
                case 1:
                    //pRenderElement->m_enOperationType = OT_LINE_LIST;
                    break;
                case 2:
                    //pRenderElement->m_enOperationType = OT_LINE_STRIP;
                    break;
                case 0x0004: //TraingleList
                {
                    /*
                    for(i=0;i<nVerticesCount;i+=3)
                    {
                        var curFace = new Face3();
                        curFace.a = i;
                        curFace.b = i+1;
                        curFace.c = i+2;
                        geometry.faces.push(curFace);
                    }
                    */

                }

                    break;
                case 0x0005:
                    ///pRenderElement->m_enOperationType = OT_TRIANGLE_STRIP;
                    break;
                case 0x0006:
                    //pRenderElement->m_enOperationType = OT_TRIANGLE_FAN;
                    break;
            }


        }

    }



    // userSerilized,VertexArray
    var ok = memStream.readUChar8();
    if (ok)
    {
        var hasArray = memStream.readUChar8();
        var id = memStream.readUInt32();
        var nArryType = memStream.readInt32();

        switch ( nArryType)
        {
            case 16: //ID_VEC3_ARRAY:
            {

                var nArrysize = memStream.readInt32();

                if (nArrysize>0)
                {

                    var nArrayElemSize = nArrysize*3;
                    var vertsD = memStream.readFloat32Array(nArrayElemSize);

                    pageNode.verts = new Float32Array( nArrayElemSize );

                    for(i=0; i <nArrayElemSize ;i++)
                    {
                        pageNode.verts[i] =  vertsD.getFloat32(i*4,true);
                    }

                }
            }
            break;
            case 19: //ID_VEC3D_ARRAY:
            {

                var nArrysize = memStream.readInt32();
                if (nArrysize>0)
                {
                    var nArrayElemSize = nArrysize*3;
                    var vertsD = memStream.readFloat64Array(nArrayElemSize);

                    pageNode.verts = new Float32Array( nArrayElemSize );

                    for(i=0; i <nArrayElemSize ;i++)
                    {
                        pageNode.verts[i] =  vertsD.getFloat64(i*8,true);
                    }
                }

            }
            break;


        }
        var hasIndices = memStream.readUChar8();
        var binding = memStream.readInt32();
        var normalizeValue = memStream.readInt32();
    }

    // userSerilized,NormalArray
    ok = memStream.readUChar8();
    if (ok)
    {
        var hasArray = memStream.readUChar8();
        if (hasArray)
        {

            var id = memStream.readUInt32();
            var nArryType = memStream.readInt32();

            switch ( nArryType)
            {
                case 16: //ID_VEC3_ARRAY:
                {

                    var nArrysize = memStream.readInt32();
                    if (nArrysize>0)
                    {

                        var nArrayElemSize = nArrysize*3;
                        var nmD = memStream.readFloat32Array(nArrayElemSize);
                        pageNode.normals = new Float32Array( nArrayElemSize );
                        for(i=0; i <nArrayElemSize ;i++)
                        {
                            pageNode.normals[i] =  nmD.getFloat32(i*4,true);
                        }

                    }

                }
                break;
            }


            var hasIndices = memStream.readUChar8();
            var binding = memStream.readInt32();
            var normalizeValue = memStream.readInt32();
        }
    }
    // userSerilized,ColorArray
    ok = memStream.readUChar8();
    if (ok)
    {
        var hasArray = memStream.readUChar8();
        if (hasArray)
        {
            var id = memStream.readUInt32();
            var nArryType = memStream.readInt32();
            switch ( nArryType)
            {
                case 4: //ID_INT_ARRAY:
                case 5: //ID_UINT_ARRAY:
                {

                    var nArrysize = memStream.readInt32();
                    if (nArrysize>0)
                    {
                        var nArrayElemSize = nArrysize;
                        var clD = memStream.readUInt32Array(nArrayElemSize);
                        pageNode.colors = new Uint32Array( nArrayElemSize );
                        pageNode.colorPerNum = 1;
                        for(i=0; i <nArrayElemSize ;i++)
                        {
                            pageNode.colors[i] =  clD.getUint32(i*4,true);
                        }

                    }
                }
                    break;

                case 11: //ID_VEC4UB_ARRAY:
                {

                    var nArrysize = memStream.readInt32();
                    if (nArrysize>0)
                    {

                        var nArrayElemSize = nArrysize*4;
                        var clD = memStream.readUChar8Array(nArrayElemSize);
                        pageNode.colors = new Uint8Array( nArrayElemSize );
                        pageNode.colorPerNum = 4;
                        for(i=0; i <nArrayElemSize ;i++)
                        {
                            pageNode.colors[i] =  clD.getUint8(i,true);
                        }

                    }
                }
                    break;
                case 17: //ID_VEC4_ARRAY:
                {

                    var nArrysize = memStream.readInt32();
                    if (nArrysize>0)
                    {


                        var nArrayElemSize = nArrysize*4;
                        var clD = memStream.readFloat32Array(nArrayElemSize);
                        pageNode.colors = new Float32Array( nArrayElemSize );
                        pageNode.colorPerNum = 4;
                        for(i=0; i <nArrayElemSize ;i++)
                        {
                            pageNode.colors[i] =  clD.getFloat32(i*4,true);
                        }

                    }
                }
                    break;
            }

            var hasIndices = memStream.readUChar8();
            var binding = memStream.readInt32();
            var normalizeValue = memStream.readInt32();
        }
    }
    // userSerilized,SecondaryColorArray
    ok = memStream.readUChar8();
    if (ok)
    {
        //var nTest=100;

    }
    // userSerilized,FogCoordArray
    ok = memStream.readUChar8();
    if (ok)
    {
        //var nTest=100;
    }

    // userSerilized,TexCoordArrayList
    ok = memStream.readUChar8();
    if (ok)
    {
        var uvLayerCount = memStream.readInt32();

        for ( i=0; i<uvLayerCount; ++i )
        {
            var hasArray = memStream.readUChar8();
            if (hasArray)
            {

                var id = memStream.readUInt32();
                var nArryType = memStream.readInt32();
                switch ( nArryType)
                {
                    case 15: //ID_VEC2_ARRAY:
                    {

                        var nArrysize = memStream.readInt32();
                        if (nArrysize>0)
                        {

                            var nArrayElemSize = nArrysize*2;
                            var tcD = memStream.readFloat32Array(nArrayElemSize);
                            var arrayTData = new Float32Array( nArrayElemSize );
                            for(i=0; i <nArrayElemSize ;i++)
                            {
                                arrayTData[i] =  tcD.getFloat32(i*4,true);
                            }

                            pageNode.uvs.push(arrayTData);

                        }


                    }
                        break;
                }

                var hasIndices = memStream.readUChar8();
                var binding = memStream.readInt32();
                var normalizeValue = memStream.readInt32();
            }

        }

    }

    // userSerilized,_vertexAttribList
    ok = memStream.readUChar8();
    if (ok)
    {


    }

    // userSerilized,FastPathHint
    ok = memStream.readUChar8();
    if (ok)
    {
        // malq_如果不是二进制流才读_这个害人不浅啊
        //GSbool bFastPathHint = false;
        //stream >> bFastPathHint;

    }

};

