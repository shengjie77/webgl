
export const rectVert = `
attribute vec2 a_Position;

uniform mat3 u_projection;

void main() {
	// mat3 mirrorMatrix = mat3(
	// 	1.0, 0.0, 0.0,
	// 	0.0, -1.0, 0.0,
	// 	0.0, 0.0, 1.0
	// );

	// mat3 translateMatrix = mat3(
	// 	1.0, 0.0, -1.0,
	// 	0.0, 1.0, 1.0,
	// 	0.0, 0.0, 1.0
	// );

	vec3 pos = vec3(a_Position, 1) * u_projection;
	gl_Position = vec4(pos.xy, 0, 1);
}
`
