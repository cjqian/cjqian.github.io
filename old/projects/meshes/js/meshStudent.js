// In this file you will implement traversal and analysis paer to your assignment.
// Make sure to familairize yourself with other utility funcitons in mesh.js
// they might be useful for second part of your assignemnt!

////////////////////////////////////////////////////////////////////////////////
// Traversal
////////////////////////////////////////////////////////////////////////////////

Mesh.prototype.verticesOnFace = function ( f ) {
    var vertices = [];
    var he = f.halfedge;
    var first = he;
    while ( true ) {
        vertices.push( he.vertex );
        var he = he.next;
        if ( he === first ) break;
    }
    return vertices;
};

Mesh.prototype.edgesOnFace = function ( f ) {
    var halfedges = [];
    var he = f.halfedge;
    var first = he;

    while ( true ) {
        halfedges.push(he);
        var he = he.next;
        if (he === first) break;
    }

    return halfedges;
};

Mesh.prototype.facesOnFace = function ( f ) {
    var faces = [];
    var he = f.halfedge;
    var first = he;

    while ( true ){
        faces.push(he.face);
        var he = he.next;
        if (he == first) break;
    }

    return faces;
};

//this works
Mesh.prototype.verticesOnVertex = function ( v ) {
    var vertices = [];
    var he = v.halfedge;

    while (true){
        vertices.push(he.vertex);
        var he = he.opposite.next;

        if (he == v.halfedge) break;
    }

    return vertices;
};

Mesh.prototype.edgesOnVertex = function ( v ) {
    var halfedges = [];
    var he = v.halfedge;

    while ( true ){
        halfedges.push(he);
        var he = he.opposite.next;
        if (he == v.halfedge) break;
    }

    return halfedges;
};

Mesh.prototype.facesOnVertex = function ( v ) {
    var faces = [];
    var he = v.halfedge;

    while ( true ){
        faces.push(he.face);
        // Go back         
        he = he.opposite.next;
        if (he == v.halfedge) break;
    }

    return faces;
};

Mesh.prototype.verticesOnEdge = function ( e ) {
    var vertices = []

    vertices.push(e.vertex);
    vertices.push(e.opposite.vertex);
    return vertices;
};

Mesh.prototype.facesOnEdge = function ( e ) {
    var faces = [];
    var he = e;

    while (true){
        faces.push(e.face);
        var he = he.opposite;
        if (he == e) break;
    }
    return faces;
};

Mesh.prototype.edgeBetweenVertices = function ( v1, v2 ) {
    var possEdges = this.edgesOnVertex(v1);
    var possEdges2 = this.edgesOnVertex(v2);
    for (var i = 0; i < possEdges.length; i++){
        if (possEdges[i].vertex == v2){
            return possEdges[i];
        }
    }
    /*
    var out_he = undefined;
    var he = v1.halfedge;
    
    var possEdges = this.edgesOnVertex(v1);
    console.log("edge between called" + possEdges.length);
    for (var i = 0; i < possEdges.length; i++){
        if (possEdges[i].vertex == v2){
            out_he = he;
            break;
        }
    }
    return out_he;*/
};

////////////////////////////////////////////////////////////////////////////////
// Analysis
////////////////////////////////////////////////////////////////////////////////
Mesh.prototype.calculateFaceArea = function ( f ) {
    
    var area = 0.0;

    var verts = Mesh.prototype.verticesOnFace(f);

    for (var i = 0; i < verts.length - 2; i+=2){
        var ab = new THREE.Vector3(0, 0, 0);
        ab.copy(verts[i].position);
        ab.sub(verts[i + 1].position);

        var ac = new THREE.Vector3(0, 0, 0);
        ac.copy(verts[i].position);
        ac.sub(verts[i + 2].position);

        ab.cross(ac);

        var mag = Math.sqrt((ab.x * ab.x) + (ab.y * ab.y) + (ab.z * ab.z));
        area += .5 * mag;
    }

    // if even, get final triangle
    if (verts.length % 2 == 0){
        var ab = new THREE.Vector3(0, 0, 0);
        ab.copy(verts[0].position);
        ab.sub(verts[verts.length - 2].position);

        var ac = new THREE.Vector3(0, 0, 0);
        ac.copy(verts[0].position);
        ac.sub(verts[verts.length - 1].position);
        ab.cross(ac);
        
        area += .5 * ab.length();
    }


    // if odd, get final triangle
    else{
        var ab = new THREE.Vector3(0, 0, 0);
        ab.copy(verts[0].position);
        ab.sub(verts[(verts.length - 1)/2].position);

        var ac = new THREE.Vector3(0, 0, 0);
        ac.copy(verts[0].position);
        ac.sub(verts[verts.length - 1].position);
        ab.cross(ac);
        
        area += .5 * ab.length();
    }

    return area;
};

Mesh.prototype.calculateFacesArea = function ( f ) {
    for ( var i = 0; i < this.faces.length; ++i ) {
        this.faces[i].area = this.calculateFaceArea( this.faces[i] );
    }
};

Mesh.prototype.calculateVertexNormal = function( v ) {
   var v_normal = new THREE.Vector3( 0, 0, 0 );
   
   faces = Mesh.prototype.facesOnVertex(v);
   
   for (var i = 0; i < faces.length; i++){
        v_normal.add(faces[i].normal);
   }

   v_normal.divideScalar(faces.length);
   //console.log("V normal: " + v_normal.x + ", " + v_normal.y + ", " + v_normal.z);
   return v_normal;

};

Mesh.prototype.updateVertexNormals = function() {
    //this.vertices.length
   for ( var i = 0; i < this.vertices.length; ++i ) {
      this.vertices[i].normal = this.calculateVertexNormal( this.vertices[i] );
   }
};

Mesh.prototype.calculateVertexArea = function ( v ) {
    var area = 0.0;
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    return area;
};


Mesh.prototype.averageEdgeLength = function ( v ) {
    var avg = 0.0;
    var edges = Mesh.prototype.edgesOnVertex(v);

    for (var i = 0; i < edges.length - 1; i++){
        avg += edges[i].vertex.position.distanceTo(edges[i + 1].vertex.position);

    }

    avg += edges[0].vertex.position.distanceTo(edges[edges.length - 1].vertex.position);
    avg = avg / edges.length;

    return avg;
}

Mesh.prototype.triangulateFace = function ( f ) {

    var verts = Mesh.prototype.verticesOnFace(f);
    var len = verts.length;
    if (len != 3){
        for (var i = 0; i < len - 2; i += 2){
            var f = this.splitFace(f, verts[i], verts[i + 2]);
        }
    }
};
