var Scene = Scene || {};

Scene.addCornellBox = function () {
    // back
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '3f','color', 0.2, 0.5, 0.2 );
    Raytracer.setUniformMaterial( '1i', 'special', Raytracer.MYSPECIAL ); 
    Raytracer.addPlane(  0.0, 0.0, 1.0, 40.0 );
    
    
    // front
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '3f','color', 0.5, 0.4, 0.1 );
    Raytracer.addPlane(  0.0, 0.0, -1.0, 40.0 );

    // Right Wall
	Raytracer.setUniformMaterial( '3f','color', 0.1, 0.1, 0.6 );

    Raytracer.addPlane(  1.0, 0.0, 0.0, 40.0 );
    
    // Left Wall
	Raytracer.setUniformMaterial( '3f','color', 0.6, 0.1, 0.1 );
    Raytracer.addPlane(  -1.0, 0.0, 0.0, 40.0 );
    
    
    // Top 
	Raytracer.setUniformMaterial( '3f','color', 0.3, 0.3, 0.3 );
    Raytracer.addPlane(  0.0, 1.0, 0.0, 35.0 );
    
    // Bottom
    Raytracer.setUniformMaterial( '1i','materialType', Raytracer.PHONGMATERIAL);
	Raytracer.setUniformMaterial( '3f','color', 0.7, 0.7, 0.7 );
    Raytracer.setUniformMaterial( '1i', 'special', Raytracer.CHECKERBOARD ); 
    Raytracer.setUniformMaterial( '1f','shininess', 500 ); 
    Raytracer.addPlane(  0.0, -1.0, 0.0, 30.0 );
    
};

Scene.default = function () {
    Raytracer.setUniform('3f', 'camera' ,0.0, 0.0, -28.0);
    // make it default
    Raytracer.resetMaterial();
    
    // Sphere
    Raytracer.setUniformMaterial( '1i','materialType', Raytracer.PHONGMATERIAL);
    Raytracer.setUniformMaterial( '1i','materialReflectType', Raytracer.MIRRORREFLECT);
    Raytracer.setUniformMaterial( '1f','reflectivity', 1.0);   
    Raytracer.setUniformMaterial( '3f','color', 0.2, 0.4, 1.0 );
	Raytracer.setUniformMaterial( '3f','specular', 1.0, 1.0, 1.0 );
	Raytracer.setUniformMaterial( '1f','shininess', 1000 );    
    Raytracer.addSphere( 15.0, 2.0, 20.0, 8.0 );

    // cylinder    
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '1i', 'special', Raytracer.CHECKERBOARD ); 
    Raytracer.setUniformMaterial( '3f','color', 0.2, 0.4, 0.5 );
    Raytracer.addCylinder( 15.0, -6.0, 20.0,  15.0, -30.0, 20.0, 7.0);  
    
    // Box
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '3f','color', 0.3, 0.4, 0.4 );
    Raytracer.addAxisBox( -25.0, -30.0, 10.0,  -15.0, -10.0, 20.0);
    
    
    // Sphere
    Raytracer.setUniformMaterial( '1i','materialType', Raytracer.PHONGMATERIAL);
    Raytracer.setUniformMaterial( '1i','materialReflectType', Raytracer.GLASSREFLECT);
    Raytracer.setUniformMaterial( '1f','reflectivity', 1.0);   
    Raytracer.setUniformMaterial( '3f','color', 0.4, 0.4, 0.4 );
	Raytracer.setUniformMaterial( '3f','specular', 1.0, 1.0, 1.0 );
	Raytracer.setUniformMaterial( '1f','shininess', 1000 ); 
    Raytracer.setUniformMaterial( '1f','refractionRatio', 0.8 );  
    Raytracer.addSphere( -20.0, -2.0, 15.0, 8.0 );
    
    
    // Matte Sphere
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '1i','materialType', Raytracer.PHONGMATERIAL);
    Raytracer.setUniformMaterial( '1i','materialReflectType', Raytracer.NONEREFLECT); 
    Raytracer.setUniformMaterial( '3f','specular', 0.8, 0.8, 0.8 ); 
    Raytracer.setUniformMaterial( '1f','shininess', 200 ); 
    Raytracer.setUniformMaterial( '3f','color', 0.2, 0.4, 0.5 );
    Raytracer.addSphere( -4.0, -22.0, 20.0, 8.0 );
    /*
    // cone
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '1i','materialType', Raytracer.PHONGMATERIAL);
    Raytracer.setUniformMaterial( '1i','materialReflectType', Raytracer.NONEREFLECT);
    //Raytracer.setUniformMaterial( '1i','materialReflectType', Raytracer.MIRRORREFLECT);
    Raytracer.setUniformMaterial( '1f','reflectivity', 1.0);   
    Raytracer.setUniformMaterial( '3f','color', 0.4, 0.4, 0.4 );
	Raytracer.setUniformMaterial( '3f','specular', 1.0, 1.0, 0.1 );
	Raytracer.setUniformMaterial( '1f','shininess', 150 );    
    Raytracer.addCone( -15.0, 10.0, 16.0,  -15.0, -5.0, 16.0, 5.0);
    */
    // add cornell box
	this.addCornellBox();

    Raytracer.setUniform('1i', 'numObjects', Raytracer.objectID);

    
    Raytracer.addLight(-20.0, 20.0, 5.0, 1.0, 1.0, 1.0, 10.0, 1.5);
    Raytracer.addLight( 20.0, 20.0, 5.0, 1.0, 1.0, 1.0, 40.0, 2);
    Raytracer.addLight(-10.0, 20.0, -10.0, 1.0, 1.0, 1.0, 20.0, 1);
    Raytracer.addLight( 10.0, 20.0, -10.0, 1.0, 1.0, 1.0, 40.0, 1);
    Raytracer.setUniform('1i', 'numLights', Raytracer.lightID);
};

// get this scene to appear using the URL: raytracer.html?scene=myScene
Scene.myScene = function () {
    Raytracer.setUniform('3f', 'camera' ,0.0, 20.0, 10.0);
    Raytracer.addLight(-17.5, 30.0, 90.0, 1.0, 1.0, 1.0, 40.0, 1);
    // put whatever you want in here...
	// make it default
    Raytracer.resetMaterial();
    
    Raytracer.resetMaterial();
    Raytracer.setUniformMaterial( '3f','color', 0.3, 0.4, 0.4 );
    //floor
    Raytracer.addPlane(  0.0, -1.0, 0.0, 30.0 );
    Raytracer.setUniformMaterial( '3f','color', .35, 0.3, 0.3 );
    //left leg
    Raytracer.addAxisBox( -25.0, -30.0, 100.0,  -20.0, -10.0, 110.0);
    //right leg
    Raytracer.addAxisBox( -15.0, -30.0, 100.0,  -10.0, -10.0, 110.0);
    
    //left arm
    Raytracer.addCone(-25.0, 0.0, 105.0, -30.0, -10.0, 100.0, 3.0);
    //right arm
    Raytracer.addCone(-10.0, 0.0, 105.0, -5.0, -10.0, 100.0, 3.0);
    //head
    Raytracer.addSphere(-17.5, 5.0, 105.0, 5.0);

    Raytracer.setUniformMaterial( '1f','reflectivity', 1.0);  
    Raytracer.setUniformMaterial( '3f','color', .2, 0.4, 0.6);
    //torso
    Raytracer.addAxisBox( -25.0, -20.0, 99.0,  -10.0, 0.0, 111.0);

    Raytracer.setUniformMaterial( '1f','shininess', 150 ); 
    Raytracer.setUniformMaterial( '3f','color', 1, 0.2, 0.2);
    //hat
    Raytracer.addCone(-17.5, 12.0, 105.0, -17.5, 8.0, 105.0, 8.0);

    //Raytracer.addCone = function( topX, topY, topZ, bottomX, bottomY, bottomZ , radius ) {
    // specify number of objects, add camera, and lights
    Raytracer.setUniform('1i', 'numObjects', Raytracer.objectID);
    Raytracer.setUniform('3f', 'camera' ,0.0, 0.0, -28.0);
    
    Raytracer.addLight(-20.0, 20.0, 5.0, 1.0, 1.0, 1.0, 100.0, 1.5);
    Raytracer.setUniform('1i', 'numLights', Raytracer.lightID);
}