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

//custom build range curve
float AnimationCurve(float timeFrame){
   return smoothstep(0.048,0.860,abs(sin(timeFrame))) - smoothstep(0.884,0.992,abs(sin(timeFrame)));  
}

//impulse
float impulse( float k, float x ){
    float h = k*fract(x);
    return h*exp(1.0-h);
}

///bounce Like Curve
float expStep( float x, float k, float n ){
    return exp( -k*pow(fract(x)+-0.520,n) );
}

//Quick@start&end Slow@Mid
float parabola( float x, float k ){
    return pow( 4.0*fract(x)*(1.0-fract(x)), k );
}

// a/b tweak up/down curve range.
float pcurve( float x, float a, float b ){
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( fract(x), a ) * pow( 1.0-fract(x), b );
}

void main(){
    
    //instialite the shape array
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 st02 = gl_FragCoord.xy/u_resolution.xy;
    vec2 st03 = gl_FragCoord.xy/u_resolution.xy;
    vec2 st04 = gl_FragCoord.xy/u_resolution.xy;
    
    vec4 color = vec4(0.0);
    
    //float y = AnimationCurve(u_time*0.8);
   
   
    float ParaAnimCurve = parabola(u_time*0.3,2.216);
    float PcurveAnimCurve = pcurve(u_time*0.3,2.0,1.0);
    float ExpStepAnimCurve = expStep(u_time*0.3,9.424,0.912);
    float ImpulseAnimCurve = impulse(7.728,u_time*0.3);
    
    float pct = plot(vec2(st.x,st.y),PcurveAnimCurve);
    
    // move space from the center to the vec2(0.0)
    st -= vec2(0.250,0.250);
    st02 -= vec2(0.250,0.750);
    st03 -= vec2(0.750,0.250);
    st04 -= vec2(0.750,0.750);
    
    // rotate the space
    st = rotate2d( ParaAnimCurve*PI ) * st;
    st02 = rotate2d( PcurveAnimCurve*-PI ) * st02;
    st03 = rotate2d(ExpStepAnimCurve*-PI)*st03;
    st04 = rotate2d(ImpulseAnimCurve*-PI)*st04;
    // move it back to the original place
    st += vec2(0.5);
    st02 += vec2(0.5);
    st03 += vec2(0.5);
    st04 += vec2(0.5);
    
    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec4(vec3(cross(st,0.35)),0.25);
    color += vec4(vec3(cross(st02,0.35)),0.4);
    color += vec4(vec3(cross(st03,0.35)),0.8);
	color += vec4(vec3(cross(st04,0.35)),0.6);
    //color += pct*vec3(1.0,1.0,1.0);
    
    gl_FragColor = vec4(color);
}