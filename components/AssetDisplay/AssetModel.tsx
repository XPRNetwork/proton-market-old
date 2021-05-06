import '@google/model-viewer';
import { IPFS_RESOLVER_VIDEO } from '../../utils/constants';

function parseModelIpfs(imageUrl: string) {
  if (!imageUrl) {
    return imageUrl;
  }

  if (imageUrl.substring(0, 2) === 'Qm') {
    imageUrl = `${IPFS_RESOLVER_VIDEO}${imageUrl}`;
  }

  return imageUrl;
}

const AssetModel = ({
  model,
  stage,
  skybox,
  width,
  height,
}: {
  model: string;
  stage: string;
  skybox: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  return (
    <model-viewer
      src={parseModelIpfs(model)}
      ios-src={parseModelIpfs(stage)}
      skybox-image={parseModelIpfs(skybox)}
      auto-rotate
      autoplay
      ar
      ar-modes="scene-viewer webxr quick-look"
      ar-scale="auto"
      camera-controls
      camera-orbit="0deg 90deg 2.5m"
      style={{
        height: height || '100%',
        width: width || '100%',
        borderRadius: 20,
        minHeight: 350,
      }}
    />
  );
};

export default AssetModel;
