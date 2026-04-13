type AvatarDisplayProps = {
  displayName?: string;
  avatarUrl?: string | null;
  size?: number;
};

export default function AvatarDisplay({
  displayName = "User",
  avatarUrl,
  size = 80,
}: AvatarDisplayProps) {
  const firstLetter = displayName.charAt(0).toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="rounded-full bg-teal-600 text-white flex items-center justify-center font-bold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {firstLetter}
    </div>
  );
}