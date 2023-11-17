uniform sampler2D tTexture;

varying vec2 vUv;

void main()
{
    vec4 colorImage = texture2D(tTexture, vUv);

    gl_FragColor = vec4(colorImage.rgb, 1.0);
}