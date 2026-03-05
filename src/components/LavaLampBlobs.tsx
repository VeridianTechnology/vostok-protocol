type LavaLampBlobsProps = {
  offsetX?: number;
  offsetY?: number;
};

const LavaLampBlobs = ({ offsetX = 0, offsetY = 0 }: LavaLampBlobsProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="lava-lamp-dots"
      style={{
        transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
      }}
    />
  </div>
);

export default LavaLampBlobs;
