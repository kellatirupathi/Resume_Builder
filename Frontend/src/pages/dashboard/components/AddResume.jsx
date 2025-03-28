import React from "react";
import { useState } from "react";
import { CopyPlus, Loader, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume({ viewMode = "grid" }) {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "") {
      toast("Please add a title to your resume");
      setLoading(false);
      return;
    }
      
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };
    
    console.log(`Creating Resume ${resumetitle}`);
    try {
      const res = await createNewResume(data);
      console.log("Response from Create Resume:", res);
      navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setLoading(false);
      setResumetitle("");
      setOpenDialog(false);
    }
  };
  
  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={() => setOpenDialog(true)}
          className="add-resume-trigger flex items-center justify-between rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 group cursor-pointer"
        >
          <div className="flex items-center">
            <div className="w-2 self-stretch bg-gradient-to-b from-emerald-400 to-indigo-500"></div>
            <div className="p-4 pl-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-500 transition-colors">
                Create New Resume
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Design a professional resume with AI assistance
              </p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        <CreateResumeDialog
          isOpen={isDialogOpen}
          setIsOpen={setOpenDialog}
          title={resumetitle}
          setTitle={setResumetitle}
          onCreate={createResume}
          loading={loading}
        />
      </>
    );
  }
  
  return (
    <>
      <div
        onClick={() => setOpenDialog(true)}
        className="add-resume-trigger flex flex-col items-center justify-center h-full rounded-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 cursor-pointer group transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm hover:shadow-md"
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
          <CopyPlus className="w-8 h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-500 transition-colors">Create New Resume</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          Design a professional resume with AI assistance
        </p>
      </div>

      <CreateResumeDialog
        isOpen={isDialogOpen}
        setIsOpen={setOpenDialog}
        title={resumetitle}
        setTitle={setResumetitle}
        onCreate={createResume}
        loading={loading}
      />
    </>
  );
}

// Extracted dialog component for reusability
function CreateResumeDialog({ isOpen, setIsOpen, title, setTitle, onCreate, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-indigo-600">
            Create a New Resume
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Give your resume a name that reflects the job role you're targeting
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <Input
            className="w-full focus-visible:ring-emerald-500/30 focus-visible:ring-offset-0"
            type="text"
            placeholder="Ex: Software Engineer Resume"
            value={title}
            onChange={(e) => setTitle(e.target.value.trimStart())}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            This will help you organize multiple resumes for different positions
          </p>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            disabled={!title || loading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Resume"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;