// KanbanTasksBoardStatic.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/UserContext";

const API_BASE = import.meta?.env?.VITE_API_URL ?? process.env.API_URL ?? "";
const STORAGE_PREFIX = "kanban_static_v1";

const defaultColumns = [
  { id: "col_backlog", name: "Backlog" },
  { id: "col_inprogress", name: "In Progress" },
  { id: "col_review", name: "Review" },
  { id: "col_done", name: "Done" },
];

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
  const aCode = a.orderKey.charCodeAt(i) || 97; // 'a'
  const bCode = b.orderKey.charCodeAt(i) || 122; // 'z'
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
  const [project, setProject] = useState(null); // owner, collaborators, etc.
  const [columns, setColumns] = useState(defaultColumns);
  const [tasks, setTasks] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);
  const [error, setError] = useState("");

  // Load projects the user owns or collaborates on
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!currentUser?.id) return;
      setLoadingProjects(true);
      try {
        const res = await axios.get(
          `${API_BASE}/projects/user/${currentUser.id}`
        );
        if (cancelled) return;
        setProjects(res.data?.userProjects ?? []);
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
  }, [currentUser]);

  // Load project details to show collaborators and seed local tasks per project
  useEffect(() => {
    let cancelled = false;
    const loadProject = async () => {
      if (!selectedProjectId) return;
      setLoadingProject(true);
      try {
        const res = await axios.get(
          `${API_BASE}/projects/${selectedProjectId}`
        );
        if (cancelled) return;
        const p = res.data;
        setProject(p);

        // Load or seed per-project static board
        const storageKey = `${STORAGE_PREFIX}:${selectedProjectId}`;
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.columns && parsed?.tasks) {
            setColumns(parsed.columns);
            setTasks(parsed.tasks);
          } else {
            setColumns(defaultColumns);
            setTasks([]);
          }
        } else {
          setColumns(defaultColumns);
          setTasks([]);
        }
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

  // Persist tasks per project
  useEffect(() => {
    if (!selectedProjectId) return;
    const storageKey = `${STORAGE_PREFIX}:${selectedProjectId}`;
    localStorage.setItem(storageKey, JSON.stringify({ columns, tasks }));
  }, [selectedProjectId, columns, tasks]);

  const tasksByColumn = useMemo(() => {
    const map = new Map(columns.map((c) => [c.id, []]));
    for (const t of tasks) {
      if (!map.has(t.columnId)) map.set(t.columnId, []);
      map.get(t.columnId).push(t);
    }
    for (const arr of map.values())
      arr.sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    return map;
  }, [columns, tasks]);

  const onDragStart = (e, taskId) =>
    e.dataTransfer.setData("text/plain", taskId);
  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, destColumnId) => {
    e.preventDefault();
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

  const updateTask = (taskId, patch) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const collaboratorOptions = useMemo(() => {
    if (!project) return [];
    const ownerOpt = project.owner
      ? [
          {
            id: project.owner.id,
            label:
              `${project.owner.firstName ?? ""} ${
                project.owner.lastName ?? ""
              }`.trim() || project.owner.email,
          },
        ]
      : [];
    const collabOpts = Array.isArray(project.collaborators)
      ? project.collaborators.map((u) => ({
          id: u.id,
          label: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email,
        }))
      : [];
    // De-duplicate in case owner is also in collaborators
    const seen = new Set();
    const all = [...ownerOpt, ...collabOpts].filter((o) => {
      if (seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
    return all;
  }, [project]);

  return (
    <div className="kanban-static">
      <header className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Project Tasks (Static)</h2>
        <div className="ml-auto flex gap-2">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={loadingProjects}
          >
            <option value="">
              {loadingProjects ? "Loading projects..." : "Select a project"}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name ?? p.project_name ?? p.id}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && <p className="text-red-600">{error}</p>}

      {!selectedProjectId ? (
        <p>Select a project to view its board.</p>
      ) : loadingProject ? (
        <p>Loading project…</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasksByColumn.get(col.id) ?? [];
            return (
              <div
                key={col.id}
                className="rounded border p-2 min-h-[300px] bg-gray-50"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{col.name}</div>
                  <button onClick={() => createTask(col.id)}>+ Task</button>
                </div>

                <div className="flex flex-col gap-2">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded bg-white border p-2 shadow-sm"
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <input
                          className="font-medium w-full border-b outline-none"
                          value={task.title}
                          onChange={(e) =>
                            updateTask(task.id, { title: e.target.value })
                          }
                          placeholder="Task title"
                        />
                        <button
                          className="text-red-600"
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                        >
                          ✕
                        </button>
                      </div>

                      <textarea
                        className="mt-1 w-full text-sm border rounded p-1"
                        value={task.description ?? ""}
                        onChange={(e) =>
                          updateTask(task.id, { description: e.target.value })
                        }
                        placeholder="Description"
                      />

                      <div className="mt-2 flex items-center gap-2">
                        <label className="text-sm opacity-70">Assignee</label>
                        <select
                          className="text-sm"
                          value={task.assigneeId ?? ""}
                          onChange={(e) =>
                            updateTask(task.id, { assigneeId: e.target.value })
                          }
                        >
                          <option value="">Unassigned</option>
                          {collaboratorOptions.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-sm opacity-60">No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
