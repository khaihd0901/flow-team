import { ChevronRight, UserSearch } from "lucide-react";
import UserAvatar from "../chat/UserAvatar";

export default function SearchResult({
  open,
  loading,
  results,
  keyword,
  onSelect,
}) {
  const { users = [], groupChats = [] } = results || {};

  const hasResults = users.length > 0 || groupChats.length > 0;

  return (
    <div
      className={`
        absolute
        top-full
        mt-2
        w-full
        z-50

        origin-top
        transition-all
        duration-200

        ${
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 -translate-y-2"
        }
      `}
    >
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-background
          shadow-xl
          backdrop-blur
        "
      >
        {/* LOADING */}
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  flex
                  animate-pulse
                  items-center
                  gap-3
                "
              >
                <div className="h-11 w-11 rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-2 w-20 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : hasResults ? (
          <div className="max-h-[400px] overflow-y-auto py-2">
            {/* USERS */}
            {users.length > 0 && (
              <Section title="Users">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() =>
                      onSelect?.({
                        type: "user",
                        data: user,
                      })
                    }
                    className="
                      group
                      relative
                      flex
                      w-full
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      text-left

                      transition-all
                      duration-200
                    "
                  >
                    {/* AVATAR */}
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      alt={user.fullName}
                      className="
                        h-11
                        w-11
                        rounded-full
                        border
                        object-cover

                        transition-transform
                        duration-200
                      "
                    />

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-sm
                          font-medium
                        "
                      >
                        {user.fullName}
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          text-muted-foreground
                        "
                      >
                        @{user.username}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div
                      className="
                        flex
                        items-center
                        gap-1

                        opacity-0
                        translate-x-2

                        transition-all
                        duration-200

                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    >
                      <span
                        className="
                          text-muted-foreground
                        "
                      >
                        <UserSearch className="size-5 font-bold text-primary" />
                      </span>
                    </div>
                  </button>
                ))}
              </Section>
            )}

            {/* GROUP CHATS */}
            {groupChats.length > 0 && (
              <Section title="Group Chats">
                {groupChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() =>
                      onSelect?.({
                        type: "groupChat",
                        data: chat,
                      })
                    }
                    className="
                      group
                      relative
                      flex
                      w-full
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      text-left

                      transition-all
                      duration-200
                    "
                  >
                    {/* GROUP AVATAR */}
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-muted
                        text-sm
                        font-semibold

                        transition-transform
                        duration-200

                      "
                    >
                      {chat.group?.name?.charAt(0)}
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-sm
                          font-medium
                        "
                      >
                        {chat.group?.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        Group Chat
                      </p>
                    </div>

                    {/* ACTION */}
                    <div
                      className="
                        opacity-0
                        translate-x-2

                        transition-all
                        duration-200

                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    >
                      <ChevronRight className="size-5 font-bold text-primary" />
                    </div>
                  </button>
                ))}
              </Section>
            )}
          </div>
        ) : (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              p-8
              text-center
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-foreground
              "
            >
              No results found
            </p>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Try searching for another keyword
            </p>

            <span
              className="
                text-xs
                font-medium
                text-primary
              "
            >
              "{keyword}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="py-1">
      <div
        className="
          px-3
          py-2

          text-[11px]
          font-semibold
          uppercase
          tracking-wider

          text-muted-foreground
        "
      >
        {title}
      </div>

      {children}
    </div>
  );
}
