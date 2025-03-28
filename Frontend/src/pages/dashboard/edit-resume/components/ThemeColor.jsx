import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const colors = [
    "#FF5733", // Red-Orange
    "#3366FF", // Blue
    "#33CC99", // Mint Green
    "#9933CC", // Purple
    "#FF3366", // Pink
    "#33CCFF", // Sky Blue
    "#FF9933", // Orange
    "#66CC33", // Green
    "#CC3366", // Rose
    "#339999", // Teal
    "#6633CC", // Indigo
    "#CC6633", // Brown
    "#336699", // Navy Blue
    "#CC9933", // Gold
    "#993366", // Burgundy
    "#669933", // Olive
    "#333333", // Black
    "#666666", // Dark Gray
    "#0077B5", // LinkedIn Blue
    "#2E77BC", // Professional Blue
  ];

  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || "#333333");
  const [applying, setApplying] = useState(false);
  const { resume_id } = useParams();
  
  const onColorSelect = async (color) => {
    setSelectedColor(color);
    setApplying(true);
    
    dispatch(
      addResumeData({
        ...resumeInfo,
        themeColor: color,
      })
    );
    
    const data = {
      data: {
        themeColor: color,
      },
    };
    
    await updateThisResume(resume_id, data)
      .then(() => {
        toast("Theme color updated", {
          description: "Your resume styling has been refreshed",
        });
      })
      .catch((error) => {
        toast("Error updating theme color", {
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setApplying(false);
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-gray-300 hover:border-primary hover:text-primary transition-all duration-300" 
          size="sm"
        >
          <Palette className="h-4 w-4" /> 
          <span className="hidden sm:inline">Theme</span>
          <div 
            className="h-3 w-3 rounded-full ml-1"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Choose Resume Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: color,
              }}
              title={`Select color ${index + 1}`}
              disabled={applying}
            >
              {selectedColor === color && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          The selected color will be applied to headings, borders, and other accent elements in your resume
        </p>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;