// FriendRequestNoti.jsx
const FriendRequestNoti = ({
  notification,
  onAccept,
  onReject,
}) => {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAccept(notification._id);
        }}
        className="
          rounded-xl
          bg-primary
          px-3
          py-1.5
          text-xs
          font-medium
          text-primary-foreground
          transition-opacity
          hover:opacity-90
        "
      >
        Accept
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onReject(notification._id);
        }}
        className="
          rounded-xl
          border
          px-3
          py-1.5
          text-xs
          font-medium
          transition-colors
          hover:bg-muted
        "
      >
        Decline
      </button>
    </div>
  );
};

export default FriendRequestNoti;