const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
// const config = {
//     resolver: {
//         sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
//         assetExts: ['glb', 'gltf', 'mtl', 'obj', 'png', 'jpg'],
//     },
// };
//
// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    // transformer: {
    //     babelTransformerPath: require.resolve("react-native-svg-transformer")
    // },
    resolver: {
        assetExts: [...assetExts.filter((ext) => ext !== "svg"), "glb", "gltf", "mtl", "obj"],
        sourceExts: [...sourceExts, "svg"]
    }
};

module.exports = mergeConfig(defaultConfig, config);
