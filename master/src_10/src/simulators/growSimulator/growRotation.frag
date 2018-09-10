uniform sampler2D u_prevPositionTexture;
uniform sampler2D u_positionTexture;
uniform sampler2D u_velocityTexture;

uniform sampler2D u_sdfTexture;
uniform float u_sdfScale;
uniform vec3 u_sdfOffset;
uniform float u_sdfVoxelSize;
uniform vec4 u_sdfSliceInfo;

varying vec2 v_uv;

#pragma glslify: sampleAs3DTexture = require(../../../common/glsl/sampleAs3DTexture.glsl)
#pragma glslify: encodeNormal = require(../../../common/glsl/encodeNormal.glsl)

void main () {

  vec3 prevPosition = texture2D(u_prevPositionTexture, v_uv).xyz;
  vec3 currPosition = texture2D(u_positionTexture, v_uv).xyz;
  vec3 currVelocity = texture2D(u_velocityTexture, v_uv).xyz;

  vec3 voxelTextureCoordOri = currPosition / u_sdfScale + u_sdfOffset;
  vec3 voxelTextureCoord = clamp(voxelTextureCoordOri, vec3(0.5 / u_sdfVoxelSize), vec3(1.0 - 0.5 / u_sdfVoxelSize));
  vec4 distanceInfo = sampleAs3DTexture(u_sdfTexture, voxelTextureCoord, u_sdfSliceInfo) * 2.0 - 1.0;
  vec3 normal = normalize(distanceInfo.xyz * sign(distanceInfo.a));

  vec3 tangent = normalize(currVelocity);
  vec3 bitangent = normalize(cross(normal, tangent));
  tangent =  normalize(cross(bitangent, normal));

  gl_FragColor = vec4(
    encodeNormal(normal),
    encodeNormal(tangent)
  );
}
