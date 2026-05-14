import { useEffect, useRef, useState } from "react";
import UserProfileDialog from "../UserProfileDialog";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { useUserStore } from "@/stores/userStore";

export default function UserSearch() {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const containerRef = useRef(null);

  const { loading, searchResults, userPowerSearch, clearSearch } =
    useUserStore();
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = keyword.trim();

      if (!trimmed) {
        clearSearch();
        return;
      }

      userPowerSearch(trimmed);
    }, 400);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <SearchInput
        value={keyword}
        loading={loading}
        onChange={(value) => {
          setKeyword(value);
          setOpen(true);
        }}
        onFocus={() => {
          if (keyword.trim()) {
            setOpen(true);
          }
        }}
        onClear={() => {
          setKeyword("");
          clearSearch();
          setOpen(false);
        }}
      />

      <SearchResult
        open={open && !!keyword.trim()}
        loading={loading}
        results={searchResults}
        keyword={keyword}
        onSelect={(item) => {
          if (item.type === "user") {
            setSelectedUser(item.data);
            setKeyword("")
          }

          setOpen(false);
        }}
      />
      <UserProfileDialog
        open={!!selectedUser}
        user={selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      />
    </div>
  );
}
