import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import { motion } from "framer-motion";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const fetchAllResumeData = async () => {
    setIsLoading(true);
    try {
      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-16">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header section */}
          <motion.div 
  className="mb-10 text-center pt-20" // Added pt-20 for top padding
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-indigo-600 mb-2">
    My Resume Portfolio
  </h1>
  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
    Create professional, AI-powered resumes tailored for your dream job roles
  </p>
</motion.div>

          {/* View toggle and actions */}
          {resumeList.length > 0 && (
            <motion.div 
              className="flex justify-end mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  List View
                </button>
              </div>
            </motion.div>
          )}

          {/* Dashboard content */}
          <div className="relative">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading your resumes...</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
                  : "flex flex-col space-y-4"
                }
              >
                <motion.div variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                  <AddResume />
                </motion.div>
                
                {resumeList.length > 0 &&
                  resumeList.map((resume) => (
                    <motion.div key={resume._id} variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                      <ResumeCard
                        resume={resume}
                        refreshData={fetchAllResumeData}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            )}

            {!isLoading && resumeList.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center mt-8 max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  No resumes yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Create your first AI-powered resume to showcase your skills and experience
                </p>
                <button 
                  onClick={() => document.querySelector('.add-resume-trigger')?.click()}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition-all hover:from-emerald-600 hover:to-indigo-700"
                >
                  Create New Resume
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;