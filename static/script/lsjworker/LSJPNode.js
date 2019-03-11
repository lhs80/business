LSJPNodeMat = function()
{
    this.id = -1;
    this.index = -1;
    this.imgUrl = '';
    this.imgBlob = null;
    this.bUrl = true;
    this.diffuseR = 1.0;
    this.diffuseG = 1.0;
    this.diffuseB = 1.0;
};
LSJPNodeMesh = function()
{
    this.matIndex = -1;
    this.indices = null;
    this.verts = null;
    this.normals = null;
    this.colors = null;
    this.colorPerNum = 1;
    this.uvs = [];
};

LSJPNode = function () {

    this.children = [];
    this.childRanges = []; // min,max成对出现
    this.strDataPath =  '';
    this.bdSphere  = [];  // 4个值，x,y,z,radius
    this.enRangeMode = 0;
    this.arryMaterials = [];
    this.nodeMeshes = [];

};