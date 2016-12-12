# fx_challenge_hackathon

## Introduction

This project was developed to participate in the DreamWorks Animation challenge which was hosted on HackerEarth from 30th Sept 2016 to 7th Oct 2016.

## Running the Project

1. Download the project locally. Host a local http service.
Ex: python -m SimpleHTTPServer 8000

2. You can run the project on any browser. 
link: http://localhost:8000/index.html

## Various Levels of Complexities:

L0: Basic natural motion of sparks (projectile motion, air and ground friction)  
L1: Collision with ground plane  
L2: Sparks should split randomly post collision to give variation  
L3: Collision with a minimum of one of the given primitive shapes  
L4: Collision with the ‘Stanford Bunny’  

**Video submission:** 
https://www.youtube.com/watch?v=-d0S3lpsk-4

## Challenges Faced

1. It was my first time working with webgl.
2. Learning Javascript and THREE.js.
3. My system used to hang due to the number of computations. This was resolved by using a octree.js library with THREE.js.
4. Raycasting was used to determine collisions between sparks and the objects in the scene.

## Possible Improvements

Work with different primitives to get a more realistic rendering of sparks. Experimenting with sprites, lens flares etc in order to achieve realism.
