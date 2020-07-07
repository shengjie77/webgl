
export const rectVert = `
attribute vec2 a_Position;

uniform mat3 u_projection;

void main() {
	vec3 pos = u_projection * vec3(a_Position, 1);
	gl_Position = vec4(pos.xy, 0, 1);
}
`
