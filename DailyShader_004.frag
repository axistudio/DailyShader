// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st,in float t) {
    float v = 0.0;
    float a = 0.484;
    vec2 shift = vec2(0.530,0.050);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.516), sin(0.5), 
                    -sin(0.756), cos(-0.028));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st+t);
        _st = rot * _st * 2.024 + shift;
        a *= 0.580;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.784;
    // st += st * abs(sin(u_time*0.1)*3.0);
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 uv = st*vec2(u_resolution.x/u_resolution.y,1.0);
    vec3 color = vec3(0.005,0.005,0.005);
     st.x *= u_resolution.x/u_resolution.y;
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time,0.658);
    q.y = fbm( st + vec2(1.0),0.658);

    vec2 r = vec2(-0.060,-0.120);
    r.x = fbm( st + 1.200*q + vec2(0.630,0.540)+ -0.122*u_time ,0.522);
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time,0.658);
    
    
     float t = 2.568;
     t += abs(2.184-noise(uv+u_time*-0.052))*4.824;
    
    float a = 0.0;
    
    mat2 m = mat2( 1.0,  1.0, -1.0,  1.0 );
    a  = 1.204*noise( uv + u_time*0.3); uv = m*uv;
    a += -0.910*noise( uv + u_time*-0.3); uv = m*uv;
	a += 0.1250*noise( uv + u_time*0.3); uv = m*uv;
	a += 0.382*noise( uv + u_time*-0.3); uv = m*uv;
    
    t = a;
    float noiseScale = 0.055;
    //st += noise(st*noiseScale+a*2.233+t);
    
    float f = fbm(st+r,t);
    

    color = mix(vec3(0.045,0.043,0.043),
                vec3(0.900,0.899,0.847),
                clamp((f*f*f)*3.856,0.0,1.0));

//     color = mix(color,
//                 vec3(0,0,0.164706),
//                 clamp(length(q),0.0,1.0));

//     color = mix(color,
//                 vec3(0.666667,1,1),
//                 clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}