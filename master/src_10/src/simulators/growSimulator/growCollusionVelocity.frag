uniform sampler2D u_velocityTexture;
uniform sampler2D u_positionTexture;
uniform sampler2D u_collusionTexture;

uniform vec2 u_textureResolution;

uniform float u_collusionForce;

uniform float u_sdfScale;
uniform vec3 u_sdfOffset;
uniform float u_collusionVoxelSize;
uniform vec2 u_collusionTextureResolution;
uniform vec4 u_collusionSliceInfo;

varying vec2 v_uv;

void main () {
  vec2 texel = floor(v_uv * u_textureResolution);
  float selfIndex = texel.x + u_textureResolution.x * texel.y;
  vec4 velocityInfo = texture2D(u_velocityTexture, v_uv);
  vec4 positionInfo = texture2D(u_positionTexture, v_uv);

  vec3 collusionVoxelPosition = (positionInfo.xyz / u_sdfScale + u_sdfOffset) * u_collusionVoxelSize;
  collusionVoxelPosition = clamp(collusionVoxelPosition, vec3(0.5), vec3(u_collusionVoxelSize - 0.5));

  vec2 uv = vec2(
    collusionVoxelPosition.x + floor(mod(collusionVoxelPosition.z + 0.5, u_collusionSliceInfo.y)) * u_collusionVoxelSize,
    collusionVoxelPosition.y + floor((collusionVoxelPosition.z + 0.5) / u_collusionSliceInfo.y) * u_collusionVoxelSize
  ) / u_collusionTextureResolution;

  vec4 collusionIndices = texture2D(u_collusionTexture, uv);

  positionInfo.xyz += velocityInfo.xyz;

  float indices[4];
  indices[0] = collusionIndices.x;
  indices[1] = collusionIndices.y;
  indices[2] = collusionIndices.z;
  indices[3] = collusionIndices.w;

  for (int i = 0; i < 4; i++) {
    float index = indices[i];
    if( index < 0.5) break;
    float multiplier = step(0.5, abs(index - selfIndex));

    vec2 targetUv = vec2(
      mod(index, u_textureResolution.x),
      floor(index / u_textureResolution.x)
    ) / u_textureResolution;
    vec4 targetVelocityInfo =  texture2D(u_velocityTexture, targetUv);
    vec4 targetPositionInfo =  texture2D(u_positionTexture, targetUv);

    // get the mtd
    vec3 delta = positionInfo.xyz - targetPositionInfo.xyz;
    float d = length(delta);
    // minimum translation distance to push balls apart after intersecting
    vec3 mtd = delta * (((positionInfo.w + targetPositionInfo.w)-d)/d);
    mtd += normalize(vec3(v_uv, positionInfo.z)) * 0.001 * step(0.0001, d); // prevent zero vector

    // resolve intersection --
    // inverse mass quantities
    float im1 = 1.0 / positionInfo.w; // use pscale for now
    float im2 = 1.0 / targetPositionInfo.w;

    // push-pull them apart based off their mass
    // positionInfo.xyz += mtd * (im1 / (im1 + im2));

    // impact speed
    vec3 v = velocityInfo.xyz - targetVelocityInfo.xyz;
    float vn = dot(v, normalize(mtd));

    // sphere intersecting but moving away from each other already
    // if (vn > 0.0f) return;
    multiplier *= step(0.0, vn);

    // collision impulse
    float restitution = 0.5;
    float ii = (-(1.0 + restitution) * vn) / (im1 + im2);
    vec3 impulse = mtd * ii;

    // change in momentum
    velocityInfo.xyz += impulse * im1 * 0.5 * multiplier * u_collusionForce;
  }

  gl_FragColor = velocityInfo;

}
