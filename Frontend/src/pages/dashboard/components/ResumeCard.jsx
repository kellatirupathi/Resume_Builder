import React from "react";
import { FaEye, FaEdit, FaTrashAlt, FaSpinner, FaEllipsisV } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-green-400 via-blue-500 to-purple-600",
  "from-red-400 via-yellow-500 to-green-500",
  "from-blue-500 via-teal-400 to-green-300",
  "from-pink-500 via-red-500 to-yellow-500",
  "from-violet-500 via-indigo-400 to-blue-500",
  "from-amber-500 via-orange-400 to-red-500"
];

function ResumeCard({ resume, refreshData, viewMode = "grid" }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  // Use resume._id as a seed for consistent gradient for each resume
  const gradientIndex = resume._id ? resume._id.charCodeAt(0) % gradients.length : 0;
  const gradient = gradients[gradientIndex];
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      await deleteThisResume(resume._id);
      toast("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (viewMode === "list") {
    return (
      <div className="group flex items-center justify-between rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Left side with colored bar and title */}
        <div className="flex items-center">
          <div className={`w-2 self-stretch bg-gradient-to-b ${gradient}`}></div>
          <div className="p-4 pl-6">
            <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-200`}>
              {resume.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Last updated: {formatDate(resume.updatedAt)}
            </p>
          </div>
        </div>
        
        {/* Right side with actions */}
        <div className="flex items-center gap-2 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            title="View Resume"
          >
            <FaEye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            title="Edit Resume"
          >
            <FaEdit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenAlert(true)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 mr-2"
            title="Delete Resume"
          >
            <FaTrashAlt className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
            className={`text-xs bg-gradient-to-r ${gradient} text-white border-none hover:opacity-90 transition-opacity`}
          >
            Continue Editing
          </Button>
        </div>
        
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : "Delete Resume"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="group relative flex flex-col h-full rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Top gradient band */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
      
      {/* Mobile menu button */}
      <div className="absolute top-3 right-3 md:hidden z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          <FaEllipsisV className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </Button>
        
        {/* Mobile menu popup */}
        {showMobileMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={() => {
                  navigate(`/dashboard/view-resume/${resume._id}`);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FaEye className="w-3.5 h-3.5 mr-2 text-indigo-500" /> View Resume
              </button>
              <button
                onClick={() => {
                  navigate(`/dashboard/edit-resume/${resume._id}`);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FaEdit className="w-3.5 h-3.5 mr-2 text-purple-500" /> Edit Resume
              </button>
              <button
                onClick={() => {
                  setOpenAlert(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FaTrashAlt className="w-3.5 h-3.5 mr-2" /> Delete Resume
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Resume title */}
      <div className="p-6 flex-grow">
        <h3 className={`text-xl font-bold text-gray-800 dark:text-gray-200`}>
          {resume.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Last updated: {formatDate(resume.updatedAt)}
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center">
        <div className="hidden md:flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            title="View Resume"
          >
            <FaEye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            title="Edit Resume"
          >
            <FaEdit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenAlert(true)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30"
            title="Delete Resume"
          >
            <FaTrashAlt className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          className={`text-xs bg-gradient-to-r ${gradient} text-white border-none hover:opacity-90 transition-opacity w-full md:w-auto`}
        >
          Continue Editing
        </Button>
      </div>
      
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Delete Resume"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCard;