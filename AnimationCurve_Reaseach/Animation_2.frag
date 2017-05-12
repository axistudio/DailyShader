// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) + 
            box(_st, vec2(_size/4.,_size));
}
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}
float AnimationCurve(float timeFrame){
   return smoothstep(0.048,0.860,abs(sin(timeFrame))) - smoothstep(0.884,0.992,abs(sin(timeFrame)));  
}

float impulse( float k, float x ){
    float h = k*fract(x);
    return h*exp(1.0-h);
}


///bounce Like Curve
float expStep( float x, float k, float n ){
    return exp( -k*pow(fract(x)+-0.520,n) );
}
void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    //float y = AnimationCurve(u_time*0.8);
    
    //float y = impulse(12.0,u_time*0.5);
     float y = expStep(u_time*0.5,10.0,1.176);
    
    float pct = plot(vec2(st.x,st.y),y);
    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( y*-PI ) * st;
    // move it back to the original place
    st += vec2(0.5);

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.544));
	
    color += pct*vec3(1.0,1.0,1.0);
    
    gl_FragColor = vec4(color,1.0);
}