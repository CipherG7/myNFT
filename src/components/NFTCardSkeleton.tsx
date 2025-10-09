export function NFTCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '320px',
      }}
    >
      {/* Image Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '192px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      />

      {/* Title Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '70%',
          height: '24px',
          borderRadius: '4px',
          marginBottom: '8px',
        }}
      />

      {/* ID Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '50%',
          height: '16px',
          borderRadius: '4px',
          marginBottom: '4px',
        }}
      />

      {/* Price Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '40%',
          height: '20px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}
      />

      {/* Button Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '48px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}
