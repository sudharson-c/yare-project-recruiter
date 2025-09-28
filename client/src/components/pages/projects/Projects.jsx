// Projects.jsx (cached recommendations; AI call unchanged)

// eslint-disable-next-line no-unused-vars
import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import Loading from "../../sub/Loading";
import ProjectCard from "./ProjectCard";
import { recommendProjectsGemini } from "../../../lib/geminiProjectAssist";

const API_BASE = import.meta?.env?.VITE_API_URL ?? process.env.API_URL ?? "";

// ---------- cache helpers ----------
const TTL_MS = 30 * 60 * 1000; // 30 minutes

const safeRead = (k) => {
  try {
    const r = localStorage.getItem(k);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};
const safeWrite = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Simple stable hash for projects payload
const hashProjects = (arr) => {
  const s = JSON.stringify(arr.map((p) => [p.id, p.name, p.desc]));
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
};

const Projects = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [suggesting, setSuggesting] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const [suggestError, setSuggestError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]); // [attached_file:224]

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/projects`)
      .then((response) => {
        if (!cancelled) setProjects(response.data.projectData ?? []);
      })
      .catch((e) => {
        if (!cancelled) console.error("Error fetching projects:", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []); // [attached_file:224]

  const userRole = useMemo(
    () => currentUser?.publicMetadata?.role || currentUser?.role || "student",
    [currentUser]
  ); // [attached_file:224]

  const minimalProjects = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        name: p.name ?? p.project_name ?? "",
        desc: p.description ?? p.project_desc ?? "",
      })),
    [projects]
  ); // [attached_file:224]

  const fingerprint = useMemo(
    () => hashProjects(minimalProjects),
    [minimalProjects]
  ); // [attached_file:224]
  const cacheKey = useMemo(
    () =>
      currentUser ? `recs:${currentUser.id}:${userRole}:${fingerprint}` : "",
    [currentUser, userRole, fingerprint]
  ); // [attached_file:224]

  // Prevent duplicate requests for the same cacheKey while mounted
  const lastRunRef = useRef(""); // [attached_file:224]

  // Map raw recs -> {project, score}
  const materialize = useCallback(
    (recs) => {
      const idToProject = new Map(projects.map((p) => [p.id, p]));
      return (recs || [])
        .map((r) => ({
          project: idToProject.get(r.projectId),
          score: r.score,
        }))
        .filter((x) => x.project);
    },
    [projects]
  ); // [attached_file:224]

  const revalidate = useCallback(async () => {
    if (!currentUser || !minimalProjects.length || !cacheKey) return;
    if (lastRunRef.current === cacheKey) return; // already running for this key
    lastRunRef.current = cacheKey;
    setSuggesting(true);
    setSuggestError("");
    try {
      const recs = await recommendProjectsGemini(userRole, minimalProjects, 6);
      const ranked = materialize(recs);
      setSuggested(ranked);
      safeWrite(cacheKey, { ts: Date.now(), ranked });
    } catch (e) {
      setSuggestError(e?.message ?? "Failed to fetch recommendations");
    } finally {
      setSuggesting(false);
    }
  }, [currentUser, minimalProjects, userRole, cacheKey, materialize]); // [attached_file:224]

  // Load cache fast, then SWR in background if stale/missing
  useEffect(() => {
    if (!currentUser || !minimalProjects.length || !cacheKey) return;
    const cached = safeRead(cacheKey);
    if (cached?.ranked) {
      setSuggested(cached.ranked);
      setSuggesting(false);
    }
    const fresh = !cached || Date.now() - (cached.ts || 0) > TTL_MS;
    if (fresh) revalidate();
  }, [currentUser, minimalProjects, cacheKey, revalidate]); // [attached_file:224]

  // Manual refresh (optional button)
  const refreshRecs = async () => {
    if (!cacheKey) return;
    localStorage.removeItem(cacheKey);
    lastRunRef.current = ""; // allow new run
    await revalidate();
  }; // [attached_file:224]

  if (!currentUser) return null; // [attached_file:224]
  if (loading) return <Loading />; // [attached_file:224]

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
          <div className="flex items-center gap-2">
            {suggesting && (
              <span className="text-xs px-2 py-1 rounded bg-fuchsia-600 text-white">
                Finding matches…
              </span>
            )}
            <button
              className="text-xs rounded border px-2 py-1 hover:bg-gray-100"
              onClick={refreshRecs}
              disabled={suggesting}
              title="Refresh recommendations"
            >
              Refresh
            </button>
          </div>
        </div>
        {suggestError && <p className="text-sm text-red-600">{suggestError}</p>}
        {suggested.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggested.map(({ project, score }) => (
              <div key={project.id} className="p-2 bg-white">
                <ProjectCard
                  id={project.id}
                  project_name={project.name ?? project.project_name}
                  project_desc={project.description ?? project.project_desc}
                  project_link={project.project_link}
                  owner={project.owner}
                  collaborators={project.collaborators}
                  status={project.project_status ?? project.status}
                  stipend={project.stipend}
                  benefits={project.benefits}
                  members_needed={project.members_needed}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs opacity-70">
                    match: {score.toFixed(3)}
                  </span>
                  <button
                    className="text-xs rounded border px-2 py-1 hover:bg-gray-100"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !suggesting ? (
          <p className="text-sm text-gray-600">
            No personalized suggestions yet.
          </p>
        ) : null}
      </section>

      <hr />
      <h2 className="text-lg md:text-2xl my-2 font-semibold">All projects</h2>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  id={project.id}
                  project_name={project.name}
                  project_desc={project.description}
                  project_link={project.project_link}
                  owner={project.owner}
                  collaborators={project.collaborators_id}
                  status={project.project_status}
                  stipend={project.stipend}
                  benefits={project.benefits}
                  members_needed={project.members_needed}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <h1 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
                Oops! No projects found...
              </h1>
              <button
                onClick={() => navigate("/add-project")}
                className="mt-2 px-6 py-3 text-lg font-medium text-fuchsia-500 border border-fuchsia-500 rounded-md hover:bg-fuchsia-500 hover:text-white transition duration-200"
              >
                Add New Project!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
