
export const pointVert = `
attribute vec2 a_Position;

uniform float u_PointSize;

void main() {

	mat3 mirrorMatrix = mat3(
		1.0, 0.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, 0.0, 1.0
	);

	mat3 translateMatrix = mat3(
		1.0, 0.0, -1.0,
		0.0, 1.0, 1.0,
		0.0, 0.0, 1.0
	);

	vec3 pos = vec3(a_Position, 1) * mirrorMatrix * translateMatrix;
	gl_Position = vec4(pos.xy, 0, 1);

	gl_PointSize = u_PointSize;
}
`
