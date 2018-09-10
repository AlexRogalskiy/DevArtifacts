#define PHYSICAL

varying vec3 vViewPosition;

attribute vec2 a_positionUv;
uniform sampler2D u_positionInfoTexture;
uniform sampler2D u_rotationTexture;
#pragma glslify: decodeNormal = require(../../../common/glsl/decodeNormal.glsl)

#ifndef FLAT_SHADED

  varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main () {
  vec4 positionInfo = texture2D(u_positionInfoTexture, a_positionUv);
  vec4 rot = texture2D( u_rotationTexture,  a_positionUv);

  vec3 N = decodeNormal(rot.xy);
  vec3 T = decodeNormal(rot.zw);
  vec3 B = cross(N, T);
  mat3 TBN = mat3(T, B, N);

  #include <uv_vertex>
  #include <uv2_vertex>
  #include <color_vertex>

  #include <beginnormal_vertex>

  objectNormal = TBN * objectNormal;

  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

  vNormal = normalize( transformedNormal );

#endif

  //include <begin_vertex>
  vec3 transformed = (TBN * position.xyz) * positionInfo.a + positionInfo.xyz;
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>
}
