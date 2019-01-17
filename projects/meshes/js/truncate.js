Filters.truncate = function ( mesh, factor ) {
    var verts = mesh.getModifiableVertices();
    var vlen = verts.length;
    
    var nv1 = [];
    var nv2 = [];

    //grab originals
    var oVerts = [];
    for (var i = 0; i < vlen; i++){
        var nVerts = mesh.verticesOnVertex(verts[i]);

        oVerts.push(nVerts);
    }

    var leftPos = [];
    var rightPos = [];
    var botPos = [];

    //splitEdge
    for (var i = 0; i < vlen; i++){
        var nVerts = oVerts[i];
        var hVerts = mesh.verticesOnVertex(verts[i]);

        if (mesh.edgeBetweenVertices(verts[i], nVerts[0]) != undefined){
            var leftTmp = mesh.splitEdge(verts[i], nVerts[0], factor);
        }
        else var leftTmp = hVerts[0];

        if (mesh.edgeBetweenVertices(verts[i], nVerts[1]) != undefined){
            var rightTmp = mesh.splitEdge(verts[i], nVerts[1], factor);
        }
        else var rightTmp = hVerts[1];

        leftPos.push(leftTmp.position);
        rightPos.push(rightTmp.position);

        // compute new vertex position
        var new_pos = new THREE.Vector3( 0, 0, 0 );
        var p1 = new THREE.Vector3( 0, 0 ,0 );
        p1.copy( verts[i].position );
        var p2 = new THREE.Vector3( 0, 0 ,0 );
        p2.copy( nVerts[2].position );

        new_pos.add( p1.multiplyScalar( factor ) );
        new_pos.add( p2.multiplyScalar( 1 - factor ) );
        botPos.push(new_pos);
    }

    //splitFace
    for (var i = 0; i < vlen; i++){
        var nVerts = mesh.verticesOnVertex(verts[i]);
        var v1 = nVerts[0];
        var v2 = nVerts[1];

        //get common face
        var f1 = mesh.facesOnVertex(v1);
        var f2 = mesh.facesOnVertex(v2);
        for (var x = 0; x < f1.length; x++){
            for (var y = 0; y < f2.length; y++){
                if (f1[x] == f2[y]) var face = f1[x];
            }
        }

        mesh.splitFace(face, v1, v2);

        v1.position.copy(leftPos[i]);
        v2.position.copy(rightPos[i]);
        verts[i].position.copy(botPos[i]);
    }

    mesh.updateNormals();
    mesh.calculateFacesArea();
};
