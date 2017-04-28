#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(0.700,0.490)),
              dot(st,vec2(0.310,0.290)) );
    return -1.0 + 2.0*fract(sin(st)*43758.625);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.980,0.980,0.980);
    vec2 uv = st*vec2(u_resolution.x/u_resolution.y,1.0);
    float t = 2.568;
    // Uncomment to animate
    //t = abs(1.0-sin(u_time*.01))*5.;
    t += abs(2.0-noise(uv+u_time*0.1))*5.0;
    float movetimescale = u_time*0.1;
    // Comment and uncomment the following lines:
    float noiseScale = 5.327;
    
    float pct = distance(st,vec2(0.5));
	pct = smoothstep(0.276,1.910,pct);
    
	float f = 0.0;
    
    mat2 m = mat2( 1.0,  1.0, -1.0,  1.0 );
    f  = 0.5000*noise( uv + u_time*0.1); uv = m*uv;
    f += 0.2500*noise( uv + u_time*-0.1); uv = m*uv;
	f += 0.1250*noise( uv + u_time*0.1); uv = m*uv;
	f += 0.0625*noise( uv + u_time*0.276); uv = m*uv;
    
    
    
    st += noise(st+noiseScale+f*5.537+t); // Animate the coordinate space
    color = vec3(1.000,0.986,0.996) * smoothstep(-0.028,0.232,noise(st)); // Big black drops
    //color += smoothstep(.15,.2,noise(st*10.)); // Black splatter
    //color -= smoothstep(.35,.4,noise(st*10.)); // Holes on splatter
    
    vec3 circleShape = vec3(1.0-pct);
    vec3 noiseCavas =1.0-color;
    vec3 finalcanvas = mix(circleShape,noiseCavas,1.0-pct) ;
    
    gl_FragColor = vec4(finalcanvas,1.0);
}