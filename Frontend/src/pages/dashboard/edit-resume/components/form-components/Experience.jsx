import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Briefcase, Building, MapPin, Calendar, Plus } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        experience: experienceList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Experience");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Experience details updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };
  
  return (
    <div>
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
        </div>
        <p className="text-gray-500 mb-6">Add your relevant work history to showcase your professional journey</p>
        
        {experienceList?.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6">
            <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No experience added yet</h3>
            <p className="text-gray-400 mb-4">Add your work history to make your resume stand out</p>
            <Button 
              onClick={addExperience}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Work Experience
            </Button>
          </div>
        )}
        
        <div className="space-y-8">
          {experienceList?.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>Experience {index + 1}</span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Position Title
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={experience?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Company Name
                  </label>
                  <Input
                    type="text"
                    name="companyName"
                    value={experience?.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={experience?.city || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="e.g. San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    State/Country
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={experience?.state || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="e.g. California"
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
                    value={experience?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
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
                    value={experience?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="col-span-full">
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummary", index)
                    }
                    resumeInfo={resumeInfo}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          {experienceList?.length > 0 && (
            <Button
              onClick={addExperience}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {experienceList?.length > 0 ? "Another" : ""} Experience
            </Button>
          )}
          
          {experienceList?.length > 0 && (
            <Button 
              onClick={onSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Experiences"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Experience;