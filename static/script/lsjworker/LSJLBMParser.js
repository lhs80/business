/**
 * Created by mlq on 2016/9/6.
 */
LSJLBMParser = function () {


};
LSJLBMParser.prototype.constructor = LSJLBMParser;
LSJLBMParser.prototype.parseSimpleMaterial = function (binNode,memStream,i) {

    var newNodeMat = new LSJSimpleBinMat();
    newNodeMat.index = i;
    newNodeMat.id = i;
    binNode.arryMaterials.push(newNodeMat);

    newNodeMat.ambient = memStream.readUChar8Array2(4);
    newNodeMat.diffuse = memStream.readUChar8Array2(4);
    newNodeMat.specular = memStream.readUChar8Array2(4);
    newNodeMat.emission = memStream.readUChar8Array2(4);
    newNodeMat.shininess = memStream.readFloat();

    var imgUitNum =  memStream.readUInt32();

    for(var j=0;j<imgUitNum;j++)
    {
        var newImageUnit = new LSJBinImgUnit();
        var version = memStream.readUChar8();
        newImageUnit.imgIndex =  memStream.readUInt32();
        newImageUnit.renderMode =  memStream.readUInt32();
        newNodeMat.imgUnits.push(newImageUnit);
    }

};
LSJLBMParser.prototype.parseBinImgInnerData = function (binImgData,memStream) {

    var imgExt = memStream.readString();
    var imgDataLen = memStream.readUInt32();
    if(imgDataLen<1)
    {
        return;
    }
    var imgData =  memStream.readUChar8Array2(imgDataLen);

    var extension = imgExt.substring(imgExt.lastIndexOf('.'), imgExt.length).toLowerCase();
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
    binImgData.imgBlob = new Blob([imgData], {type : eftype});
    binImgData.bUrl = false;
};
LSJLBMParser.prototype.parseImages = function (binNode,memStream) {

    var imgNum = memStream.readUInt32();
    for(var i=0;i<imgNum;i++) {

        var newImgData = new LSJBinTImgData();
        var imgSaveType = memStream.readUInt32();
        var bTransparent =  memStream.readUChar8();
        if(imgSaveType == 0)
        {
            this.parseBinImgInnerData(newImgData,memStream);
            newImgData.bTransparent = bTransparent;
            binNode.arryImages.push(newImgData);
        }
        else
        {
            var imgPathName =  memStream.readString();
            newImgData.imgUrl = imgPathName;
            newImgData.bUrl = true;
            newImgData.bTransparent = bTransparent;
            binNode.arryImages.push(newImgData);
        }
        var bHasThumImg = memStream.readUChar8();
        if(bHasThumImg)
        {
            var curThumbImg =  new LSJBinTImgData();
            this.parseBinImgInnerData(curThumbImg,memStream);
            curThumbImg.bTransparent = bTransparent;
            newImgData.thumbImg = curThumbImg;
        }
    }

};


LSJLBMParser.prototype.parseMaterials = function (binNode,memStream) {

    var matNum = memStream.readUInt32();
    for(var i=0;i<matNum;i++) {
        var matType = memStream.readUInt32();
        if(matType == LSEBinMatType.Simple)
        {
            this.parseSimpleMaterial(binNode, memStream,i);
        }
    }

};
LSJLBMParser.prototype.parseNode = function (binNode,memStream) {

    var childNum = memStream.readUInt32();

    for(var i=0;i<childNum;i++)
    {
        var nodeType = memStream.readUInt32();
        var childNode =  new LSJBinModelNode();
        binNode.children.push(childNode);
        if(nodeType == 0)
        {
            childNode.strDataPath = memStream.readString();
        }
        else
        {
            this.parseNode(childNode,memStream);
        }
    }

    binNode.enRangeMode = memStream.readUInt32();
    var rangeListSize = memStream.readUInt32();
    var i= 0,j=0;
    for(i=0;i<rangeListSize;i++)
    {
        binNode.childRanges.push(memStream.readDouble());
        binNode.childRanges.push(memStream.readDouble());
    }

    binNode.bdSphere.push(memStream.readDouble()); //x
    binNode.bdSphere.push(memStream.readDouble());//y
    binNode.bdSphere.push(memStream.readDouble());//z
    binNode.bdSphere.push(memStream.readDouble());//radius


    binNode.bdBox.push(memStream.readDouble()); //minx
    binNode.bdBox.push(memStream.readDouble());//miny
    binNode.bdBox.push(memStream.readDouble());//minz
    binNode.bdBox.push(memStream.readDouble());//maxx
    binNode.bdBox.push(memStream.readDouble());//maxy
    binNode.bdBox.push(memStream.readDouble());//maxz

    var meshNum = memStream.readUInt32();
    for(i=0;i<meshNum;i++)
    {
        var newMesh = new LSJBinMesh();
        binNode.nodeMeshes.push(newMesh);
        newMesh.matIndex =  memStream.readUInt32();

        var elemCount =  memStream.readUInt32();
        if(elemCount>0)
        {
            var bufferDataTpe =  memStream.readUInt32();
            if(bufferDataTpe == LSEBinDataType.BDT_Float)
            {

                var vertsD = memStream.readFloat32Array(elemCount);
                newMesh.verts = new Float32Array( elemCount );
                for(j=0; j <elemCount ;j++)
                {
                    newMesh.verts[j] =  vertsD.getFloat32(j*4,true);
                }
            }
        }

        elemCount =  memStream.readUInt32();
        if(elemCount>0)
        {
            var bufferDataTpe =  memStream.readUInt32();
            if(bufferDataTpe == LSEBinDataType.BDT_Float)
            {

                var nmD = memStream.readFloat32Array(elemCount);
                newMesh.normals = new Float32Array( elemCount );
                for(j=0; j <elemCount ;j++)
                {
                    newMesh.normals[j] =  nmD.getFloat32(j*4,true);
                }
            }
        }



        elemCount =  memStream.readUInt32();

        if(elemCount>0)
        {
            var bufferDataTpe =  memStream.readUInt32();
            if(bufferDataTpe == LSEBinDataType.BDT_UInt)
            {

                var  clD = memStream.readUInt32Array(elemCount);
                newMesh.colors = new Float32Array( elemCount*3 );
                newMesh.colorPerNum = 3;
                for(j=0; j <elemCount ;j++)
                {
                    var clValue = clD.getUint32(j*4,true);
                    var alpha = clValue >> 24 & 0xff;
                    var red = clValue >> 16 & 0xff;
                    var green = clValue >> 8 & 0xff;
                    var blue = clValue & 0xff;
                    newMesh.colors[j*3] = red/255.0;
                    newMesh.colors[j*3+1] = green/255.0;
                    newMesh.colors[j*3+2] = blue/255.0;
                }
            }

        }

        elemCount =  memStream.readUInt32();
        if(elemCount>0)
        {
            var bufferDataTpe =  memStream.readUInt32();
            if(bufferDataTpe == LSEBinDataType.BDT_UInt)
            {
                var  clD = memStream.readUInt32Array(elemCount);
                newMesh.secondColors = new Float32Array( elemCount * 3 );
                newMesh.secondColorPerNum = 3;
                for(j=0; j <elemCount ;j++)
                {
                    var clValue = clD.getUint32(j*4,true);
                    var alpha = clValue >> 24 & 0xff;
                    var red = clValue >> 16 & 0xff;
                    var green = clValue >> 8 & 0xff;
                    var blue = clValue & 0xff;
                    newMesh.secondColors[j*3] = red/255.0;
                    newMesh.secondColors[j*3+1] = green/255.0;
                    newMesh.secondColors[j*3+2] = blue/255.0;
                }
            }
        }


        var indexNum =  memStream.readUInt32();
        if(indexNum>0)
        {
            var indexDataTpe =  memStream.readUInt32();
            if(indexDataTpe==LSEBinDataType.BDT_UInt)
            {
                var  indexes = memStream.readUInt32Array(indexNum);
                newMesh.indices = new Uint32Array(indexNum);
                for(j=0;j<indexNum;j++)
                {
                    newMesh.indices[j] = indexes.getUint32(j*4,true);
                }
            }
            else if(indexDataTpe==LSEBinDataType.BDT_UShort)
            {
                var  indexes = memStream.readUInt16Array(indexNum);
                newMesh.indices = new Uint16Array(indexNum);
                for(j=0;j<indexNum;j++)
                {
                    newMesh.indices[j] = indexes.getUint16(j*2,true);
                }
            }
        }



        var uvUnitNum =  memStream.readUInt32();

        for(var k=0;k<uvUnitNum;k++)
        {

            var  uvUnitCordElemNum =  memStream.readUInt32();
            if(uvUnitCordElemNum>0)
            {
                var bufferDataTpe =  memStream.readUInt32();
                if(bufferDataTpe == LSEBinDataType.BDT_Float)
                {

                    var tcD = memStream.readFloat32Array(uvUnitCordElemNum);
                    var arrayTData = new Float32Array( uvUnitCordElemNum );
                    for(j=0; j <uvUnitCordElemNum ;j++)
                    {
                        arrayTData[j] =  tcD.getFloat32(j*4,true);
                    }
                    newMesh.uvs.push(arrayTData);
                }

            }
        }

        var texUnitNum1 =  memStream.readUInt32();
        for(var t1=0;t1<texUnitNum1;t1++)
        {
            var newTexUnit = new LSJBinTexUnit();
            newMesh.texUnits.push(newTexUnit);
            newTexUnit.texIndex = memStream.readUInt32();
            newTexUnit.texCoordIndex =  memStream.readUInt32();
        }


        var primitiveSetNum =  memStream.readUInt32();

        for(var p=0;p<primitiveSetNum;p++)
        {
            var newPrimitiveSet = new LSJBinPrimitiveSet();
            newMesh.primitiveSets.push(newPrimitiveSet);

            newPrimitiveSet.primitiveType = memStream.readUInt32();
            newPrimitiveSet.opType = memStream.readUInt32();
            newPrimitiveSet.matIndex = memStream.readUInt32();
            var indexCount =  memStream.readUInt32();
            if(indexCount>0)
            {
                var bufferDataTpe =  memStream.readUInt32();
                if(bufferDataTpe==LSEBinDataType.BDT_Uint)
                {
                    var  indexes = memStream.readUInt32Array(indexCount);
                    newPrimitiveSet.indices = new Uint32Array(indexCount);
                    for(j=0;j<indexCount;j++)
                    {
                        newPrimitiveSet.indices[j] = indexes.getUint32(j*4,true);
                    }
                }
                else if(bufferDataTpe==LSEBinDataType.BDT_UShort)
                {
                    var  indexes = memStream.readUInt16Array(indexCount);
                    newPrimitiveSet.indices = new Uint16Array(indexCount);
                    for(j=0;j<indexCount;j++)
                    {
                        newPrimitiveSet.indices[j] = indexes.getUint16(j*2,true);
                    }
                }
            }

            var texUnitNum =  memStream.readUInt32();
            for(var t=0;t<texUnitNum;t++)
            {
                var newTexUnit = new LSJBinTexUnit();
                newPrimitiveSet.texUnits.push(newTexUnit);
                newTexUnit.texIndex = memStream.readUInt32();
                newTexUnit.texCoordIndex =  memStream.readUInt32();
            }

        }
    }
};
//解析二进制osgb
LSJLBMParser.prototype.parse = function (binNode,memStream) {

    var headerFlag = memStream.readUInt32();
    var version = memStream.readUInt32();
    var compressType = memStream.readUInt32();

    var pntProX = memStream.readDouble();
    var pntProY = memStream.readDouble();
    var pntProZ = memStream.readDouble();

    var pntGeoX = memStream.readDouble();
    var pntGeoY = memStream.readDouble();
    var pntGeoZ = memStream.readDouble();

    var pntOffsetMetersX = memStream.readDouble();
    var pntOffsetMetersY = memStream.readDouble();
    var pntOffsetMetersZ = memStream.readDouble();

    this.parseImages(binNode,memStream);
    this.parseMaterials(binNode,memStream);
    this.parseNode(binNode,memStream);

};
