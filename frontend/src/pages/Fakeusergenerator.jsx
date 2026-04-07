import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Download,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const FakeUserGenerator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  // Generator options
  const [options, setOptions] = useState({
    quantity: 5,
    includePassword: false,
    includeAvatar: true,
  });

  // Update option
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate fake users
  const handleGenerate = async () => {
    if (options.quantity < 1 || options.quantity > 500) {
      setError("Quantity must be between 1 and 500");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/fake-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(options),
        },
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setError(null);
      } else {
        setError(data.message || "Failed to generate users");
      }
    } catch (err) {
      console.error("Error generating users:", err);
      setError("Failed to generate users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download as JSON
  const downloadJSON = () => {
    const text = JSON.stringify(users, null, 2);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "fake-users.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download as CSV
  const downloadCSV = () => {
    if (users.length === 0) return;

    // Get all keys from first user
    const headers = Object.keys(users[0]);
    const csv = [headers.join(",")];

    users.forEach((user) => {
      const row = headers.map((header) => {
        const value = user[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === "string" && value.includes(",")) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv.push(row.join(","));
    });

    const text = csv.join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "fake-users.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Toggle show password
  const toggleShowPassword = (userId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Copy as JSON
  const copyAsJSON = () => {
    const text = JSON.stringify(users);
    copyToClipboard(text, "json");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fake User Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate realistic mock user data for testing. Perfect for
            development, testing, and demos.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-6xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>⚙️</span> Generator
              </h2>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                  Quantity:{" "}
                  <span className="text-blue-600">{options.quantity}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={options.quantity}
                  onChange={(e) =>
                    updateOption("quantity", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>500</span>
                </div>
              </div>

              {/* Include Password */}
              <div className="mb-8">
                <button
                  onClick={() =>
                    updateOption("includePassword", !options.includePassword)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                    options.includePassword
                      ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options.includePassword}
                    onChange={() =>
                      updateOption("includePassword", !options.includePassword)
                    }
                    className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include Passwords
                  </span>
                </button>
              </div>

              {/* Include Avatar */}
              <div className="mb-8">
                <button
                  onClick={() =>
                    updateOption("includeAvatar", !options.includeAvatar)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                    options.includeAvatar
                      ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options.includeAvatar}
                    onChange={() =>
                      updateOption("includeAvatar", !options.includeAvatar)
                    }
                    className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include Avatar
                  </span>
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Includes:</strong> Full profile, contact info,
                  company, location, and more realistic data.
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Generate Users
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {users.length > 0 && (
              <>
                {/* Header with Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated Users
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {users.length} fake user{users.length !== 1 ? "s" : ""}{" "}
                      created
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadJSON}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm text-sm"
                      title="Download as JSON"
                    >
                      <Download className="w-4 h-4" />
                      JSON
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm text-sm"
                      title="Download as CSV"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>

                {/* Export Formats */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-700">
                    📋 Copy Format:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* JSON */}
                    <div className="group relative">
                      <button
                        onClick={copyAsJSON}
                        className={`w-full px-3 py-3 text-xs font-medium rounded-lg transition-all border flex flex-col items-center gap-1.5 ${
                          copied === "json"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                        title="Copy as JSON"
                      >
                        {/* <span className="text-lg">{}</span> */}
                        <span className="font-semibold">
                          {copied === "json" ? "✓ Copied" : "JSON"}
                        </span>
                      </button>
                      {/* Tooltip */}
                      <div className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                          <p className="font-semibold mb-1.5 text-blue-300">
                            JSON Array
                          </p>
                          <code className="block bg-black/40 p-2 rounded mb-2 break-all text-gray-200 text-xs">
                            [{users[0].fullName}, ...]
                          </code>
                          <p className="text-gray-300 text-xs">
                            <strong>Use for:</strong> APIs, databases, code
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Copy All */}
                    <div className="group relative">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            users.map((u) => u.email).join("\n"),
                            "emails",
                          )
                        }
                        className={`w-full px-3 py-3 text-xs font-medium rounded-lg transition-all border flex flex-col items-center gap-1.5 ${
                          copied === "emails"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                        title="Copy all emails"
                      >
                        {/* <span className="text-lg">📧</span> */}
                        <span className="font-semibold">
                          {copied === "emails" ? "✓ Copied" : "Emails"}
                        </span>
                      </button>
                      {/* Tooltip */}
                      <div className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                          <p className="font-semibold mb-1.5 text-blue-300">
                            email list
                          </p>
                          <code className="block bg-black/40 p-2 rounded mb-2 break-all text-gray-200 text-xs">
                            {users[0].email}, ...
                          </code>
                          <p className="text-gray-300 text-xs">
                            <strong>Use for:</strong> APIs, databases, code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.userId}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      {/* User Card Header */}
                      <button
                        onClick={() =>
                          setExpandedUser(
                            expandedUser === user.userId ? null : user.userId,
                          )
                        }
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Avatar */}
                          {user.avatar && (
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                          )}

                          {/* User Info */}
                          <div className="text-left min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <span className="ml-2 text-gray-400 flex-shrink-0">
                          {expandedUser === user.userId ? "▼" : "▶"}
                        </span>
                      </button>

                      {/* Expanded Details */}
                      {expandedUser === user.userId && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  USERNAME
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm text-gray-900 font-mono">
                                    {user.username}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        user.username,
                                        `username-${user.userId}`,
                                      )
                                    }
                                    className={`p-1.5 rounded transition-all ${
                                      copied === `username-${user.userId}`
                                        ? "bg-green-100 text-green-700"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  EMAIL
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm text-gray-900 font-mono break-all">
                                    {user.email}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        user.email,
                                        `email-${user.userId}`,
                                      )
                                    }
                                    className={`p-1.5 rounded transition-all flex-shrink-0 ${
                                      copied === `email-${user.userId}`
                                        ? "bg-green-100 text-green-700"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  PHONE
                                </p>
                                <code className="text-sm text-gray-900 font-mono">
                                  {user.phone}
                                </code>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  AGE
                                </p>
                                <p className="text-sm text-gray-900">
                                  {user.age} years
                                </p>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  COMPANY
                                </p>
                                <p className="text-sm text-gray-900">
                                  {user.company}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  JOB TITLE
                                </p>
                                <p className="text-sm text-gray-900">
                                  {user.jobTitle}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  LOCATION
                                </p>
                                <p className="text-sm text-gray-900">
                                  {user.city}, {user.state} {user.zipCode}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  COUNTRY
                                </p>
                                <p className="text-sm text-gray-900">
                                  {user.country}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-600">
                                USER ID
                              </span>
                              <code className="text-xs text-gray-900 font-mono">
                                {user.userId}
                              </code>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-600">
                                IP ADDRESS
                              </span>
                              <code className="text-xs text-gray-900 font-mono">
                                {user.ipAddress}
                              </code>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-600">
                                CREATED
                              </span>
                              <code className="text-xs text-gray-900 font-mono">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </code>
                            </div>

                            {user.password && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-600">
                                  PASSWORD
                                </span>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs text-gray-900 font-mono">
                                    {showPasswords[user.userId]
                                      ? user.password
                                      : "•".repeat(user.password.length)}
                                  </code>
                                  <button
                                    onClick={() =>
                                      toggleShowPassword(user.userId)
                                    }
                                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    {showPasswords[user.userId] ? (
                                      <EyeOff className="w-3 h-3 text-gray-600" />
                                    ) : (
                                      <Eye className="w-3 h-3 text-gray-600" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        user.password,
                                        `password-${user.userId}`,
                                      )
                                    }
                                    className={`p-1.5 rounded transition-all ${
                                      copied === `password-${user.userId}`
                                        ? "bg-green-100 text-green-700"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {users.length === 0 && !loading && (
              <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl mb-4">👤</div>
                  <p className="text-gray-600">
                    Configure options and generate fake users
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Perfect for testing and development
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeUserGenerator;
