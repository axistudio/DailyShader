// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

float circularInOut(float t) {
  return t < 0.5
    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

float quarticInOut(float t) {
  return t < 0.5
    ? +8.0 * pow(t, 4.0)
    : -8.0 * pow(t - 1.0, 4.0) + 1.0;
}


float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    st.x *= u_resolution.x/u_resolution.y;

    
    
    float toCenterX = u_resolution.x/u_resolution.y;
    float toCenterY = u_resolution.y/u_resolution.x;
    
    float t = u_time*1.012;
    float movetime = (t);
    
    
    vec2 translate = vec2(cos(movetime),sin(movetime+5.056))*0.086;
    
    
    vec2 addmove1 = vec2(0.2*cos(movetime*0.2),0.3*cos(movetime*0.052));
    vec2 addmove2 = vec2(0.120*sin(movetime*0.464),0.132*sin(movetime*0.196));
    
    translate = vec2(0.50,0.50) + translate;
    //st += tranlsate*0.35;
    
    vec2 toCenter1 = vec2(translate.x*toCenterX,translate.y)-st;
    
    
    vec2 translate2 = vec2(sin(movetime+25.344),cos(movetime))*0.086;
    
    translate2 = vec2(0.50,0.50)+translate2  ;
    
    
    vec2 toCenter2 = vec2(translate2.x*toCenterX,translate2.y)-st;
    
    
    
    vec2 toCenter3 = vec2(translate2.x*toCenterX,translate2.y)-st;
    
    
     //vec2 toCenter2 = vec2(toCenterX*0.5-st.x,0.5-st.y);
    
    float pct = pow(length(toCenter1)*0.792,(length(toCenter2))*3.828);
    
    
    //pct = pow((length(toCenter2))*1.228,pct*0.808);
    
    //pct = length(toCenter1);
    
    
    
    
    
    
    
    vec3 color = vec3(pct);
    //color = vec3(st.x,st.y,movetime);

    gl_FragColor = vec4(color,1.0);
}