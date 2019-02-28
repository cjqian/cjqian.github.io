var Filters = Filters || {}

Filters.translate = function( mesh, t ) {

    var verts = mesh.getModifiableVertices();

    var n_vertices = verts.length;
    for ( var i = 0 ; i < n_vertices ; ++i ) {
        verts[i].position.add( t );
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.rotate = function( mesh, rotate ) {
    var verts = mesh.getModifiableVertices();

    if (rotate.x !== 0){
        var vector = new THREE.Vector3(1, 0, 0);
        for (var i = 0; i < verts.length; i++){
            verts[i].position.applyAxisAngle(vector, rotate.x);
        }

        mesh.updateNormals();
          mesh.calculateFacesArea();
    }  

    if (rotate.y !== 0){
        var vector = new THREE.Vector3(0, 1, 0);
        for (var i = 0; i < verts.length; i++){
            verts[i].position.applyAxisAngle(vector, rotate.y);
        }

        mesh.updateNormals();
        mesh.calculateFacesArea();
    }

    if (rotate.z !== 0){
        var vector = new THREE.Vector3(0, 0, 1);
        for (var i = 0; i < verts.length; i++){
            verts[i].position.applyAxisAngle(vector, rotate.z);
        }

        mesh.updateNormals();
        mesh.calculateFacesArea();
    }
   

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.scale = function( mesh, s ) {
    var verts = mesh.getModifiableVertices();

    for (var i = 0; i < verts.length; i++){
        verts[i].position.multiplyScalar(s);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.curvature = function ( mesh ) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('Curvature is not implemented yet');
}

Filters.noise = function ( mesh, factor ) {
    var verts = mesh.getModifiableVertices();
    
    var n_vertices = verts.length;

    for ( var i = 0 ; i < n_vertices ; ++i ) {
        var noise = mesh.averageEdgeLength(verts[i]) * factor * (Math.random() * 2 - 1);
        verts[i].position.addScalar(noise);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.smooth = function ( mesh, iter ) {
    for (var t = 0; t < iter; t++){
        var verts = mesh.getModifiableVertices();

    //Calculate weighted averages
    var averagePos = [];

    //Calculates weighted for each vertex
    for (var i = 0; i < verts.length; i++){
        var sigma = mesh.averageEdgeLength(verts[i]);
        var sumGaussian = 1;

        var curPos = new THREE.Vector3(0, 0, 0);
        curPos.copy(verts[i].position);
 
        var neighbors = Mesh.prototype.verticesOnVertex(verts[i]);

        for (var j = 0; j < neighbors.length; j++){
            var gaussian = Math.exp(-verts[i].position.distanceToSquared(neighbors[j].position) / (2 * sigma * sigma));
            sumGaussian += gaussian;

            var tmpNeighbor = new THREE.Vector3(0, 0, 0);
            tmpNeighbor.copy(neighbors[j].position);

            //console.log("Tmp " + tmpNeighbor.x + ", " + tmpNeighbor.y + ", " + tmpNeighbor.z);

            curPos.add(tmpNeighbor.multiplyScalar(gaussian));
            //console.log("New " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        }

        curPos.multiplyScalar(1/sumGaussian);
        //console.log("PPos " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        //console.log("Pos " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        averagePos.push(curPos);
    }

    
    for (var i = 0; i < verts.length; i++){
        //console.log("Before " + verts[i].position.x + ", " + verts[i].position.y + ", " + verts[i].position.z);
        verts[i].position = averagePos[i];
        //console.log("After " + verts[i].position.x + ", " + verts[i].position.y + ", " + verts[i].position.z);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
    }
};

Filters.sharpen = function ( mesh, iter ) {
    for (var t = 0; t < iter; t++){
        var verts = mesh.getModifiableVertices();

    //Calculate weighted averages
    var averagePos = [];

    //Calculates weighted for each vertex
    for (var i = 0; i < verts.length; i++){
        var sigma = mesh.averageEdgeLength(verts[i]);
        var sumGaussian = 1;

        var curPos = new THREE.Vector3(0, 0, 0);
        curPos.copy(verts[i].position);
 
        var neighbors = Mesh.prototype.verticesOnVertex(verts[i]);

        // get averages
        for (var j = 0; j < neighbors.length; j++){
            var gaussian = Math.exp(-verts[i].position.distanceToSquared(neighbors[j].position) / (2 * sigma * sigma));
            sumGaussian += gaussian;

            var tmpNeighbor = new THREE.Vector3(0, 0, 0);
            tmpNeighbor.copy(neighbors[j].position);

            //console.log("Tmp " + tmpNeighbor.x + ", " + tmpNeighbor.y + ", " + tmpNeighbor.z);

            curPos.add(tmpNeighbor.multiplyScalar(gaussian));
            //console.log("New " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        }

        curPos.multiplyScalar(1/sumGaussian);
        curPos.sub(verts[i].position);
        curPos.multiplyScalar(-1);
        //console.log("PPos " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        //console.log("Pos " + curPos.x + ", " + curPos.y + ", " + curPos.z);
        averagePos.push(curPos);
    }

    //set positions
    for (var i = 0; i < verts.length; i++){
        //console.log("Before " + verts[i].position.x + ", " + verts[i].position.y + ", " + verts[i].position.z);
        verts[i].position.add(averagePos[i]);
        //console.log("After " + verts[i].position.x + ", " + verts[i].position.y + ", " + verts[i].position.z);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
    }
};

Filters.bilateral = function ( mesh, iter ) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('BilateralSmooth is not implemented yet');

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.inflate = function (  mesh, factor ) {
    
    var verts = mesh.getModifiableVertices();
    var value = factor;
    for (var i = 0; i < verts.length; i++){
        //console.log("Value " + value);

        var value = verts[i].normal.multiplyScalar(factor);
        //console.log(value);
        verts[i].position.add(value);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.twist = function (  mesh, factor ) {
    var verts = mesh.getModifiableVertices();
    var vector = new THREE.Vector3(0, 1, 0);

    for (var i = 0; i < verts.length; i++){
        var degree = verts[i].position.y * factor;
        verts[i].position.applyAxisAngle(vector, degree);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.wacky = function ( mesh, factor ) {
    var verts = mesh.getModifiableVertices();
    var value = factor;
    for (var i = 0; i < verts.length; i++){
        //console.log("Value " + value);

        var value = verts[i].normal.multiplyScalar(Math.sin(factor) + Math.cos(factor)).addScalar(-Math.sin(factor));
        //console.log(value);
        verts[i].position.add(value);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.triangulate = function ( mesh ) {
    
    var faces = mesh.getModifiableFaces();
    var len = faces.length;
    for (var i = 0; i < len; i++){
        var newFace = mesh.triangulateFace(faces[i]);
 
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.extrude = function ( mesh, factor ) {
    var faces   = mesh.getModifiableFaces();
    var flen = faces.length;

    //for each face
    for (var i = 0; i < flen; i++){
        var oldVerts = mesh.verticesOnFace(faces[i]);
        var newVerts = [];
        var newFaces = [];

        //add a new vertex for each current vertex and face
        for (var j = 0; j < oldVerts.length; j++){
            var newVert = mesh.addVertex(oldVerts[j].position);
            newVerts.push(newVert);

            newFaces.push(mesh.addFace());
        }

    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.truncate = function ( mesh, factor ) {
    var verts = mesh.getModifiableVertices();
    var vlen = verts.length;

    //grab positions
    var positions = [];
    for (var i = 0; i < verts.length; i++){
        var curPos = new THREE.Vector3();
        curPos.copy(verts[i].position);
        positions.push(curPos);
    }

    //split edge
    var vlen = verts.length;
    for (var i = 0; i < vlen; i++){
        var neighborVerts = mesh.verticesOnVertex(verts[i]);
        for (var j = 0; j < neighborVerts.length - 1; j++){
                mesh.splitEdge(verts[i], neighborVerts[j]);
        }
    }
    
    //split face
    for (var i = 0; i < vlen; i++){
        var edges = mesh.edgesOnVertex(verts[i]);
        var split = mesh.splitFace(edges[0].opposite.face, edges[0].vertex, edges[1].vertex);
    }

    
    //update positions
    for (var i = 0; i < vlen; i++){
        var neighborVerts = mesh.verticesOnVertex(verts[i]);
        var n = neighborVerts.length;

        for (var j = 0; j < n - 1; j++){
            var new_pos = new THREE.Vector3( 0, 0, 0 );
            var p1 = new THREE.Vector3( 0, 0 ,0 );
            p1.copy( positions[i] );
            var p2 = new THREE.Vector3( 0, 0 ,0 );
            p2.copy( neighborVerts[j].position );

            new_pos.add( p1.multiplyScalar( 1 - factor ) );
            new_pos.add( p2.multiplyScalar( factor ) );

            neighborVerts[j].position = new_pos;
        }

        var new_pos = new THREE.Vector3( 0, 0, 0 );
            var p1 = new THREE.Vector3( 0, 0 ,0 );
            p1.copy( positions[i] );
            var p2 = new THREE.Vector3( 0, 0 ,0 );
            p2.copy( neighborVerts[2].position );

            new_pos.add( p1.multiplyScalar( 1 - factor ) );
            new_pos.add( p2.multiplyScalar( factor ) );

            verts[i].position = new_pos;
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.bevel = function ( mesh ) {

    var faces = mesh.getModifiableFaces();

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('Bevel is not implemented yet');

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.splitLong = function ( mesh , fraction) {
    var verts = mesh.getModifiableVertices();
    var iterations = fraction * verts.length;

    for (var l = 0; l < iterations; l++){
    var maxEdge = verts[0].halfedge;
    var maxDist = verts[0].position.distanceTo(verts[0].halfedge.vertex.position);

    //get max edge
    for (var i = 1; i < verts.length; i++){
        var curDist = verts[i].position.distanceTo(verts[i].halfedge.vertex.position);
        if (curDist > maxDist){
            maxDist = curDist;
            maxEdge = verts[i].halfedge;
        }
    }

    //split edge
    var corners = mesh.verticesOnEdge(maxEdge);
    var mid = mesh.splitEdge(corners[0], corners[1]);
    mesh.splitFace(maxEdge.face, mid.halfedge.next.vertex, mid);

    //console.log(maxEdge.opposite.face, mid, mid.halfedge.opposite.next.vertex));
    //console.log(mid.halfedge.opposite.next.vertex.position);
    mesh.updateNormals();
    mesh.calculateFacesArea();
}
};

Filters.triSubdiv = function ( mesh, levels ) {
    Filters.triangulate(mesh);

    for (var l = 0; l < levels; l++){
        var faces = mesh.getModifiableFaces();
        var flen = faces.length;

        //make edge list
        var edges = [];
        for (var i = 0; i < flen; i++){
            var curEdges = mesh.edgesOnFace(faces[i]);
            var clen = curEdges.length;

            //get initial edges
            for (var j = 0; j < clen; j++){
                if (edges.indexOf(curEdges[j]) == -1 &&
                    edges.indexOf(curEdges[j].opposite) == -1){
                    edges.push(curEdges[j]);
                }
            }
        }

        //split each
        var elen = edges.length;
        for (var i = 0; i < elen; i++){
            var edge = mesh.edgeBetweenVertices(edges[i].vertex, edges[i].opposite.vertex);
            var temp = mesh.splitEdge(edge.vertex, edge.opposite.vertex);
        }

        for (var i = 0; i < flen; i++){
            var curVerts = mesh.verticesOnFace(faces[i]);
            var face = faces[i];

            var face = mesh.splitFace(face, curVerts[1], curVerts[3]);
            var face = mesh.splitFace(face, curVerts[3], curVerts[5]);
            var face = mesh.splitFace(face, curVerts[1], curVerts[5]);
        }

        
    }
    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.loop = function ( mesh, levels ) {
    for (var l = 0; l < levels; l++){
        var verts = mesh.getModifiableVertices();

    //make hardcopy
    var oVerts = [];
    for (var i = 0; i < verts.length; i++){
        oVerts.push(verts[i]);
    }

    //subdivide
    Filters.triSubdiv(mesh, levels);

    var positions = [];
    for (var i = 0; i < verts.length; i++){
        var curPos = new THREE.Vector3(0, 0, 0);
        //even
        if (oVerts.indexOf(verts[i]) != -1){
            var neighbors = mesh.verticesOnVertex(verts[i]);
            //console.log("Neighsize " + neighbors.length);
            //get beta
            var beta = 3/16;
            if (neighbors.length != 3) beta = 3/(8 * neighbors.length);
            
            curPos.copy(verts[i].position);
            curPos.multiplyScalar(1 - (beta * neighbors.length));

            for (var j = 0; j < neighbors.length; j++){
                //console.log("Neighbor " + neighbors[j].position.x + ", " + neighbors[j].position.y + ", " + neighbors[j].position.z);
                var neighborPos = new THREE.Vector3(0, 0, 0);
                neighborPos.copy(neighbors[j].position);
                curPos.add(neighborPos.multiplyScalar(beta));
            }
        }
       
        //odd
        else{           
            var neighbors = mesh.verticesOnVertex(verts[i]);

            for (var j = 0; j < neighbors.length; j++){
                if (oVerts.indexOf(neighbors[j]) != -1){
                    var neighborPos = new THREE.Vector3(0, 0, 0);
                    neighborPos.copy(neighbors[j].position);
                    curPos.add(neighborPos.multiplyScalar(3/8));
                }
            }

            //add two
            var neighborPos = new THREE.Vector3(0, 0, 0);
            neighborPos.copy(verts[i].halfedge.next.vertex.position);
            curPos.add(neighborPos.multiplyScalar(1/8));

            neighborPos.copy(verts[i].halfedge.opposite.next.vertex.position);
            curPos.add(neighborPos.multiplyScalar(1/8));
        }
        //console.log("out " + curPos);
        positions.push(curPos);
    }


        for (var i = 0; i < verts.length; i++){
            //console.log("in " + positions[i]);
            verts[i].position = positions[i];
        }

        mesh.updateNormals();
    mesh.calculateFacesArea();
    }

    
};

Filters.quadSubdiv = function ( mesh, levels ) {
    for (var l = 0; l < levels; l++){

        var verts = mesh.getModifiableVertices();
    var vlen = verts.length;
    
    //var centers
    var faces = mesh.getModifiableFaces();
    var flen = faces.length;
    var centers = [];
    for (var i = 0; i < flen; i++){
        centers.push(mesh.calculateFaceCentroid(faces[i]));
    }

    //grab originals
    var oVerts = [];
    for (var i = 0; i < vlen; i++){
        var nVerts = mesh.verticesOnVertex(verts[i]);
        oVerts.push(nVerts);
    }

    //splitEdge
    for (var i = 0; i < vlen; i++){
        var nVerts = oVerts[i];
        for (var j = 0; j < nVerts.length; j++){
            if (mesh.edgeBetweenVertices(verts[i], nVerts[j]) != undefined){
                mesh.splitEdge(verts[i], nVerts[j]);
            }
        }
    }

    for (var i = 0; i < flen; i++){
        var curVerts = mesh.verticesOnFace(faces[i]);
        var face = mesh.splitFace(faces[i], curVerts[1], curVerts[3]);
        var centerVert = mesh.splitEdge(curVerts[1], curVerts[3]);

        for (var j = 5; j < curVerts.length; j = j + 2){
            var face = mesh.splitFace(face, centerVert, curVerts[j]);
        }

        centerVert.position = centers[i];
    }
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};

Filters.catmullClark = function ( mesh, levels ) {

    for ( var l = 0 ; l < levels ; l++ ) {
        var faces = mesh.getModifiableFaces();
        // ----------- STUDENT CODE BEGIN ------------
        // ----------- STUDENT CODE END ------------
        Gui.alertOnce ('Catmull-Clark subdivide is not implemented yet');
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};
