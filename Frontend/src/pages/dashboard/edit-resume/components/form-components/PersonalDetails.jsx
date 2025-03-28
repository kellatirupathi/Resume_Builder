import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle, User, Briefcase, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
  });

  const handleInputChange = (e) => {
    enanbledNext(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Personal Details Save Started");
    const data = {
      data: {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        jobTitle: e.target.jobTitle.value,
        address: e.target.address.value,
        phone: e.target.phone.value,
        email: e.target.email.value,
      },
    };
    if (resume_id) {
      try {
        const response = await updateThisResume(resume_id, data);
        toast("Resume Updated", "success");
      } catch (error) {
        toast(error.message, `failed`);
        console.log(error.message);
      } finally {
        enanbledNext(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Details</h2>
      <p className="text-gray-500 mb-6">Get started with your basic information</p>

      <form onSubmit={onSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              First Name
            </label>
            <Input
              name="firstName"
              defaultValue={resumeInfo?.firstName}
              required
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Last Name
            </label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.lastName}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="Doe"
            />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Job Title
            </label>
            <Input
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="Software Engineer"
            />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Address
            </label>
            <Input
              name="address"
              required
              defaultValue={resumeInfo?.address}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="123 Main St, City, Country"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone
            </label>
            <Input
              name="phone"
              required
              defaultValue={resumeInfo?.phone}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email
            </label>
            <Input
              name="email"
              required
              defaultValue={resumeInfo?.email}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
              placeholder="john.doe@example.com"
              type="email"
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            {loading ? (
              <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Details"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;