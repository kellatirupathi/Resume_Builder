import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, GraduationCap, School, BookOpen, Calendar, Award, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = React.useState(
    resumeInfo?.education || [{ ...formFields }]
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
  };

  const RemoveEducation = (index) => {
    const newList = educationalList.filter((_, i) => i !== index);
    setEducationalList(newList);
  };

  const onSave = () => {
    if (educationalList.length === 0) {
      return toast("Please add at least one education", {
        description: "Education details are important for your resume",
        duration: 3000,
      });
    }
    setLoading(true);
    const data = {
      data: {
        education: educationalList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Education");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Education details updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationalList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setEducationalList(list);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
      </div>
      <p className="text-gray-500 mb-6">Add your educational background to highlight your academic qualifications</p>
      
      {educationalList.length === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6">
          <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-gray-500 font-medium mb-2">No education added yet</h3>
          <p className="text-gray-400 mb-4">Add your educational background to enhance your resume</p>
          <Button 
            onClick={AddNewEducation}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Education
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {educationalList.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span>Education {index + 1}</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                onClick={() => RemoveEducation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  University/Institution Name
                </label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.universityName || ""}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. Harvard University"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Degree
                </label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.degree || ""}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. Bachelor of Science"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Major/Field of Study
                </label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.major || ""}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. Computer Science"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Start Date
                </label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.startDate || ""}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  End Date
                </label>
                <Input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.endDate || ""}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Grade
                </label>
                <div className="flex gap-4">
                  <select
                    name="gradeType"
                    className="py-2 px-4 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all bg-white"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.gradeType || "CGPA"}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  <Input
                    type="text"
                    name="grade"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.grade || ""}
                    className="flex-1 border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="e.g. 3.8"
                  />
                </div>
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Description
                </label>
                <Textarea
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  value={item?.description || ""}
                  className="min-h-24 resize-y border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="Describe relevant coursework, achievements, or activities during your education"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={AddNewEducation}
          className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Education
        </Button>
        
        <Button 
          disabled={loading} 
          onClick={onSave}
          className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
        >
          {loading ? (
            <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Saving...</>
          ) : (
            "Save Education"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Education;