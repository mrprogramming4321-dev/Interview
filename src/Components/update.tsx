<select
  className="w-full border p-2 mb-3 rounded"
  value={role}
  onChange={(e) =>
    setRole(e.target.value as "admin" | "editor" | "viewer")
  }
>
  <option value="admin">Admin</option>
  <option value="editor">Editor</option>
  <option value="viewer">Viewer</option>
</select>

const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer");