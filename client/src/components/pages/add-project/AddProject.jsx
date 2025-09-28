// AddProject.jsx
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import {
  aiDraftProject,
  aiEnhanceFields,
} from "../../../lib/geminiProjectAssist";

const AddProject = () => {
  const { currentUser } = useContext(UserContext);

  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    project_desc: "",
    project_link: "",
    owner: currentUser && currentUser.id,
    members_needed: "",
    stipend: 0,
    status: "NEW",
    benefits: "",
    // Optional local-only field for tags (not required by backend)
    tags: [],
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  // Keep owner in sync when Clerk user loads
  useEffect(() => {
    if (currentUser?.id) {
      setProjectDetails((p) => ({ ...p, owner: currentUser.id }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]:
        name === "members_needed" || name === "stipend"
          ? value.replace(/[^\d]/g, "")
          : value,
    }));
  };

  const validate = () => {
    const required = {
      project_name: projectDetails.project_name,
      project_desc: projectDetails.project_desc,
    };
    return Object.values(required).every((v) => (v ?? "") !== "");
  };

  // AI: Draft from a short idea (fills empty or weak fields)
  const handleAIDraft = async () => {
    try {
      setBusy(true);
      const draft = await aiDraftProject({
        idea,
        existing: {
          name: projectDetails.project_name,
          description: projectDetails.project_desc,
          benefits: projectDetails.benefits,
        },
      });
      setProjectDetails((p) => ({
        ...p,
        project_name: draft.project_name || p.project_name,
        project_desc: draft.project_desc || p.project_desc,
        benefits: draft.benefits || p.benefits,
        members_needed:
          draft.members_needed !== "" && draft.members_needed != null
            ? String(draft.members_needed)
            : p.members_needed,
        tags: Array.isArray(draft.tags) ? draft.tags : p.tags,
      }));
    } catch (e) {
      console.error(e);
      window.alert(e?.message ?? "AI draft failed");
    } finally {
      setBusy(false);
    }
  };

  // AI: Enhance current fields (keeps semantics, improves clarity)
  const handleAIEnhance = async () => {
    try {
      setBusy(true);
      const out = await aiEnhanceFields({
        name: projectDetails.project_name,
        description: projectDetails.project_desc,
        benefits: projectDetails.benefits,
      });
      setProjectDetails((p) => ({
        ...p,
        project_name: out.project_name || p.project_name,
        project_desc: out.project_desc || p.project_desc,
        benefits: out.benefits || p.benefits,
      }));
    } catch (e) {
      console.error(e);
      window.alert(e?.message ?? "AI enhance failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please fill all the required fields");
      return;
    }
    try {
      setBusy(true);
      await axios.post(`${process.env.API_URL}/projects`, {
        project_name: projectDetails.project_name,
        project_desc: projectDetails.project_desc,
        project_link: projectDetails.project_link,
        owner: projectDetails.owner,
        members_needed:
          projectDetails.members_needed === ""
            ? null
            : Number(projectDetails.members_needed),
        stipend:
          projectDetails.stipend === "" ? 0 : Number(projectDetails.stipend),
        status: projectDetails.status,
        benefits: projectDetails.benefits,
      });
      window.alert("Project added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding project:", error);
      window.alert("Failed to add the project. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 2500);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-[80%] mx-auto border p-4 mb-3"
    >
      {/* AI assist toolbar */}
      <div className="rounded border p-3 bg-white">
        <label className="block text-sm font-medium mb-1">
          Quick idea (optional)
        </label>
        <textarea
          className="w-full border rounded p-2"
          placeholder="Describe your project idea in 1-2 sentences"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        {!projectDetails.project_name &&
        !projectDetails.project_desc &&
        !projectDetails.benefits ? (
          <button
            type="button"
            disabled={busy || !idea}
            className="text-xs rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-20 "
            onClick={handleAIDraft}
            title="Draft name, description, benefits, tags, members using Gemini"
          >
            Generate Project Details
          </button>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              className="text-xs rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              onClick={handleAIDraft}
              title="Draft name, description, benefits, tags, members using Gemini"
            >
              AI Draft
            </button>
            <button
              type="button"
              disabled={busy}
              className="text-xs rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              onClick={handleAIEnhance}
              title="Enhance clarity for name, description, and benefits"
            >
              AI Enhance
            </button>
            {busy && (
              <span className="ml-auto text-xs px-2 py-1 bg-fuchsia-600 text-white rounded">
                Working…
              </span>
            )}
          </div>
        )}
      </div>

      {/* Project name */}
      <div>
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <input
          type="text"
          name="project_name"
          className="w-full border rounded p-2"
          placeholder="e.g., Real-time Recruiter Portal"
          value={projectDetails.project_name}
          onChange={handleChange}
        />
      </div>

      {/* Project description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="project_desc"
          className="w-full border rounded p-2"
          rows={5}
          placeholder="Briefly explain scope, core features, and tech stack"
          value={projectDetails.project_desc}
          onChange={handleChange}
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm font-medium mb-1">Benefits</label>
        <textarea
          name="benefits"
          className="w-full border rounded p-2"
          rows={3}
          placeholder="• Internship certificate
• Mentorship
• Stipend eligibility"
          value={projectDetails.benefits}
          onChange={handleChange}
        />
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Project Link (optional)
        </label>
        <input
          type="url"
          name="project_link"
          className="w-full border rounded p-2"
          placeholder="https://github.com/org/repo"
          value={projectDetails.project_link}
          onChange={handleChange}
        />
      </div>

      {/* Members, stipend, status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Members Needed
          </label>
          <input
            type="text"
            inputMode="numeric"
            name="members_needed"
            className="w-full border rounded p-2"
            placeholder="e.g., 3"
            value={projectDetails.members_needed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stipend</label>
          <input
            type="text"
            inputMode="numeric"
            name="stipend"
            className="w-full border rounded p-2"
            placeholder="e.g., 5000"
            value={String(projectDetails.stipend ?? "")}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            className="w-full border rounded p-2"
            value={projectDetails.status}
            onChange={handleChange}
          >
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FILLED">FILLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Tags preview (local-only) */}
      {Array.isArray(projectDetails.tags) && projectDetails.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {projectDetails.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 flex justify-center">
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="bg-fuchsia-600 text-white w-[20vw] px-8 py-2 rounded-md hover:text-black disabled:opacity-50"
        >
          {busy ? "Saving..." : "Add Project"}
        </button>
      </div>
    </form>
  );
};

export default AddProject;
