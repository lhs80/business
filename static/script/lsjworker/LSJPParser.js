LSJPParser = function () {


};
LSJPParser.prototype.constructor = LSJPParser;

LSJPParser.prototype.parseMaterials = function (pageNode,memStream) {

    var matNum = memStream.readUInt32();
    for(var i=0;i<matNum;i++)
    {
        var newNodeMat = new LSJPNodeMat();
        newNodeMat.index = i;
        newNodeMat.id = i;
        pageNode.arryMaterials.push(newNodeMat);
        var ambientArray = memStream.readUChar8Array2(4);
        var diffuseArray = memStream.readUChar8Array2(4);
        var specularArray = memStream.readUChar8Array2(4);
        var shininess = memStream.readFloat();

        newNodeMat.diffuseR = diffuseArray[0]/255.0;
        newNodeMat.diffuseG = diffuseArray[1]/255.0;
        newNodeMat.diffuseB = diffuseArray[2]/255.0;

        var imgNum =  memStream.readUInt32();

        for(var j=0;j<imgNum;j++)
        {
            var imgSaveType = memStream.readUInt32();
            if(imgSaveType == 0)
            {
                var imgExt = memStream.readString();
                var imgDataLen = memStream.readUInt32();
                var imgData =  memStream.readUChar8Array2(imgDataLen);
                if(j==0)
                {
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
                    newNodeMat.imgBlob = new Blob([imgData], {type : eftype});
                    newNodeMat.bUrl = false;

                }
            }
            else
            {
                var imgPathName =  memStream.readString();
                if(j==0)
                {
                    newNodeMat.imgUrl = imgPathName;
                    newNodeMat.bUrl = true;
                }
            }

        }
    }
};
LSJPParser.prototype.parseNode = function (pageNode,memStream) {

    var childNum = memStream.readUInt32();

    for(var i=0;i<childNum;i++)
    {
        var nodeType = memStream.readUInt32();
        var childNode =  new LSJPNode();
        pageNode.children.push(childNode);
        if(nodeType == 0)
        {
            childNode.strDataPath = memStream.readString();
        }
        else
        {
            this.parseNode(childNode,memStream);
        }
    }

    pageNode.enRangeMode = memStream.readUInt32();
    var rangeListSize = memStream.readUInt32();
    var i= 0,j=0;
    for(i=0;i<rangeListSize;i++)
    {
        pageNode.childRanges.push(memStream.readDouble());
        pageNode.childRanges.push(memStream.readDouble());
    }

    pageNode.bdSphere.push(memStream.readDouble()); //x
    pageNode.bdSphere.push(memStream.readDouble());//y
    pageNode.bdSphere.push(memStream.readDouble());//z
    pageNode.bdSphere.push(memStream.readDouble());//radius

    var meshNum = memStream.readUInt32();
    for(i=0;i<meshNum;i++)
    {
        var newMesh = new LSJPNodeMesh();
        pageNode.nodeMeshes.push(newMesh);
        newMesh.matIndex =  memStream.readUInt32();
        var opType =  memStream.readUInt32();
        var indexCount =  memStream.readUInt32();
        if(indexCount>0)
        {
            var indexType = memStream.readUInt32();
            if(indexType==4)
            {
                var  indexes = memStream.readUInt32Array(indexCount);
                newMesh.indices = new Uint32Array(indexCount);
                for(j=0;j<indexCount;j++)
                {
                    newMesh.indices[j] = indexes.getUint32(j*4,true);
                }
            }
            else if(indexType==2)
            {
                var  indexes = memStream.readUInt16Array(indexCount);
                newMesh.indices = new Uint16Array(indexCount);
                for(j=0;j<indexCount;j++)
                {
                    newMesh.indices[j] = indexes.getUint16(j*2,true);
                }
            }
        }
        var vertexCount =  memStream.readUInt32();
        if(vertexCount>0)
        {
            var nArrayElemSize = vertexCount*3;
            var vertsD = memStream.readFloat32Array(nArrayElemSize);
            newMesh.verts = new Float32Array( nArrayElemSize );
            for(j=0; j <nArrayElemSize ;j++)
            {
                newMesh.verts[j] =  vertsD.getFloat32(j*4,true);
            }
        }

        var normalCount =  memStream.readUInt32();
        if(normalCount>0)
        {
            var nArrayElemSize = normalCount*3;
            var nmD = memStream.readFloat32Array(nArrayElemSize);
            newMesh.normals = new Float32Array( nArrayElemSize );
            for(j=0; j <nArrayElemSize ;j++)
            {
                newMesh.normals[j] =  nmD.getFloat32(j*4,true);
            }
        }

        var uvUnitNum =  memStream.readUInt32();

        for(var k=0;k<uvUnitNum;k++)
        {

            var  uvUnitCordNum =  memStream.readUInt32();
            if(uvUnitCordNum>0)
            {
                var nArrayElemSize = uvUnitCordNum*2;
                var tcD = memStream.readFloat32Array(nArrayElemSize);
                var arrayTData = new Float32Array( nArrayElemSize );
                for(j=0; j <nArrayElemSize ;j++)
                {
                    arrayTData[j] =  tcD.getFloat32(j*4,true);
                }
                newMesh.uvs.push(arrayTData);
            }
        }

        var colorNum =  memStream.readUInt32();

        if(colorNum>0)
        {
            var nArrayElemSize = colorNum;
            var  clD = memStream.readUInt32Array(nArrayElemSize);
            newMesh.colors = new Uint32Array( nArrayElemSize );
            newMesh.colorPerNum = 1;
            for(j=0; j <nArrayElemSize ;j++)
            {
                newMesh.colors[j] =  clD.getUint32(j,true);
            }
        }


        var secondColorNum =  memStream.readUInt32();
        if(secondColorNum>0)
        {
            var nArrayElemSize = secondColorNum;
            var  clD = memStream.readUInt32Array(nArrayElemSize);
        }
    }
};
//解析二进制osgb
LSJPParser.prototype.parse = function (pageNode,memStream) {


    var version = memStream.readUInt32();

    this.parseMaterials(pageNode,memStream);


    this.parseNode(pageNode,memStream);

};
