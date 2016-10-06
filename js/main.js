// Set up three.js global variables
var scene, camera, renderer, container, loadingManager, octree;
// Set up avatar global variables
var bbox;
// Transfer global variables
var i_share = 0, n_share = 1, i_delta = 0.0;
 
init();
animate();

// Sets up the scene.
function init()
{
    // Create the scene and set the scene size.
    scene = new THREE.Scene();
    
    // keep a loading manager
    loadingManager = new THREE.LoadingManager();

    // Get container information
    container = document.createElement( 'div' );
    document.body.appendChild( container ); 
    
    var WIDTH = window.innerWidth, HEIGHT = window.innerHeight; //in case rendering in body
    
	octree = new THREE.Octree( {
		// uncomment below to see the octree (may kill the fps)
		//scene: scene,
		// when undeferred = true, objects are inserted immediately
		// instead of being deferred until next octree.update() call
		// this may decrease performance as it forces a matrix update
		undeferred: false,
		// set the max depth of tree
		depthMax: Infinity,
		// max number of objects before nodes split or merge
		objectsThreshold: 8,
		// percent between 0 and 1 that nodes will overlap each other
		// helps insert objects that lie over more than one node
		overlapPct: 0.15
		//~ scene: scene
	} );
	
    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    // Set the background color of the scene.
    renderer.setClearColor(0x333333, 1);
    
    //document.body.appendChild(renderer.domElement); //in case rendering in body
    container.appendChild( renderer.domElement );
	
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
				
    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45.0, WIDTH / HEIGHT, 0.01, 100);
    camera.position.set(-2, 2, -5);
    //camera.lookAt(new THREE.Vector3(5,0,0));
    scene.add(camera);
  
    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize',
        function ()
        {
            var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        }
    );
 
    // Create a light, set its position, and add it to the scene.
    var alight = new THREE.AmbientLight(0xFFFFFF);
    alight.position.set(-100.0, 200.0, 100.0);
    scene.add(alight);
	

    // Load in the mesh and add it to the scene.
    var sawBlade_texPath = 'assets/sawblade.jpg';
    var sawBlade_objPath = 'assets/sawblade.obj';
    OBJMesh(sawBlade_objPath, sawBlade_texPath, "sawblade");

	var slab_texPath = 'assets/slab.jpg';
    var slab_objPath = 'assets/slab.obj';
    OBJMesh(slab_objPath, slab_texPath, "slab");
    
    var ground_texPath = 'assets/ground_tile.jpg';
    var ground_objPath = 'assets/ground.obj';
    OBJMesh(ground_objPath, ground_texPath, "ground");
    
	var sparkObj = new THREE.Object3D();
	sparkObj.name = "spark";
	
	scene.add( sparkObj );
	
    /* //Stanford Bunny
    var bunny_texPath = 'assets/rocky.jpg';
    var bunny_objPath = 'assets/stanford_bunny.obj';
    OBJMesh(bunny_objPath, bunny_texPath, "bunny");
    */

     //Sphere
    var sphere_texPath = 'assets/rocky.jpg';
    var sphere_objPath = 'assets/sphere.obj';
    OBJMesh(sphere_objPath, sphere_texPath, "sphere");
	

    /* //Cube
    var cube_texPath = 'assets/rocky.jpg';
    var cube_objPath = 'assets/cube.obj';
    OBJMesh(cube_objPath, cube_texPath, "cube");
    */
    
    /* //Cone
    var cone_texPath = 'assets/rocky.jpg';
    var cone_objPath = 'assets/cone.obj';
    OBJMesh(cone_objPath, cone_texPath, "cone");
    */
    
    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.4;
    controls.userPanSpeed = 0.01;
    controls.userZoomSpeed = 0.01;
    controls.userRotateSpeed = 0.01;
    controls.minPolarAngle = -Math.PI/2;
    controls.maxPolarAngle = Math.PI/2;
    controls.minDistance = 0.01;
    controls.maxDistance = 30;


    clock = new THREE.Clock();
    var delta = clock.getDelta();
}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    octree.update();
    postProcess();
    octree.update();
}

function rotate(object, axis, radians)
{
    var rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.applyMatrix(rotObjectMatrix);
}

function translate(object, x, y, z)
{
    var transObjectMatrix = new THREE.Matrix4();
    transObjectMatrix.makeTranslation(x, y, z);
    object.applyMatrix(transObjectMatrix);
}

// 
function generateSparks(){
	var sparkObj = scene.getObjectByName("spark");
	
	//~ if (sparkObj.children.length != 0)
		//~ return;
		
	var spark_geo, material, spark, rand, theta, phi, obj, len;
	len = Math.random()/25 + 0.03;
    spark_geo = new THREE.CylinderGeometry( 0.006, 0.005, len, 4 );
    material = new THREE.MeshBasicMaterial( {color: 0xff4100, transparent: true, opacity: 0.8} );
	spark = new THREE.Mesh( spark_geo, material );
	obj = new THREE.Object3D();
	
	obj.properties = {};
	obj.properties.pos = new THREE.Vector3(-0.3, 1.2, 0.0);
	obj.properties.pos_prev = new THREE.Vector3( 0, 0, 0.0);
	rand = Math.floor(Math.random()*100)/20;
	obj.properties.velocity = 2 + rand;
	phi = (Math.random()-0.5)*Math.PI/3;
	theta = Math.floor(Math.random()*65)*Math.PI/180;
	obj.properties.collisionCount = 0;
	
	obj.properties.v = new THREE.Vector3(-obj.properties.velocity*Math.cos(theta)*Math.cos(phi),
										    obj.properties.velocity*Math.sin(theta)*Math.cos(phi),
										   -obj.properties.velocity*Math.sin(phi));
	phi += Math.PI/2;
	obj.properties.g = 9.8;
	obj.properties.t = 0.0;
	obj.name = "spark";
	obj.add(spark);
	spark_geo = new THREE.CylinderGeometry( 0.008, 0.008, len+0.01, 4 );
    material = new THREE.MeshBasicMaterial( {color: 0xff4500, transparent: true, opacity: 0.25} );
	spark = new THREE.Mesh( spark_geo, material );
	obj.add(spark);
	obj.lookAt(obj.position);
	sparkObj.add(obj);
	
	/*spark.properties = {};
	spark.properties.pos = new THREE.Vector3(-0.3, 1.2, 0.0);
	spark.properties.pos_prev = new THREE.Vector3(0.0, 1.0, 0.0);
	rand = Math.floor(Math.random()*100)/20;
	spark.properties.velocity = 2 + rand;
	phi = Math.random() - 0.5;
	
	spark.properties.collisionCount = 0;
	spark.properties.v = new THREE.Vector3(-spark.properties.velocity*Math.cos(Math.PI/3)*Math.cos(phi),
										    spark.properties.velocity*Math.sin(Math.PI/3)*Math.cos(phi),
										   -spark.properties.velocity*Math.sin(phi));
	
	spark.properties.g = 9.8;
	spark.properties.t = 0.0;
	*/
}
// Compute next position of the the spark particles

function nextPosition(object, dt){
	var p = new THREE.Vector3();
	p.copy(object.properties.pos);

	p.x += object.properties.v.x*dt;
	p.y += object.properties.v.y*dt;
	p.y -= 0.5*object.properties.g*dt*object.properties.t*3;
	object.properties.t += dt;
	p.z += object.properties.v.z*dt;
	
	return p;
}

// Transform object to the defined frame of reference
function applyTransformation(object){

	var rotationMatrix = object.properties.rotmat;
	object.geometry.applyMatrix4(rotationMatrix);
	
}

// Project the 3D point v on to plane defined using normal n 
// and point p on plane  
function projection(n, v, p){
	// (V - P).n
	var K = (v.x - p.x)*n.x + 
			(v.y - p.y)*n.y +
			(v.z - p.z)*n.z;
	
	var vproj = new THREE.Vector3(v.x - K*n.x, v.y - K*n.y, v.z - K*n.z);
	
	return vproj;
}

// Find area of triangle given three vertices of the triangle
function triangleArea(v1, v2, v3){
	// v12 - vector from vector v1 to v2
	// v13 - vector from vector v1 to v3
	var v12 = {}, v13 = {}, area, vcross = {};
	v12.x = v2.x - v1.x;	v13.x = v3.x - v1.x;
	v12.y = v2.y - v1.y;	v13.y = v3.y - v1.y;
	v12.z = v2.z - v1.z;	v13.z = v3.z - v1.z;
	// (v12 x x13) - x: cross product
	vcross.x = v12.y*v13.z - v12.z*v13.y;
	vcross.y = v12.z*v13.x - v12.x*v13.z;
	vcross.z = v12.x*v13.y - v12.y*v13.x;
	
	area = vcross.x*vcross.x +
		   vcross.y*vcross.y +
		   vcross.z*vcross.z;
	
	area = Math.sqrt(area);
	area /= 2;
	
	return area;
}

function barycentricInterpolation(v1, v2, v3, p){
	var areaV3, alpha, beta, gamma;
	areaV3 = triangleArea(v1, v2, v3);
	alpha  = triangleArea(p, v2, v3)/areaV3;
	beta   = triangleArea(p, v3, v1)/areaV3;
	gamma  = triangleArea(p, v1, v2)/areaV3;
	var coor = [ alpha, beta, gamma ];
	
	return coor;
}

function euclidDistance(c, v){
	var dis = 0;
	dis += (c.x - v.x)*(c.x - v.x);
	dis += (c.y - v.y)*(c.y - v.y);
	dis += (c.z - v.z)*(c.z - v.z);
	dis = Math.sqrt(dis);
	return dis;
}

function normdistance(n, v){
	var dis = 0;
	dis = Math.abs(n.x*v.x+n.y*v.y+n.z*v.z+n.w);
	dis /= Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z);
	return dis;
}

function findRoatationMatrix(theta, phi){
	var matrix = new THREE.Matrix4();
	matrix.makeRotationAxis( new THREE.Vector3(0, 1, 0), phi ); 
	matrix.makeRotationAxis( new THREE.Vector3(0, 0, 1), theta ); 
	
	return matrix;
}

/*
function narrowCollisionCheck(object, sparkobj){
	var vs = object.geometry.attributes.position.array,
		ns = object.geometry.attributes.normal.array;
	
	var v = sparkobj.position, dis1, d, p;
	var dn = 9, coordinate;
	var n = new THREE.Vector4(),
	   v1 =	new THREE.Vector4(),
	   v2 = new THREE.Vector4(),
	   v3 = new THREE.Vector4();
			 
	for (var i=0, j=0; i < vs.length; i += 9, j += dn){
		d = vs[i]*ns[j]+vs[i+1]*ns[j+1]+vs[i+2]*ns[j+2];
		n.set(ns[j], ns[j+1], ns[j+2], -d);
		dis1 = normdistance(n, v);
		console.log("distance: "+dis1);
		if (dis1 < 0.03) {
			v1.set(   vs[i], vs[i+1], vs[i+2] );
			v2.set( vs[i+3], vs[i+4], vs[i+5] );
			v3.set( vs[i+6], vs[i+7], vs[i+8] );
			p = projection( n, v, v3 );
			coordinate = barycentricInterpolation( v1, v2, v3, p );

			if ( coordinate[0] + coordinate[1] + coordinate[2] > 1)
				continue;
			
			console.log("Proj: "+p.x+" "+p.y+" "+p.z);
			console.log("bary: "+coordinate.x+" "+coordinate.y+" "+coordinate.z);
			console.log("Normal: "+j+" "+n.x+" "+n.y+" "+n.z+" "+n.w);
			//~ 
			console.log("detected Collision");
			setSparkProperties(sparkobj, n);
			break;
		}			
	}
}
*/

function getReflectedVector(inc, n){
	n.normalize();
	var K = n.x*inc.x + n.y*inc.y + n.z*inc.z;
	
	var reflectedRay = new THREE.Vector3( inc.x - 2*K*n.x,
									      inc.y - 2*K*n.y,
									      inc.z - 2*K*n.z );
	reflectedRay.normalize();
	
	return reflectedRay;
}
// Set Spark properties after collision
function setSparkProperties(sparkObj, n){
	var incident = new THREE.Vector3(), reflected;
	incident.subVectors(sparkObj.position, sparkObj.properties.pos_prev);
	incident.normalize();
	reflected = getReflectedVector( incident, n );
	sparkObj.properties.velocity *= (3.2/4);
	sparkObj.properties.collisionCount += 1;
	sparkObj.properties.t = 0;
	sparkObj.scale.y = 0.5;
	var split = Math.random();	
	if (split < 0.25){
		splitSpark(sparkObj, reflected);
		return;
	}
	
	sparkObj.properties.v.set( sparkObj.properties.velocity*reflected.x,
							   sparkObj.properties.velocity*reflected.y,
							   sparkObj.properties.velocity*reflected.z );
	
	reflected.x = -reflected.x;
	reflected.y = -reflected.y;
	reflected.z = -reflected.z;
	sparkObj.lookAt(reflected);
	sparkObj.updateMatrix();
	
	
}

function collisionIntersections(spark){
	var rayCaster = new THREE.Raycaster();
	var dir = new THREE.Vector3();
	var origin = new THREE.Vector3();
	
	dir.subVectors(spark.position, spark.properties.pos_prev);
	origin.copy(spark.position);
	rayCaster.set(origin, dir.normalize());
	
	var msearch = octree.search(rayCaster.ray.origin, 3, true, rayCaster.ray.direction);
	var intersections = rayCaster.intersectOctreeObjects( msearch );

	if ( msearch.length == 0 || intersections.length == 0 )
		return;
	
	var idx = 0, min = 9999;
	for (var i = 0; i < intersections.length; i++){
		
		if (min > intersections[i].distance){
			idx = i;
			min = intersections[i].distance;
		}
		
	}	
	
	if (intersections[idx].distance < 0.1)
		setSparkProperties(spark, intersections[idx].face.normal);					
	//~ var intersections = rayCaster.intersectObject( obj.children["0"] );
}

function collisionDetection(sparkobj){
	var max, min, obj = [], name;
	
	for (var i = 0; i < scene.children.length; i++) {
		name = scene.children[i].name;
		if (name == "cube"  || name == "ground" ||
			name == "bunny" || name == "sphere" ||
			name == "cone" )
		
		obj.push(scene.children[i]);
	}
	
	if (obj.length < 1)
		return;
	
	/*
	var v = sparkobj.position, buf = 1, count = 0;
	
	for (var i = 0; i < obj.length; i++) {
		max = obj[i].children["0"].geometry.boundingBox.max,
		min = obj[i].children["0"].geometry.boundingBox.min;
		if (v.x <= min.x - buf || v.x >= max.x + buf || 
			v.y <= min.y - buf || v.y >= max.y + buf ||
			v.z <= min.z - buf || v.z >= max.z + buf )
			count += 1;
	}
	*/
	collisionIntersections(sparkobj);
	
}

function postProcess()
{
    var delta = clock.getDelta();
    var asset = scene.getObjectByName( "sawblade" );
    
	if (asset != null) {
		translate(asset, 0,-1.5,0);
		rotate(asset, new THREE.Vector3(0,0,1), -9* delta); //rotate sawblade
		translate(asset, 0,1.5,0);
	}
	var no = Math.floor(Math.random()*6);
	for (var i=0; i< no; i++)
		generateSparks();
	updateSparks(0.4*delta);
}

function updateSparks(delta) {
	var objects = scene.getObjectByName( "spark" );
	var new_pos, count = 0, rot = new THREE.Vector3(), split = 0;
	
	for (var i = 0; i < objects.children.length;) {
		if (objects.children[i].properties.collisionCount == 2){
			objects.remove(objects.children[i]);
			continue;
		}

		new_pos = nextPosition( objects.children[i], delta );
		objects.children[i].properties.pos.copy( new_pos );
		objects.children[i].properties.pos_prev.copy( objects.children[i].position );
		objects.children[i].position.copy( new_pos );
		setRotation( objects.children[i] );
		collisionDetection(objects.children[i]);
		i += 1;
	}
	
}

function splitSpark(sparkObject, reflected){
	var spkobj = new THREE.Object3D(),
		objects = scene.getObjectByName("spark");
	var spark_geo, material, spark, rand, theta, phi, obj, len;
	
	spark = new THREE.Mesh( sparkObject.children[0].geometry, 
							sparkObject.children[0].material );

	spkobj.add(spark);
	spkobj.position.copy(sparkObject.position);
	spkobj.position.x += 0.1;
	spkobj.position.z -= 0.1;
	
	spkobj.properties = {};
	spkobj.properties.velocity = sparkObject.properties.velocity;
	var cons = 1;
	if (spkobj.properties.velocity > 4)
		cons = 1;
	var dir = new THREE.Vector3();
	dir.set(reflected.x *Math.sin(-Math.PI/6), reflected.y*Math.sin(-Math.PI/6), reflected.z*Math.cos(-Math.PI/6));
	dir.normalize();
	
	spkobj.properties.v = new THREE.Vector3( spkobj.properties.velocity*dir.x*cons,
							 spkobj.properties.velocity*dir.y*cons,
							 spkobj.properties.velocity*dir.z*cons);
	
	//~ dir.set(reflected.x + 2, reflected.y, reflected.z - 2);
	dir.set(reflected.x *Math.sin(Math.PI/3), reflected.y*Math.sin(Math.PI/3), reflected.z*Math.cos(Math.PI/3));
	dir.normalize();
			 
	sparkObject.properties.v.set( sparkObject.properties.velocity*dir.x*cons,
							 sparkObject.properties.velocity*dir.y*cons,
							 sparkObject.properties.velocity*dir.z*cons);
	
	spkobj.properties.pos= new THREE.Vector3( sparkObject.properties.pos.x,
							 sparkObject.properties.pos.y,
							 sparkObject.properties.pos.z);
	
	spkobj.properties.pos_prev= new THREE.Vector3( sparkObject.properties.pos_prev.x,
							 sparkObject.properties.pos_prev.y,
							 sparkObject.properties.pos_prev.z);
	
	spkobj.properties.g = sparkObject.properties.g;
	spkobj.properties.t = sparkObject.properties.t;
	
	spkobj.properties.collisionCount = sparkObject.properties.collisionCount;								   
	spark = new THREE.Mesh( sparkObject.children[1].geometry, 
							sparkObject.children[1].material );
	spkobj.add(spark);
	
	spkobj.scale.y = 0.75;
	sparkObject.scale.y = 0.75;
	
	objects.add(spkobj);

	/*spark = new THREE.Mesh( objects.children[idx].children[0].geometry, 
							objects.children[idx].children[0].material.clone );

	spkobj.add(spark);
	spkobj.position.copy(objects.children[idx].position);
	spkobj.position.x += 0.04;
	spkobj.position.z += 0.04;
	
	spkobj.properties = {};
	spkobj.properties.velocity = objects.children[idx].properties.velocity;
	spkobj.properties.v = new THREE.Vector3( objects.children[idx].properties.v.x-0.1,
							 objects.children[idx].properties.v.y,
							 objects.children[idx].properties.v.z-0.1);
	spkobj.properties.pos= new THREE.Vector3( objects.children[idx].properties.pos.x,
							 objects.children[idx].properties.pos.y,
							 objects.children[idx].properties.pos.z);
	spkobj.properties.pos_prev= new THREE.Vector3( objects.children[idx].properties.pos_prev.x,
							 objects.children[idx].properties.pos_prev.y,
							 objects.children[idx].properties.pos_prev.z);
	spkobj.properties.g = objects.children[idx].properties.g;
	spkobj.properties.t = objects.children[idx].properties.t;

	//~ spkobj.properties.v.z -= 0.5;
	//~ spkobj.properties.v.x -= 0.5;
	spkobj.name = "spark";
	console.log("Prop: " + spkobj.properties.v.x);
	console.log("First Particle: " + objects.children[idx].position.x+" "+ objects.children[idx].position.y+" "
								   + objects.children[idx].position.z);
	
	console.log("Second Particle: " + spkobj.position.x+" "+ spkobj.position.y+" "
								   + spkobj.position.z);
								   
	spark = new THREE.Mesh( objects.children[idx].children[1].geometry, 
							objects.children[idx].children[1].material.clone );
	spkobj.add(spark);
	//~ spkobj.lookAt(spkobj.position);
	objects.add(spkobj);
	console.log("Splitting ... size: " + objects.children.length);
	*/
}

function setRotation(spk){
	//~ var alpha, theta, phi;
	//~ phi = ( spk.position.y - spk.properties.pos_prev.y )/( spk.position.x - spk.properties.pos_prev.x );
	var dir = new THREE.Vector3();
	dir.subVectors( spk.position , spk.properties.pos_prev );
	dir.normalize();
	spk.lookAt(dir);
	spk.updateMatrix();
	
}
function OBJMesh(objpath, texpath, objName)
{
    var texture = new THREE.TextureLoader( loadingManager ).load(texpath, onLoad, onProgress, onError);
    var loader  = new THREE.OBJLoader( loadingManager ).load(objpath,  
        function ( object )
        {
            object[0].traverse(
                function ( child )
                {
                    if(child instanceof THREE.Mesh)
                    {
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                    }
    
                }
            );

            object[0].name = objName;
            //~ if(objName=="sawblade")
                //~ translate(object, 0,1.5,0); //move it up to slab
			scene.add( object[0] );
			if ( objName == "cube"  || objName == "ground" ||
				 objName == "bunny" || objName == "sphere" ||
				 objName == "cone" ){
				octree.add( object[1], { useFaces: true });
			}
            onLoad( object[0] );
		},
	onProgress, onError);
}

function onLoad( object )
{
    putText(0, "", 0, 0);
    i_share ++;
    if(i_share >= n_share)
        i_share = 0;
}

function onProgress( xhr )
{ 
    if ( xhr.lengthComputable )
    {
        var percentComplete = 100 * ((xhr.loaded / xhr.total) + i_share) / n_share;
        putText(0, Math.round(percentComplete, 2) + '%', 10, 10);
    }
}

function onError( xhr )
{
    putText(0, "Error", 10, 10);
}


function putText( divid, textStr, x, y )
{
    var text = document.getElementById("avatar_ftxt" + divid);
    text.innerHTML = textStr;
    text.style.left = x + 'px';
    text.style.top  = y + 'px';
}

function putTextExt(dividstr, textStr) //does not need init
{
    var text = document.getElementById(dividstr);
    text.innerHTML = textStr;
}
