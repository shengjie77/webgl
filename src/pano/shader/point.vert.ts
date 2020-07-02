
export const pointVert = `
attribute vec2 a_Position;

uniform float u_PointSize;

void main() {
	gl_Position = vec4(a_Position, 0, 1);
	gl_PointSize = u_PointSize;
}
`
