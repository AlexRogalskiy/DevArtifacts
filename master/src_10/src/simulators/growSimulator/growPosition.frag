uniform sampler2D u_velocityTexture;
uniform sampler2D u_positionTexture;

varying vec2 v_uv;

void main () {

  vec4 velocityInfo = texture2D(u_velocityTexture, v_uv);
  vec4 positionInfo = texture2D(u_positionTexture, v_uv);

  positionInfo.xyz += velocityInfo.xyz;

  gl_FragColor = positionInfo;

}
