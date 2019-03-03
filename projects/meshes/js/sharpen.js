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