// KanbanTasksBoardStatic.jsx (polished UI)
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/UserContext";

const API_BASE = import.meta?.env?.VITE_API_URL ?? process.env.API_URL ?? "";
const STORAGE_PREFIX = "kanban_static_v1";
const STORAGE_LAST = "kanban_static_last_project";

const defaultColumns = [
  { id: "col_backlog", name: "Backlog" },
  { id: "col_inprogress", name: "In Progress" },
  { id: "col_review", name: "Review" },
  { id: "col_done", name: "Done" },
];

const safeRead = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const midpointKey = (a, b) => {
  if (!a && !b) return "m";
  if (!a) return "a";
  if (!b) return a.orderKey + "m";
  let i = 0;
  while (
    i < a.orderKey.length &&
    i < b.orderKey.length &&
    a.orderKey[i] === b.orderKey[i]
  )
    i++;
  const prefix = a.orderKey.slice(0, i);
  const aCode = a.orderKey.charCodeAt(i) || 97;
  const bCode = b.orderKey.charCodeAt(i) || 122;
  if (bCode - aCode > 1) {
    const mid = String.fromCharCode(Math.floor((aCode + bCode) / 2));
    return prefix + mid;
  }
  return a.orderKey + "m";
};

export default function KanbanTasksBoardStatic() {
  const { currentUser } = useContext(UserContext);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState(defaultColumns);
  const [tasks, setTasks] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);
  const [dragOverCol, setDragOverCol] = useState("");
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [error, setError] = useState("");

  const hydratedRef = useRef(false);

  // Restore last selected project on mount
  useEffect(() => {
    const last = localStorage.getItem(STORAGE_LAST);
    if (last) setSelectedProjectId(last);
  }, []);

  // Fetch projects for selector
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!currentUser?.id) return;
      setLoadingProjects(true);
      try {
        const res = await axios.get(
          `${API_BASE}/projects/user/${currentUser.id}`
        );
        if (!cancelled) setProjects(res.data?.userProjects ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]); // uses existing route shape

  useEffect(() => {
    let cancelled = false;
    const loadProject = async () => {
      if (!selectedProjectId) return;
      hydratedRef.current = false; // block persist until we hydrate
      setLoadingProject(true);
      try {
        localStorage.setItem(STORAGE_LAST, selectedProjectId);

        // Fetch project details (owner + collaborators) to build assignee list
        const res = await axios.get(
          `${API_BASE}/projects/${selectedProjectId}`
        );
        if (cancelled) return;
        setProject(res.data ?? null);

        // Read per-project local board
        const storageKey = `${STORAGE_PREFIX}:${selectedProjectId}`;
        const parsed = safeRead(storageKey);
        if (parsed?.columns && parsed?.tasks) {
          setColumns(parsed.columns);
          setTasks(parsed.tasks);
        } else {
          setColumns(defaultColumns);
          setTasks([]);
        }

        hydratedRef.current = true; // now allow persistence
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load project");
      } finally {
        if (!cancelled) setLoadingProject(false);
      }
    };
    loadProject();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  // Persist only after hydration; debounce with microtask to avoid double-writes
  useEffect(() => {
    if (!selectedProjectId || !hydratedRef.current) return;
    const storageKey = `${STORAGE_PREFIX}:${selectedProjectId}`;
    queueMicrotask(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ columns, tasks }));
      } catch {
        // ignore quota / serialization errors for MVP
      }
    });
  }, [selectedProjectId, columns, tasks]);

  const people = useMemo(() => {
    if (!project) return [];
    const all = [
      project.owner && {
        id: project.owner.id,
        label:
          `${project.owner.firstName ?? ""} ${
            project.owner.lastName ?? ""
          }`.trim() || project.owner.email,
      },
      ...(Array.isArray(project.collaborators)
        ? project.collaborators.map((u) => ({
            id: u.id,
            label: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email,
          }))
        : []),
    ].filter(Boolean);
    const uniq = [];
    const seen = new Set();
    for (const p of all) {
      if (!seen.has(p.id)) {
        uniq.push(p);
        seen.add(p.id);
      }
    }
    return uniq;
  }, [project]); // collaborators used for assignee dropdown

  const tasksByColumn = useMemo(() => {
    const map = new Map(columns.map((c) => [c.id, []]));
    const q = search.trim().toLowerCase();
    for (const t of tasks) {
      const matches =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q);
      const mine =
        !onlyMine || (t.assigneeId && t.assigneeId === currentUser?.id);
      if (matches && mine) {
        if (!map.has(t.columnId)) map.set(t.columnId, []);
        map.get(t.columnId).push(t);
      }
    }
    for (const arr of map.values())
      arr.sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    return map;
  }, [columns, tasks, search, onlyMine, currentUser]); // adds search + my tasks filter

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverCol(columnId);
  };
  const onDragLeave = (columnId) => {
    if (dragOverCol === columnId) setDragOverCol("");
  };
  const onDrop = (e, destColumnId) => {
    e.preventDefault();
    setDragOverCol("");
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    const dest = tasksByColumn.get(destColumnId) ?? [];
    const last = dest[dest.length - 1] ?? null;
    const newKey = midpointKey(last, null);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, columnId: destColumnId, orderKey: newKey } : t
      )
    );
  };

  const createTask = (columnId) => {
    const dest = tasksByColumn.get(columnId) ?? [];
    const last = dest[dest.length - 1] ?? null;
    const newKey = midpointKey(last, null);
    const id = "t" + Math.random().toString(36).slice(2, 8);
    setTasks((prev) => [
      ...prev,
      {
        id,
        title: "New task",
        description: "",
        columnId,
        orderKey: newKey,
        assigneeId: "",
      },
    ]);
  };
  const updateTask = (taskId, patch) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  const deleteTask = (taskId) =>
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const chip = (n) => (
    <span className="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
      {n}
    </span>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto px-3 py-3 flex items-center gap-3">
          <h2 className="text-lg sm:text-md font-semibold">Tasks</h2>
          <select
            className="border rounded px-2 py-1"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">
              {projects.length ? "Select a project" : "Loading..."}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name ?? p.project_name ?? p.id}
              </option>
            ))}
          </select>
          <input
            className="ml-auto border rounded px-2 py-1 w-[50%]"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
            />
            My tasks
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 px-3 py-2">{error}</p>}

      {!selectedProjectId ? (
        <div className="p-4 text-gray-600">
          Choose a project to view its board.
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-3 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => {
              const items = tasksByColumn.get(col.id) ?? [];
              const active = dragOverCol === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => onDragOver(e, col.id)}
                  onDragLeave={() => onDragLeave(col.id)}
                  onDrop={(e) => onDrop(e, col.id)}
                  className={`
            rounded-xl border bg-gradient-to-b from-white to-gray-50 transition
            ${active ? "ring-2 ring-blue-400" : "ring-0"}
            flex flex-col min-h-[360px]
          `}
                >
                  {/* Column header (sticky within column) */}
                  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur rounded-t-xl border-b p-3 flex items-center justify-between">
                    <div className="font-medium">
                      {col.name}
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                        {items.length}
                      </span>
                    </div>
                    <button
                      className="text-xs rounded bg-blue-600 text-white px-2 py-1 hover:bg-blue-700"
                      onClick={() => createTask(col.id)}
                    >
                      + Task
                    </button>
                  </div>

                  {/* Column body (independent vertical scroll) */}
                  <div className="p-3 flex-1 flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {items.map((task) => {
                      const assignee = people.find(
                        (p) => p.id === task.assigneeId
                      );
                      const initials = assignee?.label
                        ?.split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={task.id}
                          className="rounded-lg bg-white border shadow-sm hover:shadow-md transition cursor-grab"
                          draggable
                          onDragStart={(e) => onDragStart(e, task.id)}
                        >
                          <div className="flex items-start gap-2 p-2">
                            <div className="mt-1 text-gray-400 select-none">
                              ⋮⋮
                            </div>
                            <div className="flex-1">
                              <input
                                className="font-medium w-full border-b border-transparent focus:border-blue-300 outline-none"
                                value={task.title}
                                onChange={(e) =>
                                  updateTask(task.id, { title: e.target.value })
                                }
                                placeholder="Task title"
                              />
                              <textarea
                                className="mt-1 w-full text-sm border border-transparent focus:border-blue-300 rounded p-1 outline-none"
                                value={task.description ?? ""}
                                onChange={(e) =>
                                  updateTask(task.id, {
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Description"
                                rows={2}
                              />
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    Assignee
                                  </span>
                                  <select
                                    className="text-xs border rounded px-1 py-0.5"
                                    value={task.assigneeId ?? ""}
                                    onChange={(e) =>
                                      updateTask(task.id, {
                                        assigneeId: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Unassigned</option>
                                    {people.map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {assignee && (
                                  <div className="ml-auto inline-flex items-center gap-1">
                                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white grid place-content-center text-[10px]">
                                      {initials}
                                    </div>
                                    <span className="text-xs text-gray-700">
                                      {assignee.label}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              className="text-gray-400 hover:text-red-600"
                              title="Delete task"
                              onClick={() => deleteTask(task.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {items.length === 0 && (
                      <div className="text-sm text-gray-500 p-3 border rounded bg-white/60">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
