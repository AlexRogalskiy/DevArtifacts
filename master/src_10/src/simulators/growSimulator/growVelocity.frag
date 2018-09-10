uniform sampler2D u_velocityTexture;
uniform sampler2D u_positionTexture;
uniform float u_noiseFrequence;
uniform float u_noiseTime;
uniform float u_noiseAmplitude;
// uniform float u_dtRatio;

uniform sampler2D u_sdfTexture;
uniform float u_sdfScale;
uniform vec3 u_sdfOffset;
uniform float u_sdfVoxelSize;
uniform vec4 u_sdfSliceInfo;
uniform float u_sdfOutBoundForce;
uniform float u_sdfInBoundForce;
uniform float u_sdfThreshold;

varying vec2 v_uv;

#pragma glslify: curl4 = require(../../../common/glsl/curl4.glsl)
#pragma glslify: sampleAs3DTexture = require(../../../common/glsl/sampleAs3DTexture.glsl)

void main () {

  vec4 velocityInfo = texture2D(u_velocityTexture, v_uv);
  vec4 positionInfo = texture2D(u_positionTexture, v_uv);

  velocityInfo.xyz *= 0.5;

  velocityInfo.xyz += curl4((positionInfo.xyz + velocityInfo.xyz) * u_noiseFrequence, u_noiseTime, 0.02) * u_noiseAmplitude;

  // sdf force is based on the updated position. Allow error here.
  positionInfo.xyz += velocityInfo.xyz;

  // sample 3d linear interpolated texture
  vec3 voxelTextureCoordOri = positionInfo.xyz / u_sdfScale + u_sdfOffset;
  vec3 voxelTextureCoord = clamp(voxelTextureCoordOri, vec3(0.5 / u_sdfVoxelSize), vec3(1.0 - 0.5 / u_sdfVoxelSize));
  vec4 distanceInfo = sampleAs3DTexture(u_sdfTexture, voxelTextureCoord, u_sdfSliceInfo) * 2.0 - 1.0;

  // estimation for the blocks go off the known sdf range
  vec3 offSDF = step(vec3(0.001), abs(voxelTextureCoordOri - voxelTextureCoord));
  distanceInfo.xyz = normalize(distanceInfo.xyz + positionInfo.xyz * offSDF);
  distanceInfo.a -= u_sdfThreshold;
  distanceInfo.a = sign(distanceInfo.a) * max(abs(distanceInfo.a), length(positionInfo.xyz) * step(0.5, offSDF.x + offSDF.y + offSDF.z));

  // only apply the sdf force
  velocityInfo.xyz += distanceInfo.xyz * distanceInfo.a * -mix(u_sdfOutBoundForce, u_sdfInBoundForce, step(0.0, distanceInfo.a));

  gl_FragColor = velocityInfo;

}
