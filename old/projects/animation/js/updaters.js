/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var Collisions = Collisions || {};


Collisions.BouncePlane = function ( particleAttributes, alive, delta_t, plane,damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        if ( plane.x * pos.x + plane.y * pos.y + plane.z * pos.z <= plane.w){
            //normal with y plane
            //pos.y = plane.w;
            vel = vel.multiplyScalar(damping);
            vel.y = Math.abs(vel.y);
        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.SinkPlane = function ( particleAttributes, alive, delta_t, plane  ) {
    var positions   = particleAttributes.position;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );

        if ( plane.x * pos.x + plane.y * pos.y + plane.z * pos.z <= plane.w){
            alive[i] = false;
            killPartilce( i, particleAttributes, alive );
        }
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BounceBoxes = function ( particleAttributes, alive, delta_t, box, damping) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var min = box.min;
    var max = box.max;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
            var pos = getElement( i, positions );
            var vel = getElement( i, velocities );

            if ( pos.x >= min.x && pos.x <= max.x &&
                    pos.y >= min.y && pos.y <= max.y &&
                    pos.z >= min.z && pos.z <= max.z ){
                vel = vel.multiplyScalar(damping);
                vel.y = Math.abs(vel.y);
            }

            //slow particles die
            if (vel < 1 && vel > 1)
                killPartilce(i, particleAttributes, alive);

        // ----------- STUDENT CODE END ------------

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
};

Collisions.SinkBoxes = function ( particleAttributes, alive, delta_t, box  ) {
    var positions   = particleAttributes.position;
    var min = box.min;
    var max = box.max;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
            var pos = getElement( i, positions );

            if ( pos.x >= min.x && pos.x <= max.x &&
                    pos.y >= min.y && pos.y <= max.y &&
                    pos.z >= min.z && pos.z <= max.z ){
                alive[i] = false;
                killPartilce( i, particleAttributes, alive );
        }
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BounceSphere = function ( particleAttributes, alive, delta_t, sphere, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var center = sphere.center;
    var r = sphere.radius;
    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        if ( pos.distanceTo(center) < r){
            //damping = 0;
            pos = pos.normalize().multiplyScalar(r + .01);
            vel = vel.multiplyScalar(damping);
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

////////////////////////////////////////////////////////////////////////////////
// Null updater - does nothing
////////////////////////////////////////////////////////////////////////////////

function VoidUpdater ( opts ) {
    this._opts = opts;
    return this;
};

VoidUpdater.prototype.update = function ( particleAttributes, initialized, delta_t ) {
    //do nothing
};

////////////////////////////////////////////////////////////////////////////////
// Euler updater
////////////////////////////////////////////////////////////////////////////////

function EulerUpdater ( opts ) {
    this._opts = opts;
    return this;
};


EulerUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

EulerUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var p = getElement( i, positions );
        var v = getElement( i, velocities );

        // now update velocity based on forces...
        var sumForces = gravity;
        
        for ( var j = 0; j < attractors.length; ++j ){
            var attractor = attractors[j];
            var intensity = attractor.radius;
            var distance = p.distanceTo(attractor.center);
            var direction = p.sub(attractor.center).normalize().multiplyScalar(-1);
            var factor = intensity / (distance * distance);
            var force = direction.multiplyScalar(factor);
            sumForces.add(force);
        }

        v.add(sumForces.clone().multiplyScalar( delta_t));

        setElement( i, velocities, v );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var c = getElement( i, colors );

        setElement( i, colors, c );
        // ----------- STUDENT CODE END ------------
    }
};

EulerUpdater.prototype.updateSizes= function ( particleAttributes, alive, delta_t ) {
    var sizes    = particleAttributes.size;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var s = getElement( i, sizes );

        setElement( i, sizes, s );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions     = particleAttributes.position;
    var lifetimes     = particleAttributes.lifetime;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        var lifetime = getElement( i, lifetimes );

        if ( lifetime < 0 ) {
            killPartilce( i, particleAttributes, alive );
        } else {
            setElement( i, lifetimes, lifetime - delta_t );
        }
    }

};

EulerUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.bounceBoxes ) {
        for (var i = 0 ; i < this._opts.collidables.bounceBoxes.length ; ++i ) {
            var box = this._opts.collidables.bounceBoxes[i].box;
            var damping = this._opts.collidables.bounceBoxes[i].damping;
            Collisions.BounceBoxes( particleAttributes, alive, delta_t, box, damping );
        }
    }

    if ( this._opts.collidables.sinkBoxes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkBoxes.length ; ++i ) {
            var box = this._opts.collidables.sinkBoxes[i].box;
            Collisions.SinkBoxes( particleAttributes, alive, delta_t, box );
        }
    }

    if ( this._opts.collidables.spheres ) {
        for (var i = 0 ; i < this._opts.collidables.spheres.length ; ++i ) {
            Collisions.Sphere( particleAttributes, alive, delta_t, this._opts.collidables.spheres[i] );
        }
    }
};

EulerUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {

    this.updateLifetimes( particleAttributes, alive, delta_t );
    this.updateVelocities( particleAttributes, alive, delta_t );
    this.updatePositions( particleAttributes, alive, delta_t );

    this.collisions( particleAttributes, alive, delta_t );

    this.updateColors( particleAttributes, alive, delta_t );
    this.updateSizes( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;

}


function ClothUpdater ( opts ) {
    this._opts = opts;
    this._s = 10.0;
    this._k_s = 0.55;
    return this;
}

ClothUpdater.prototype.calcHooke = function ( p, q ) {
    // ----------- STUDENT CODE BEGIN ------------
    var k_s = this._k_s;
    var rest_len = this._s;

    var diffVec = q.sub(p);
    var d = diffVec.length();
    var D = diffVec.multiplyScalar(1/d);

    var f = D.multiplyScalar(k_s * (d - rest_len));
    return f;
    // ----------- STUDENT CODE END ------------
}

ClothUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

ClothUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t, width, height ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    for ( var j = 0 ; j < height; ++j ) {
        for ( var i = 0 ; i < width ; ++i ) {
            var idx = j * width + i;

            // ----------- STUDENT CODE BEGIN ------------
            var p = getElement( idx, positions );
            var v = getElement( idx, velocities );
            
            var sumForces = gravity;

            // calculate forces on this node from neighboring springs 
            // (using this.calcHooke()... )

            if (idx + 1 < width * height){
                var q = getElement( idx + 1, positions );
                sumForces.add(this.calcHooke(p, q));
            }

            if (idx > 0){
                var q = getElement( idx - 1, positions );
                sumForces.add(this.calcHooke(p, q));
            }

            if (idx + width < width * height){
                var q = getElement( idx + width, positions );
                sumForces.add(this.calcHooke(p, q));
            }

            if (idx - width >= 0){
                var q = getElement( idx - width, positions );
                sumForces.add(this.calcHooke(p, q));
            }

            v.add(sumForces.clone().multiplyScalar( delta_t));
            
            setElement( idx, velocities, v );
            // ----------- STUDENT CODE END ------------
        }
    }

};


ClothUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.bounceSpheres ) {
        for (var i = 0 ; i < this._opts.collidables.bounceSpheres.length ; ++i ) {
            var sphere = this._opts.collidables.bounceSpheres[i].sphere;
            var damping = this._opts.collidables.bounceSpheres[i].damping;
            Collisions.BounceSphere( particleAttributes, alive, delta_t, sphere, damping );
        }
    }
};


ClothUpdater.prototype.update = function ( particleAttributes, alive, delta_t, width, height ) {

    this.updateVelocities( particleAttributes, alive, delta_t, width, height );
    this.updatePositions( particleAttributes, alive, delta_t, width, height );

    this.collisions( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;
}
