import React from "react";

interface ViewAnnouncementProps {
  announcement: any;
  onClose: () => void;
}

const ViewAnnouncement: React.FC<ViewAnnouncementProps> = ({ announcement, onClose }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple mb-2">
          Announcement Details
        </h2>
        <p className="text-sm text-gray-600">
          View the full announcement information.
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-500 text-sm">Title</span>
          <p className="text-gray-900 font-semibold text-lg">{announcement.title || "—"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-gray-500 text-sm">Type</span>
            <p className="text-gray-900 capitalize">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  announcement.type === "global"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {announcement.type || "—"}
              </span>
            </p>
          </div>
          
          {announcement.type === "class" && (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-500 text-sm">Class Target</span>
              <p className="text-gray-900 capitalize">{announcement.resolvedClassName || "—"}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="font-medium text-gray-500 text-sm">Date Created</span>
            <p className="text-gray-900">
              {announcement.created_at
                ? new Date(announcement.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          <span className="font-medium text-gray-500 text-sm">Content</span>
          <p className="text-gray-800 whitespace-pre-wrap bg-white p-4 rounded-md border border-gray-200">
            {announcement.content || "—"}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAnnouncement;
