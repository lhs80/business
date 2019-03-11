/**
 * Created by mlq on 2016/9/6.
 */


if(typeof LSEBinMatType == "undefined"){
    var LSEBinMatType = {
        Undefined: 0,
        Simple: 1
    }
}

if(typeof LSEOpType == "undefined"){
    var LSEOpType = {
        OT_POINT_LIST: 1,
        OT_LINE_LIST:2,
        OT_LINE_STRIP:3,
        OT_TRIANGLE_LIST:4,
        OT_TRIANGLE_STRIP:5,
        OT_TRIANGLE_FAN:6,
        OT_QUAD_STRIP:8,
        OT_QUADS:9,
        OT_POLYGON: 10,
        OT_LINE_LOOP: 11,
        OT_LINES_ADJACENCY: 12,
        OT_LINE_STRIP_ADJACENCY: 13,
        OT_TRIANGLES_ADJACENCY: 14,
        OT_TRIANGLE_STRIP_ADJACENCY: 15,
        OT_PATCHES:16
    }
}

if(typeof LSEBinDataType == "undefined"){
    var LSEBinDataType = {
        BDT_Undefined : 0,
        BDT_Byte : 1,
        BDT_Short : 2,
        BDT_Int : 3,
        BDT_UByte : 4,
        BDT_UShort : 5,
        BDT_UInt : 6,
        BDT_Float : 7,
        BDT_Double : 8
    }
}


if(typeof LSETexMode == "undefined"){
    var LSETexMode = {
        TM_Undefined : 0,
        TM_Diffuse : 1,
        TM_Bump : 2,
        TM_Normal : 3,
        TM_Specular : 4
    }
}
LSJBinTImgData = function()
{
    this.imgUrl = '';
    this.imgBlob = null;
    this.bUrl = true;
    this.bTransparent = false;
    this.thumbImg = null;
};
LSJBinImgUnit = function()
{
    this.imgIndex = -1; // 纹理索引
    this.renderMode = 1;//纹理展现方式  diffuse  bump specular light
};
LSJSimpleBinMat = function()
{
    this.id = -1;
    this.index = -1;
    this.ambient = [];
    this.diffuse = [];
    this.specular = [];
    this.emission = [];
    this.shininess = 0;
    this.imgUnits = [];
};

LSJBinTexUnit = function()
{
    this.texIndex = 0;
    this.texCoordIndex = 0;
};
LSJBinPrimitiveSet = function()
{
    this.matIndex = -1;
    this.primitiveType = 0;
    this.opType = 0;
    this.indices = null;
    this.texUnits = [];
};
LSJBinMesh = function()
{
    this.matIndex = -1;
    this.verts = null;
    this.normals = null;
    this.colors = null;
    this.colorPerNum = 1;
    this.secondColors = null;
    this.secondColorPerNum = 1;
    this.indices = null;
    this.uvs = [];
    this.texUnits = [];
    this.primitiveSets = [];

};

LSJBinModelNode = function () {

    this.children = [];
    this.childRanges = []; // min,max成对出现
    this.strDataPath =  '';
    this.bdSphere  = [];  // 4个值，x,y,z,radius
    this.bdBox = [];//6个值,minx,miny,minz,maxx,maxy,maxz
    this.enRangeMode = 0;
    this.arryImages = [];
    this.arryMaterials = [];
    this.nodeMeshes = [];

};