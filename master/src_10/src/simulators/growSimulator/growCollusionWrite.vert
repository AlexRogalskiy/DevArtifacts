attribute vec3 position;

uniform sampler2D u_positionTexture;

uniform float u_blockCount;
uniform float u_sdfScale;
uniform vec3 u_sdfOffset;
uniform float u_collusionVoxelSize;
uniform vec2 u_collusionTextureResolution;
uniform vec4 u_collusionSliceInfo;

varying float v_index;

void main() {
  vec4 positionInfo = texture2D(u_positionTexture, position.xy);

  vec3 collusionVoxelPosition = (positionInfo.xyz / u_sdfScale + u_sdfOffset) * u_collusionVoxelSize;
  collusionVoxelPosition = clamp(collusionVoxelPosition, vec3(0.5), vec3(u_collusionVoxelSize - 0.5));

  vec2 uv = vec2(
    collusionVoxelPosition.x + floor(mod(collusionVoxelPosition.z + 0.5, u_collusionSliceInfo.y)) * u_collusionVoxelSize,
    collusionVoxelPosition.y + floor((collusionVoxelPosition.z + 0.5) / u_collusionSliceInfo.y) * u_collusionVoxelSize
  ) / u_collusionTextureResolution;

  vec2 pos2 = uv * 2.0 - 1.0;
  v_index = position.z;

  gl_Position = vec4( pos2, position.z / u_blockCount, 1.0 );
  gl_PointSize = 1.0;
}
