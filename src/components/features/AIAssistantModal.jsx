import { useState, useEffect } from "react";
import { X } from "lucide-react";

export const AIAssistantModal = ({ isOpen, onClose, taskName }) => {
  const [currentView, setCurrentView] = useState("selection"); // "selection" or "textbox"
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView("selection");
      setSelectedOption("");
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Content configuration for different options
  const getContentConfig = (option) => {
    const configs = {
      "Request for Status Update": {
        title: "Request for Status Update",
        defaultText: `Hi there, just checking in - any updates on task [${
          taskName || "Task Name"
        }]? Let us know if there are any blockers.`,
        placeholder: "Add additional message...",
      },
      "Clarify Requirements": {
        title: "Clarify Requirements",
        defaultText: `Hi there, I need some clarification on the requirements for task [${
          taskName || "Task Name"
        }]. Could you please provide more details about the expected deliverables and any specific constraints?`,
        placeholder: "Add specific questions or clarifications needed...",
      },
      "write status summary": {
        title: "Write Status Summary",
        defaultText: `Status Summary for [${
          taskName || "Task Name"
        }]:\n\nCurrent Progress:\n- \n\nCompleted Tasks:\n- \n\nUpcoming Milestones:\n- \n\nRisks/Blockers:\n- None identified at this time`,
        placeholder: "Edit the status summary...",
      },
      "Detect Risk": {
        title: "Detect Risk",
        defaultText: `Risk Assessment for [${
          taskName || "Task Name"
        }]:\n\nPotential Risks Identified:\n- \n\nImpact Level: [High/Medium/Low]\nLikelihood: [High/Medium/Low]\n\nMitigation Strategies:\n- \n\nRecommended Actions:\n- `,
        placeholder: "Add additional risk analysis...",
      },
      Other: {
        title: "Custom AI Request",
        defaultText: `Custom request regarding task [${
          taskName || "Task Name"
        }]:`,
        placeholder: "Describe what you need help with...",
      },
    };
    return configs[option] || configs["Other"];
  };

  const handleProceed = () => {
    if (selectedOption) {
      const config = getContentConfig(selectedOption);
      setMessage(config.defaultText);
      setCurrentView("textbox");
    }
  };

  const handleBack = () => {
    setCurrentView("selection");
    setMessage("");
  };

  const handleSend = () => {
    // Future backend integration point
    console.log("AI Request:", {
      type: selectedOption,
      taskName,
      content: message,
      timestamp: new Date().toISOString(),
    });

    // For now, just close the modal
    // In the future, this would make an API call
    onClose();
  };

  const handleEdit = () => {
    // Allow user to continue editing
    // Could add additional formatting or AI suggestions here in the future
  };

  // Selection View (Original AI Assistant Modal)
  if (currentView === "selection") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div className="flex justify-end p-4 pb-0">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Hello, I'm Ali! Your AI Assistant.
            </h2>

            <p className="text-gray-600 mb-6">
              What do you need help with today regarding task{" "}
              <span className="font-medium">{taskName}</span>?
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setSelectedOption("Request for Status Update")}
                className={`col-span-1 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                  selectedOption === "Request for Status Update"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Request for Status Update
              </button>
              <button
                onClick={() => setSelectedOption("Clarify Requirements")}
                className={`col-span-1 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                  selectedOption === "Clarify Requirements"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Clarify Requirements
              </button>
              <button
                onClick={() => setSelectedOption("write status summary")}
                className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                  selectedOption === "write status summary"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Write Status Summary
              </button>
              <button
                onClick={() => setSelectedOption("Detect Risk")}
                className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                  selectedOption === "Detect Risk"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Detect Risk
              </button>
              <button
                onClick={() => setSelectedOption("Other")}
                className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                  selectedOption === "Other"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Other
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                CANCEL
              </button>
              <button
                onClick={handleProceed}
                disabled={!selectedOption}
                className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                PROCEED
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Text Box View (Unified with StatusUpdateModal functionality)
  if (currentView === "textbox") {
    const config = getContentConfig(selectedOption);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Back to options"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="font-medium text-lg">{config.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={12}
                placeholder={config.placeholder}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Task: <span className="font-medium">{taskName}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  EDIT
                </button>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
